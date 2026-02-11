'use client';

import { useEffect, useCallback } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { useAuthStore } from '../stores/authStore';
import { createClient } from '@/lib/supabase/client';
import { UserSettings } from '../types';

export function useSettings() {
    const { settings, isLoaded, loadSettings, updateSettings, setSettings } =
        useSettingsStore();
    const { user } = useAuthStore();

    // Load settings on mount
    useEffect(() => {
        if (!isLoaded) {
            loadSettings();
        }
    }, [isLoaded, loadSettings]);

    // Sync settings from Supabase when user logs in
    useEffect(() => {
        if (!user) return;

        const fetchCloudSettings = async () => {
            const supabase = createClient();
            console.log('Fetching settings for user:', user.id);

            const { data, error: fetchError } = await supabase
                .from('user_settings')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                console.error('Supabase fetch error:', fetchError.message);
            }

            if (data) {
                setSettings({
                    work_duration: data.work_duration,
                    short_break_duration: data.short_break_duration,
                    long_break_duration: data.long_break_duration,
                    long_break_interval: data.long_break_interval,
                    auto_start: data.auto_start,
                    browser_notification: data.browser_notification,
                    sound_notification: data.sound_notification,
                });
            } else {
                console.log('No settings found, creating initial record...');
                const { error: insertError } = await supabase.from('user_settings').insert({
                    user_id: user.id,
                    ...settings,
                });
                if (insertError) console.error('Supabase insert error:', insertError.message);
            }
        };

        fetchCloudSettings();
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    const updateSettingsWithSync = useCallback(
        async (partial: Partial<UserSettings>) => {
            updateSettings(partial);

            if (user) {
                const supabase = createClient();
                const { error: updateError } = await supabase
                    .from('user_settings')
                    .update({ ...partial, updated_at: new Date().toISOString() })
                    .eq('user_id', user.id);

                if (updateError) console.error('Supabase update error:', updateError.message);
            }
        },
        [user, updateSettings]
    );

    return { settings, isLoaded, updateSettings: updateSettingsWithSync };
}
