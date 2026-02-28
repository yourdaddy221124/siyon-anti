import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import './Auth.css';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { user, loading, signIn: setAuthUser } = useAuth();
    const createProfile = useMutation(api.users.createProfile);

    // Redirect if already logged in
    if (!loading && user) {
        return <Navigate to="/chat" replace />;
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            setIsLoading(false);
            return;
        }

        try {
            // Create profile in Convex including password
            const userData = await createProfile({
                email: email,
                password: password,
                full_name: name,
                subscription_status: 'Active',
                subscription_tier: 'Free'
            });

            if (userData) {
                // Fetch the full object for context
                setAuthUser({
                    _id: userData,
                    email: email,
                    full_name: name,
                    subscription_status: 'Active',
                    subscription_tier: 'Free'
                });
                navigate('/chat');
            }
        } catch (error) {
            console.error("Registration error:", error);
            setError(error.message || 'Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Link to="/" className="auth-brand">
                <Sparkles className="brand-icon" size={24} />
                <span>Mind Ease</span>
            </Link>

            <div className="auth-card glass-panel animate-fade-in">
                <div className="auth-header">
                    <h2>Create an account</h2>
                    <p>Begin your journey to better mental well-being.</p>
                </div>

                {error && (
                    <div className="auth-error animate-fade-in">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="auth-success animate-fade-in" style={{
                        display: 'flex', alignItems: 'flex-start', gap: '8px',
                        padding: '12px 16px', borderRadius: '10px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#10b981', marginBottom: '16px',
                        fontSize: '0.875rem', lineHeight: '1.5'
                    }}>
                        <CheckCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span>{success}</span>
                    </div>
                )}

                {!success && (
                    <form className="auth-form" onSubmit={handleRegister}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={18} />
                                <input
                                    type="text"
                                    required
                                    className="auth-input"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="auth-input"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="auth-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <span className="input-hint">Must be at least 6 characters</span>
                        </div>

                        <button type="submit" className="btn btn-primary full-width" disabled={isLoading}>
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>
                )}

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Register;
