import React, { useState } from 'react';
import { X, CreditCard, Loader, CheckCircle } from 'lucide-react';
import './CheckoutOverlay.css';

function CheckoutOverlay({ isOpen, planName, planPrice, onClose }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleCheckout = (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate network request to payment gateway
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);

            // Auto close after success
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
            }, 2000);

        }, 2000);
    };

    return (
        <div className="modal-overlay">
            <div className="checkout-content glass-panel animate-fade-in">
                <button className="close-btn abs-close" onClick={onClose} disabled={isProcessing}><X size={20} /></button>

                {!isSuccess ? (
                    <>
                        <div className="checkout-header">
                            <h3>Upgrade to {planName}</h3>
                            <div className="checkout-price">
                                <span className="price-amount">{planPrice}</span>
                            </div>
                        </div>

                        <form className="checkout-form" onSubmit={handleCheckout}>
                            <div className="form-group">
                                <label>Card Information</label>
                                <div className="mock-card-input">
                                    <CreditCard size={18} className="text-secondary" />
                                    <input required type="text" placeholder="0000 0000 0000 0000" minLength="16" maxLength="16" />
                                </div>
                                <div className="card-details">
                                    <input required type="text" placeholder="MM/YY" maxLength="5" />
                                    <input required type="text" placeholder="CVC" maxLength="4" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Cardholder Name</label>
                                <input required type="text" className="standard-input" placeholder="Name on card" />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary full-width checkout-btn"
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <span className="flex-center"><Loader className="spin" size={18} style={{ marginRight: '8px' }} /> Processing...</span>
                                ) : (
                                    `Pay ${planPrice}`
                                )}
                            </button>
                        </form>
                        <p className="secure-badge">🔒 Secured by Mock Stripe</p>
                    </>
                ) : (
                    <div className="success-state animate-fade-in">
                        <CheckCircle size={48} className="success-icon" />
                        <h3>Payment Successful!</h3>
                        <p>Welcome to {planName}. Your account has been upgraded.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CheckoutOverlay;
