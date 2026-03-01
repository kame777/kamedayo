/**
 * Format seconds into MM:SS display string
 */
export function formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Format minutes into human-readable string
 */
export function formatMinutes(totalMinutes: number): string {
    if (totalMinutes < 60) {
        return `${totalMinutes}分`;
    }
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (mins === 0) {
        return `${hours}時間`;
    }
    return `${hours}時間${mins}分`;
}

/**
 * Format a date string into a localized display
 */
export function formatDate(isoString: string): string {
    const date = new Date(isoString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
}

/**
 * Get start of today in ISO string (local timezone)
 */
export function getStartOfToday(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Get start of this week (Monday) in local timezone
 */
export function getStartOfWeek(): Date {
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1; // Monday = 0
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
    return start;
}

/**
 * Get start of this month in local timezone
 */
export function getStartOfMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
}
