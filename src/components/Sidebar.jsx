import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, MessageSquare, Settings, PlusCircle, CreditCard, Sparkles, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SettingsModal from './SettingsModal';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

function Sidebar({ isOpen, toggleSidebar }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };
    const recentChats = []; // Removed hardcoded chats to prevent cross-user confusion

    return (
        <>
            <aside className={`sidebar glass-panel ${isOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link to="/" className="sidebar-brand">
                            <Sparkles className="brand-icon" size={20} />
                            <h2>Mind Ease</h2>
                        </Link>
                        <ThemeToggle />
                    </div>
                    <button className="new-chat-btn btn btn-primary">
                        <PlusCircle size={18} /> New Chat
                    </button>
                </div>

                <div className="sidebar-content">
                    <div className="sidebar-section">
                        <h3 className="section-title">Recent Chats</h3>
                        {recentChats.length > 0 ? (
                            <ul className="chat-list">
                                {recentChats.map((chat) => (
                                    <li key={chat.id} className="chat-item">
                                        <MessageSquare size={16} />
                                        <span>{chat.title}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="empty-chats">
                                <p>No recent chats found.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="sidebar-footer">
                    <Link to="/" className="sidebar-link">
                        <Home size={18} /> Home
                    </Link>
                    <Link to="/subscription" className="sidebar-link premium-link">
                        <CreditCard size={18} /> Upgrade Plan
                    </Link>
                    <button className="sidebar-link border-none" onClick={() => setIsSettingsOpen(true)}>
                        <Settings size={18} /> Settings
                    </button>
                    {user && (
                        <div className="user-profile-badge">
                            <div className="user-info">
                                <span className="user-email">{user.email}</span>
                                <span className="user-status">Online</span>
                            </div>
                            <button className="logout-btn" onClick={handleLogout} title="Sign Out">
                                <LogOut size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </aside>
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </>
    );
}

export default Sidebar;
