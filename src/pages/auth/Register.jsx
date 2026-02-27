import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { user, loading } = useAuth();

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
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name
                    }
                }
            });

            if (error) throw error;

            // Check if user already exists (Supabase returns user but with identities=[])
            if (data?.user && data.user.identities && data.user.identities.length === 0) {
                setError('An account with this email already exists. Please sign in instead.');
                return;
            }

            // Check if email confirmation is required
            if (data?.user && !data.session) {
                setSuccess('Account created! Please check your email and click the confirmation link to activate your account.');
            } else if (data?.session) {
                // Email confirmation disabled — logged in immediately
                navigate('/chat');
            }
        } catch (error) {
            if (error.message === 'Failed to fetch' || error.message.includes('NetworkError') || error.message.includes('network') || error.name === 'TypeError') {
                setError('Network error — cannot reach the server. Please check your internet connection and try again.');
            } else if (error.message.includes('rate limit') || error.message.includes('over_email_send_rate_limit')) {
                setError('Too many signup attempts. Please wait a few minutes and try again.');
            } else if (error.message.includes('User already registered')) {
                setError('An account with this email already exists. Please sign in instead.');
            } else {
                setError(error.message);
            }
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
