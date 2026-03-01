import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("AuthContext: Initializing...");

        const initializeAuth = async () => {
            console.log("AuthContext: Starting initialization...");
            const timeout = setTimeout(() => {
                if (loading) {
                    console.warn("AuthContext: Initialization timed out. Forcing load state...");
                    setLoading(false);
                }
            }, 8000); // 8s safety timeout

            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                if (session?.user) {
                    console.log("AuthContext: Session found for", session.user.email);
                    await fetchProfile(session.user.id, session.user.email);
                } else {
                    console.log("AuthContext: No initial session.");
                    setLoading(false);
                }
            } catch (err) {
                console.error("AuthContext: Init Error", err);
                setLoading(false);
            } finally {
                clearTimeout(timeout);
            }
        };

        initializeAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("AuthContext: onAuthStateChange event:", event, "User:", session?.user?.email);

            if (session?.user) {
                setLoading(true);
                await fetchProfile(session.user.id, session.user.email);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId, email) => {
        console.log("AuthContext: Fetching profile for", email);
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    console.log("AuthContext: Profile not found in database yet.");
                } else if (error.message.includes("406") || error.code === "406") {
                    console.error("AuthContext: 406 Error - Possible database schema or permission issue.");
                } else {
                    console.error("AuthContext: Profile fetch error", error);
                }
            } else {
                console.log("AuthContext: Profile fetched successfully:", data);
            }

            setUser({
                id: userId,
                email: email,
                ...(data || {})
            });
        } catch (e) {
            console.error("AuthContext: unexpected error in fetchProfile", e);
        } finally {
            console.log("AuthContext: Setting loading to false");
            setLoading(false);
        }
    };

    const signIn = (userData) => {
        // Handled completely by Supabase auth listener now.
        // We leave this here for backwards compatibility if needed during migration.
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
