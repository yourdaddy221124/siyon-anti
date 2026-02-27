import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    // Redirect if already logged in
    if (!loading && user) {
        return <Navigate to="/chat" replace />;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data?.user) {
                navigate('/chat');
            }
        } catch (error) {
            if (error.message === 'Failed to fetch' || error.message.includes('NetworkError') || error.message.includes('network') || error.name === 'TypeError') {
                setError('Network error — cannot reach the server. Please check your internet connection and try again.');
            } else if (error.message.includes('Invalid login credentials')) {
                setError('Incorrect email or password. Please try again.');
            } else if (error.message.includes('Email not confirmed')) {
                setError('Please confirm your email address before logging in. Check your inbox.');
            } else if (error.message.includes('Too many requests')) {
                setError('Too many login attempts. Please wait a moment and try again.');
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
