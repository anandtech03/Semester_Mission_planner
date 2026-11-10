/**
 * Date utility functions strictly adhering to Indian Standard Time (Asia/Kolkata, UTC+5:30)
 */

export const IST_TIMEZONE = 'Asia/Kolkata';

// Schedule boundaries
export const SCHEDULE_START_DATE = '2026-11-09';
export const SCHEDULE_END_DATE = '2026-12-06';

/**
 * Returns the current date in YYYY-MM-DD format based on Asia/Kolkata timezone
 */
export function getISTTodayString(overrideDate?: Date | null): string {
  const date = overrideDate || new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: IST_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date); // outputs "YYYY-MM-DD"
}

/**
 * Formats a date string (YYYY-MM-DD) into human-readable IST string
 * e.g., "Mon, 9 Nov 2026"
 */
export function formatISTDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  // Create UTC date at noon to avoid timezone shift boundaries
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  
  const defaultOpts: Intl.DateTimeFormatOptions = {
    timeZone: IST_TIMEZONE,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  return new Intl.DateTimeFormat('en-IN', options || defaultOpts).format(date);
}

/**
 * Formats time in IST (e.g., "10:20:07 PM IST")
 */
export function formatISTTime(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: IST_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Checks if a target dateStr is strictly in the past relative to todayStr
 */
export function isDateInPast(targetDateStr: string, todayStr: string): boolean {
  return targetDateStr < todayStr;
}

/**
 * Checks if target date is today
 */
export function isDateCurrent(targetDateStr: string, todayStr: string): boolean {
  return targetDateStr === todayStr;
}

/**
 * Checks if target date is in the future relative to todayStr
 */
export function isDateInFuture(targetDateStr: string, todayStr: string): boolean {
  return targetDateStr > todayStr;
}

/**
 * Calculates days remaining until schedule ends
 */
export function calculateDaysRemaining(todayStr: string, endDateStr: string = SCHEDULE_END_DATE): number {
  if (todayStr > endDateStr) return 0;
  if (todayStr < SCHEDULE_START_DATE) {
    const start = new Date(SCHEDULE_START_DATE).getTime();
    const end = new Date(endDateStr).getTime();
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  }
  const today = new Date(todayStr).getTime();
  const end = new Date(endDateStr).getTime();
  const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Calculates days completed (past days)
 */
export function calculateDaysCompleted(todayStr: string, startDateStr: string = SCHEDULE_START_DATE): number {
  if (todayStr <= startDateStr) return 0;
  const start = new Date(startDateStr).getTime();
  const today = new Date(todayStr).getTime();
  const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return Math.min(28, Math.max(0, diffDays));
}
