import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { user: authUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUserProfile, setCurrentUserProfile] = useState(null);

    useEffect(() => {
        fetchAllProfiles();
        if (authUser?.id) {
            fetchUserProfile(authUser.id);
        } else {
            setCurrentUserProfile(null);
        }
    }, [authUser]);

    const fetchAllProfiles = async () => {
        if (!authUser) {
            setUsers([]);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching profiles:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            setCurrentUserProfile(data);
        } catch (error) {
            console.error('Error fetching current profile:', error.message);
        }
    };

    const toggleUserStatus = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Canceled' : 'Active';
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ subscription_status: newStatus })
                .eq('id', userId);

            if (error) throw error;
            fetchAllProfiles(); // Refresh list
        } catch (error) {
            console.error('Error toggling status:', error.message);
        }
    };

    const upgradeSubscription = async (tier) => {
        if (!authUser) return;
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ subscription_tier: tier, subscription_status: 'Active' })
                .eq('id', authUser.id);

            if (error) throw error;
            fetchUserProfile(authUser.id); // Refresh current
            fetchAllProfiles(); // Refresh list
        } catch (error) {
            console.error('Error upgrading:', error.message);
        }
    };

    const deleteUser = async (userId) => {
        try {
            const { error } = await supabase
                .from('user_profiles')
                .delete()
                .eq('id', userId);

            if (error) throw error;
            fetchAllProfiles(); // Refresh list
        } catch (error) {
            console.error('Error deleting user:', error.message);
        }
    };

    const getDynamicStats = () => {
        const totalUsers = users.length;
        const premiumUsers = users.filter(u => u.subscription_tier?.includes('Premium') && u.subscription_status === 'Active').length;

        const estimatedMRR = users.reduce((total, user) => {
            if (user.subscription_status !== 'Active') return total;
            if (user.subscription_tier === 'Premium Monthly') return total + 999;
            if (user.subscription_tier === 'Premium Annual') return total + 799;
            return total;
        }, 0);

        return { totalUsers, premiumUsers, estimatedMRR };
    };

    return (
        <DataContext.Provider value={{ users, loading, currentUserProfile, toggleUserStatus, upgradeSubscription, deleteUser, getDynamicStats }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
