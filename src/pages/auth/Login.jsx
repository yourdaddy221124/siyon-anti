import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import './Auth.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user, loading, signIn: setAuthUser } = useAuth();
    const convexSignIn = useMutation(api.users.signIn);

    // Redirect if already logged in
    if (!loading && user) {
        return <Navigate to="/chat" replace />;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const userData = await convexSignIn({ email, password });
            if (userData) {
                setAuthUser(userData);
                navigate('/chat');
            } else {
                setError('Incorrect email or password. Please try again.');
            }
        } catch (error) {
            console.error("Login error:", error);
            setError(error.message || 'Failed to sign in. Please check your connection.');
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
                    <h2>Welcome back</h2>
                    <p>Sign in to continue your mental wellness journey.</p>
                </div>

                {error && (
                    <div className="auth-error animate-fade-in">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                <form className="auth-form" onSubmit={handleLogin}>
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
                    </div>

                    <div className="auth-actions">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>

                    <button type="submit" className="btn btn-primary full-width" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register" className="auth-link">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;
