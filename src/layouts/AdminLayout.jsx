import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, ShieldAlert } from 'lucide-react';
import SettingsModal from '../components/SettingsModal';
import './AdminLayout.css';

function AdminLayout() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className="admin-layout">
            {/* Admin Sidebar */}
            <aside className="admin-sidebar glass-panel">
                <div className="admin-brand">
                    <ShieldAlert className="admin-icon" size={24} />
                    <h2>Admin Panel</h2>
                </div>

                <nav className="admin-nav">
                    <Link to="/admin" className="admin-nav-item active">
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <a href="#" className="admin-nav-item">
                        <Users size={18} /> User Management
                    </a>
                    <button className="admin-nav-item border-none" onClick={() => setIsSettingsOpen(true)} style={{ background: 'transparent', width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer' }}>
                        <Settings size={18} /> System Settings
                    </button>
                </nav>

                <div className="admin-footer">
                    <Link to="/" className="admin-nav-item">
                        <LogOut size={18} /> Exit Admin
                    </Link>
                </div>
            </aside>

            {/* Main Admin Content Area */}
            <main className="admin-main">
                <header className="admin-header glass-panel">
                    <h3>Mind Ease Overview</h3>
                    <div className="admin-profile">
                        <span className="profile-badge">Super Admin</span>
                    </div>
                </header>

                <div className="admin-content-scroll">
                    <Outlet /> {/* Renders child admin routes */}
                </div>
            </main>

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    );
}

export default AdminLayout;
