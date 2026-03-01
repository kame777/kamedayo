'use client';

import { useCallback } from 'react';

export function useNotification() {
    const requestPermission = useCallback(async (): Promise<boolean> => {
        if (typeof window === 'undefined') return false;
        if (!('Notification' in window)) return false;

        if (Notification.permission === 'granted') return true;
        if (Notification.permission === 'denied') return false;

        const result = await Notification.requestPermission();
        return result === 'granted';
    }, []);

    const isSupported = typeof window !== 'undefined' && 'Notification' in window;
    const isGranted =
        typeof window !== 'undefined' &&
        'Notification' in window &&
        Notification.permission === 'granted';

    return { requestPermission, isSupported, isGranted };
}
