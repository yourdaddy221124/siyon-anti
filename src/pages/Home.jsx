import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Shield, Heart, Zap } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import './Home.css';

function Home() {
    return (
        <div className="home-container">
            {/* Navigation */}
            <nav className="navbar glass-panel">
                <div className="nav-brand">
                    <Sparkles className="brand-icon" />
                    <span>Mind Ease</span>
                </div>
                <div className="nav-links">
                    <ThemeToggle />
                    <Link to="/subscription" className="nav-link">Pricing</Link>
                    <Link to="/login" className="nav-link">Sign In</Link>
                    <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="hero-section">
                <div className="hero-content">
                    <div className="badge animate-fade-in">
                        <span className="badge-dot"></span>
                        Your AI Mental Companion
                    </div>
                    <h1 className="hero-title animate-fade-in delay-100">
                        A safe space to <span className="text-gradient">process your thoughts</span>.
                    </h1>
                    <p className="hero-description animate-fade-in delay-200">
                        Mind Ease is an intelligent companion available 24/7. It's not therapy, it's just a confidential place to untangle your mind and find your calm.
                    </p>
                    <div className="hero-actions animate-fade-in delay-300">
                        <Link to="/register" className="btn btn-primary btn-lg">
                            Start Talking <ArrowRight size={18} className="ml-2" />
                        </Link>
                        <Link to="/subscription" className="btn btn-secondary btn-lg">
                            View Plans
                        </Link>
                    </div>
                </div>

                {/* Features / Visuals */}
                <div className="hero-visuals animate-fade-in delay-300">
                    <div className="glass-panel feature-card card-1">
                        <Heart className="feature-icon" />
                        <h3>No Judgment</h3>
                        <p>Express yourself freely in a completely private environment.</p>
                    </div>
                    <div className="glass-panel feature-card card-2">
                        <Zap className="feature-icon" />
                        <h3>Instant Support</h3>
                        <p>Available anytime, absolutely no waitlists.</p>
                    </div>
                    <div className="glass-panel feature-card card-3">
                        <Shield className="feature-icon" />
                        <h3>Confidential</h3>
                        <p>Your conversations are secure and tracking-free.</p>
                    </div>
                </div>
            </main>

            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} Mind Ease. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home;
