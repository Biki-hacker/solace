/**
 * Date utility functions using date-fns.
 */
import { format, formatDistanceToNow, differenceInDays, startOfWeek, addDays, subDays, isToday, parseISO } from 'date-fns';

/**
 * Get a time-of-day greeting
 * @returns {string} "Good morning" | "Good afternoon" | "Good evening"
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

/**
 * Format a date string as "Mon, 14 Oct 2024"
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDisplayDate = (date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'EEE, dd MMM yyyy');
};

/**
 * Get today's date as YYYY-MM-DD
 * @returns {string}
 */
export const getTodayString = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

/**
 * Calculate days remaining until a target date
 * @param {number} targetYear - e.g. 2025
 * @param {number} [targetMonth=5] - Month (0-indexed), default June
 * @returns {number}
 */
export const getDaysRemaining = (targetYear, targetMonth = 5) => {
  const target = new Date(targetYear, targetMonth, 1);
  const diff = differenceInDays(target, new Date());
  return Math.max(0, diff);
};

/**
 * Get the previous day string in YYYY-MM-DD format
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {string}
 */
export const getPrevDay = (dateStr) => {
  return format(subDays(parseISO(dateStr), 1), 'yyyy-MM-dd');
};

/**
 * Get the next day string in YYYY-MM-DD format
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {string}
 */
export const getNextDay = (dateStr) => {
  const next = addDays(parseISO(dateStr), 1);
  if (next > new Date()) return dateStr;
  return format(next, 'yyyy-MM-dd');
};

/**
 * Check if a date string is today
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {boolean}
 */
export const isDateToday = (dateStr) => {
  return isToday(parseISO(dateStr));
};

/**
 * Get an array of the last N days as YYYY-MM-DD strings
 * @param {number} n
 * @returns {string[]}
 */
export const getLastNDays = (n) => {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    days.push(format(subDays(new Date(), i), 'yyyy-MM-dd'));
  }
  return days;
};

/**
 * Get the current ISO week identifier (e.g. "2024-W42")
 * @returns {string}
 */
export const getCurrentWeekId = () => {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const weekNum = Math.ceil(
    ((now - new Date(now.getFullYear(), 0, 1)) / 86400000 + 1) / 7
  );
  return `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
};

/**
 * Get a human-readable relative time string
 * @param {Date|string} date
 * @returns {string}
 */
export const getRelativeTime = (date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
};

/**
 * Format timestamp for chat messages
 * @param {Date|object} timestamp - Date or Firestore timestamp
 * @returns {string}
 */
export const formatChatTime = (timestamp) => {
  if (!timestamp) return '';
  const d = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return format(d, 'h:mm a');
};

/**
 * Get the short day name (Mon, Tue, etc.)
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {string}
 */
export const getShortDay = (dateStr) => {
  return format(parseISO(dateStr), 'EEE');
};
