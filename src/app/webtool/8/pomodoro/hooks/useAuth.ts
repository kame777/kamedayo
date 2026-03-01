'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { createClient } from '@/lib/supabase/client';
import { loadSessionsLocal, clearSessionsLocal } from '../utils/storage';

export function useAuth() {
    const { user, isLoading, setUser } = useAuthStore();

    useEffect(() => {
        const supabase = createClient();

        // Get initial session
        supabase.auth.getUser().then((response: any) => {
            const user = response.data?.user;
            const typedUser = user as any;
            setUser(typedUser);
            if (typedUser) {
                mergeLocalData(typedUser.id);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                mergeLocalData(session.user.id);
            }
        });

        return () => subscription.unsubscribe();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const signInWithGitHub = async () => {
        const supabase = createClient();

        // Store intended destination in a cookie (valid for 10 mins)
        // This avoids query param whitelist issues in Supabase
        const next = window.location.pathname;
        document.cookie = `sb_callback_next=${next}; path=/; max-age=600; SameSite=Lax`;

        const origin = window.location.origin;
        const callbackUrl = `${origin}/auth/callback`;

        await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: callbackUrl,
            },
        });
    };

    const signOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setUser(null);
    };

    return { user, isLoading, signInWithGitHub, signOut };
}

/**
 * Merge local (guest) sessions into the cloud when user logs in
 */
async function mergeLocalData(userId: string) {
    const localSessions = loadSessionsLocal();
    if (localSessions.length === 0) return;

    const supabase = createClient();

    // Insert local sessions into Supabase
    const sessionsToInsert = localSessions.map((s) => ({
        user_id: userId,
        session_type: s.session_type,
        duration: s.duration,
        completed_at: s.completed_at,
    }));

    const { error } = await supabase
        .from('pomodoro_sessions')
        .insert(sessionsToInsert);

    if (!error) {
        clearSessionsLocal();
    }
}
