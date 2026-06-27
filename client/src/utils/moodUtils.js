/**
 * Mood utility functions — score to label/color mapping.
 */
import { MOOD_LABELS, MOOD_COLORS, MOOD_DESCRIPTIONS } from './constants';

/**
 * Get the label for a mood score
 * @param {number} score - 1 to 5
 * @returns {string}
 */
export const getMoodLabel = (score) => {
  return MOOD_LABELS[score] || 'Unknown';
};

/**
 * Get the color for a mood score
 * @param {number} score - 1 to 5
 * @returns {string}
 */
export const getMoodColor = (score) => {
  return MOOD_COLORS[score] || '#B8ACFF';
};

/**
 * Get the description for a mood score
 * @param {number} score - 1 to 5
 * @returns {string}
 */
export const getMoodDescription = (score) => {
  return MOOD_DESCRIPTIONS[score] || '';
};

/**
 * Calculate average mood from an array of mood objects
 * @param {Array<{score: number}>} moods
 * @returns {number}
 */
export const calculateAverageMood = (moods) => {
  if (!moods || moods.length === 0) return 0;
  const sum = moods.reduce((acc, m) => acc + m.score, 0);
  return parseFloat((sum / moods.length).toFixed(1));
};

/**
 * Get wellness score color based on value
 * @param {number} score - 1 to 100
 * @returns {string}
 */
export const getWellnessColor = (score) => {
  if (score < 40) return '#E87070';
  if (score < 65) return '#F5C842';
  return '#8EBD9B';
};

/**
 * Convert a wellness score (1-10) to a percentage (1-100)
 * @param {number} score - 1 to 10
 * @returns {number}
 */
export const wellnessToPercentage = (score) => {
  return Math.round((score / 10) * 100);
};

/**
 * Get streak motivation text based on streak length
 * @param {number} days
 * @returns {string}
 */
export const getStreakMotivation = (days) => {
  if (days === 0) return 'Start your wellness journey today';
  if (days === 1) return 'A great first step. Keep going.';
  if (days < 4) return 'Building momentum. Stay consistent.';
  if (days < 7) return 'Impressive dedication this week.';
  if (days < 14) return 'You are building a real habit.';
  if (days < 30) return 'Your consistency is remarkable.';
  return 'A true wellness champion.';
};
