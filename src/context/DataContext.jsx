import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleUserStatus = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Canceled' : 'Active';

        // Optimistic UI update
        setUsers(prevUsers =>
            prevUsers.map(u => u.id === userId ? { ...u, subscription_status: newStatus } : u)
        );

        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ subscription_status: newStatus })
                .eq('id', userId);

            if (error) throw error;
        } catch (error) {
            console.error('Error toggling status:', error.message);
            // Revert on error
            fetchUsers();
        }
    };

    const deleteUser = async (userId) => {
        // Optimistic UI update
        setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));

        try {
            const { error } = await supabase
                .from('user_profiles')
                .delete()
                .eq('id', userId);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting user:', error.message);
            // Revert on error
            fetchUsers();
        }
    };

    const getDynamicStats = () => {
        const totalUsers = users.length;
        const premiumUsers = users.filter(u => u.subscription_tier.includes('Premium') && u.subscription_status === 'Active').length;

        const estimatedMRR = users.reduce((total, user) => {
            if (user.subscription_status !== 'Active') return total;
            if (user.subscription_tier === 'Premium Monthly') return total + 999;
            if (user.subscription_tier === 'Premium Annual') return total + 799;
            return total;
        }, 0);

        return { totalUsers, premiumUsers, estimatedMRR };
    };

    return (
        <DataContext.Provider value={{ users, loading, toggleUserStatus, deleteUser, getDynamicStats }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
