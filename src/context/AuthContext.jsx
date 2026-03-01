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
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("AuthContext: onAuthStateChange event:", event, "User:", session?.user?.email);

            if (session?.user) {
                // We sync the user object but DON'T set loading(true) again
                // This prevents re-blocking the entire app if profile fetch is slow
                fetchProfile(session.user.id, session.user.email);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId, email) => {
        console.log("AuthContext: Fetching profile for", email);

        // Race timeout for profile fetch (3s max)
        const profilePromise = supabase
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single();

        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ error: { timeout: true } }), 3000));

        try {
            const { data, error } = await Promise.race([profilePromise, timeoutPromise]);

            if (error) {
                if (error.timeout) {
                    console.warn("AuthContext: Profile fetch timed out.");
                } else if (error.code === 'PGRST116') {
                    console.log("AuthContext: Profile not found in database yet.");
                } else if (error.message && (error.message.includes("406") || error.code === "406")) {
                    console.error("AuthContext: 406 Error - Possible database schema issue.");
                } else {
                    console.error("AuthContext: Profile fetch error", error);
                }
            } else {
                console.log("AuthContext: Profile fetched successfully:", data);
            }

            // ALWAYS set user even if profile fetch failed, so the app can continue
            setUser({
                id: userId,
                email: email,
                ...(data || {})
            });
        } catch (e) {
            console.error("AuthContext: unexpected error in fetchProfile", e);
            setUser({
                id: userId,
                email: email
            });
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
