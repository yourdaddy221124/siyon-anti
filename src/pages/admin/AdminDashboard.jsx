import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Users, CreditCard, Activity, Search, Trash2, RefreshCcw } from 'lucide-react';
import './AdminDashboard.css';

function AdminDashboard() {
    const { users, loading, getDynamicStats, toggleUserStatus, deleteUser } = useData();
    const stats = getDynamicStats();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user =>
        (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="admin-dashboard animate-fade-in">
            <div className="admin-page-header">
                <h2>Dashboard Overview</h2>
                <p>Monitor user activity and subscription revenue.</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper users"><Users size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Total Users</span>
                        <span className="stat-value">{stats.totalUsers}</span>
                    </div>
                </div>
                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper premium"><Activity size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Active Premium Users</span>
                        <span className="stat-value">{stats.premiumUsers}</span>
                    </div>
                </div>
                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper revenue"><CreditCard size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Estimated MRR</span>
                        <span className="stat-value">₹{stats.estimatedMRR.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Users Data Table */}
            <div className="table-container glass-panel">
                <div className="table-header">
                    <h3>User Directory</h3>
                    <div className="search-wrapper">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="admin-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Join Date</th>
                                <th>Subscription Plan</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center" style={{ padding: '2rem' }}>Loading user data...</td>
                                </tr>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td className="monospace text-secondary" title={user.id}>{user.id.substring(0, 8)}...</td>
                                        <td className="font-medium">{user.full_name || 'Anonymous User'}</td>
                                        <td className="text-secondary">{user.email || 'Hidden'}</td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`plan-badge ${user.subscription_tier.includes('Premium') ? 'premium' : 'free'}`}>
                                                {user.subscription_tier}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${user.subscription_status.toLowerCase()}`}>
                                                {user.subscription_status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-actions">
                                                <button
                                                    className="action-btn toggle"
                                                    onClick={() => toggleUserStatus(user.id, user.subscription_status)}
                                                    title={user.subscription_status === 'Active' ? 'Cancel Subscription' : 'Reactivate'}
                                                >
                                                    <RefreshCcw size={16} />
                                                </button>
                                                <button
                                                    className="action-btn delete"
                                                    onClick={() => deleteUser(user.id)}
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center no-results">No users found matching "{searchTerm}"</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
