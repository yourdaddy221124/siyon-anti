import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, Zap, Shield, HeartHandshake } from 'lucide-react';
import CheckoutOverlay from '../components/CheckoutOverlay';
import './Subscription.css';

function Subscription() {
    const [isAnnual, setIsAnnual] = useState(true);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    return (
        <div className="subscription-page">
            <nav className="sub-nav">
                <Link to="/" className="back-link">
                    <ArrowLeft size={20} /> Back to Home
                </Link>
            </nav>

            <main className="sub-main">
                <div className="sub-header animate-fade-in">
                    <h1 className="sub-title">Invest in your <span className="text-gradient">peace of mind</span></h1>
                    <p className="sub-subtitle">Choose the plan that fits your journey. Cancel anytime.</p>

                    <div className="billing-toggle glass-panel">
                        <button
                            className={`toggle-btn ${!isAnnual ? 'active' : ''}`}
                            onClick={() => setIsAnnual(false)}
                        >
                            Monthly
                        </button>
                        <button
                            className={`toggle-btn ${isAnnual ? 'active' : ''}`}
                            onClick={() => setIsAnnual(true)}
                        >
                            Annually <span className="save-badge">Save 20%</span>
                        </button>
                    </div>
                </div>

                <div className="pricing-cards animate-fade-in delay-100">
                    {/* Free Tier */}
                    <div className="pricing-card glass-panel">
                        <div className="card-header">
                            <h3>Basic Ease</h3>
                            <div className="price">
                                <span className="amount">₹0</span>
                                <span className="period">/forever</span>
                            </div>
                            <p className="card-desc">Essential tools for daily check-ins.</p>
                        </div>
                        <ul className="feature-list">
                            <li><CheckCircle2 className="check-icon" size={18} /> 5 chats per day</li>
                            <li><CheckCircle2 className="check-icon" size={18} /> Basic mood tracking</li>
                            <li><CheckCircle2 className="check-icon" size={18} /> Standard AI responses</li>
                            <li className="disabled"><Shield className="check-icon disabled" size={18} /> Detailed insights</li>
                            <li className="disabled"><HeartHandshake className="check-icon disabled" size={18} /> Priority support</li>
                        </ul>
                        <Link to="/chat" className="btn btn-secondary full-width mt-auto">
                            Current Plan
                        </Link>
                    </div>

                    {/* Premium Tier */}
                    <div className="pricing-card glass-panel premium-card">
                        <div className="popular-badge">
                            <Zap size={14} /> Most Popular
                        </div>
                        <div className="card-header">
                            <h3>Premium Peace</h3>
                            <div className="price text-accent">
                                <span className="amount">₹{isAnnual ? '799' : '999'}</span>
                                <span className="period">/month</span>
                            </div>
                            <p className="card-desc">Unlimited access and deep emotional insights.</p>
                        </div>
                        <ul className="feature-list">
                            <li><CheckCircle2 className="check-icon text-accent" size={18} /> Unlimited 24/7 chats</li>
                            <li><CheckCircle2 className="check-icon text-accent" size={18} /> Advanced mood patterns</li>
                            <li><CheckCircle2 className="check-icon text-accent" size={18} /> Memory & context retention</li>
                            <li><CheckCircle2 className="check-icon text-accent" size={18} /> Cognitive behavioral tools</li>
                            <li><CheckCircle2 className="check-icon text-accent" size={18} /> Priority support</li>
                        </ul>
                        <button
                            className="btn btn-primary full-width mt-auto"
                            onClick={() => setIsCheckoutOpen(true)}
                        >
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </main>

            <CheckoutOverlay
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                planName={isAnnual ? "Premium Annual" : "Premium Monthly"}
                planPrice={isAnnual ? "₹799" : "₹999"}
            />
        </div>
    );
}

export default Subscription;
