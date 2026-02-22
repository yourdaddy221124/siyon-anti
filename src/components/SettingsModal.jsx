import React from 'react';
import { X, Bell, Shield, User, Globe } from 'lucide-react';
import './SettingsModal.css';

function SettingsModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>System Settings</h3>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="settings-body">
                    <div className="setting-group">
                        <h4 className="setting-title"><User size={16} /> Account Profile</h4>
                        <div className="setting-item">
                            <span>Public Profile</span>
                            <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="setting-item">
                            <span>Two-Factor Auth</span>
                            <label className="toggle-switch">
                                <input type="checkbox" />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>

                    <div className="setting-group">
                        <h4 className="setting-title"><Bell size={16} /> Notifications</h4>
                        <div className="setting-item">
                            <span>Email Updates</span>
                            <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="setting-item">
                            <span>Push Notifications</span>
                            <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>

                    <div className="setting-group">
                        <h4 className="setting-title"><Shield size={16} /> Privacy</h4>
                        <div className="setting-item">
                            <span>Share Anonymous Analytics</span>
                            <label className="toggle-switch">
                                <input type="checkbox" />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-primary btn-sm full-width" onClick={onClose}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SettingsModal;
