import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, MessageSquare, Settings, PlusCircle, CreditCard, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SettingsModal from './SettingsModal';
import './Sidebar.css';

function Sidebar({ isOpen, toggleSidebar }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const recentChats = [
        { id: 1, title: 'Processing anxiety' },
        { id: 2, title: 'Reflection on work' },
        { id: 3, title: 'Morning check-in' },
    ];

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
                        <ul className="chat-list">
                            {recentChats.map((chat) => (
                                <li key={chat.id} className="chat-item">
                                    <MessageSquare size={16} />
                                    <span>{chat.title}</span>
                                </li>
                            ))}
                        </ul>
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
                </div>
            </aside>
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </>
    );
}

export default Sidebar;
