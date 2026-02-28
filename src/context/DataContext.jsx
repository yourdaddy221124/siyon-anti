import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { user: authUser } = useAuth();
    const rawUsers = useQuery(api.users.getProfiles);
    const currentUserProfile = useQuery(api.users.getByEmail, authUser?.email ? { email: authUser.email } : "skip");

    const updateStatsMutation = useMutation(api.users.updateStatus);
    const updateTierMutation = useMutation(api.users.updateTier);
    const deleteUserMutation = useMutation(api.users.deleteUser);

    // Fallback while loading
    const users = (rawUsers || []).map(user => ({
        ...user,
        id: user._id, // Normalize ID if needed by UI
    }));
    const loading = rawUsers === undefined || (authUser && currentUserProfile === undefined);

    const toggleUserStatus = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Canceled' : 'Active';
        try {
            await updateStatsMutation({ id: userId, status: newStatus });
        } catch (error) {
            console.error('Error toggling status:', error.message);
        }
    };

    const upgradeSubscription = async (tier) => {
        if (!currentUserProfile) return;
        try {
            await updateTierMutation({ id: currentUserProfile._id, tier });
        } catch (error) {
            console.error('Error upgrading:', error.message);
        }
    };

    const deleteUser = async (userId) => {
        try {
            await deleteUserMutation({ id: userId });
        } catch (error) {
            console.error('Error deleting user:', error.message);
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
        <DataContext.Provider value={{ users, loading, currentUserProfile, toggleUserStatus, upgradeSubscription, deleteUser, getDynamicStats }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
