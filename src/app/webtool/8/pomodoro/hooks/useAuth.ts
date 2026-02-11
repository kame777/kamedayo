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
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            if (user) {
                mergeLocalData(user.id);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                mergeLocalData(session.user.id);
            }
        });

        return () => subscription.unsubscribe();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const signInWithGitHub = async () => {
        const supabase = createClient();
        const callbackUrl = new URL('/auth/callback', window.location.origin);
        callbackUrl.searchParams.set('next', window.location.pathname);

        await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: callbackUrl.toString(),
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
