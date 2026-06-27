/**
 * Application constants — exam types, mood labels, routes, and challenge options.
 * All constants use SCREAMING_SNAKE_CASE as per coding standards.
 */

export const EXAM_TYPES = [
  { value: 'NEET', label: 'NEET', description: 'Medical Entrance' },
  { value: 'JEE', label: 'JEE', description: 'Engineering Entrance' },
  { value: 'CUET', label: 'CUET', description: 'University Entrance' },
  { value: 'CAT', label: 'CAT', description: 'MBA Entrance' },
  { value: 'GATE', label: 'GATE', description: 'Graduate Engineering' },
  { value: 'UPSC', label: 'UPSC', description: 'Civil Services' },
  { value: 'OTHER', label: 'Other', description: 'Other Competitive Exam' },
];

export const MOOD_LABELS = {
  1: 'Overwhelmed',
  2: 'Tense',
  3: 'Neutral',
  4: 'Content',
  5: 'Serene',
};

export const MOOD_COLORS = {
  1: '#E87070',
  2: '#F5C842',
  3: '#B8ACFF',
  4: '#A8D1AE',
  5: '#8EBD9B',
};

export const MOOD_DESCRIPTIONS = {
  1: 'Everything feels like too much right now',
  2: 'Feeling on edge and stressed',
  3: 'Neither good nor bad, just here',
  4: 'Things are going fairly well',
  5: 'Calm and at peace',
};

export const ROUTES = {
  LANDING: '/',
  AUTH: '/auth',
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  JOURNAL: '/journal',
  MOOD: '/mood',
  COMPANION: '/companion',
  MINDFULNESS: '/mindfulness',
  SETTINGS: '/settings',
};

export const CHALLENGES = [
  'Anxiety',
  'Focus & Concentration',
  'Sleep Issues',
  'Procrastination',
  'Self-Doubt',
  'Burnout',
  'Exam Fear',
  'Loneliness',
];

export const DEMO_CREDENTIALS = {
  email: 'demo@solace.app',
  password: 'Demo@2025',
};

export const EMOTIONAL_TONES = {
  anxious: { color: '#F5C842', bg: 'rgba(245, 200, 66, 0.15)' },
  overwhelmed: { color: '#E87070', bg: 'rgba(232, 112, 112, 0.15)' },
  frustrated: { color: '#E87070', bg: 'rgba(232, 112, 112, 0.15)' },
  neutral: { color: '#B8ACFF', bg: 'rgba(184, 172, 255, 0.15)' },
  hopeful: { color: '#8EBD9B', bg: 'rgba(142, 189, 155, 0.15)' },
  content: { color: '#A8D1AE', bg: 'rgba(168, 209, 174, 0.15)' },
  tired: { color: '#F5C842', bg: 'rgba(245, 200, 66, 0.15)' },
  sad: { color: '#E87070', bg: 'rgba(232, 112, 112, 0.15)' },
};

export const STARTER_PROMPTS = [
  "I've been feeling really anxious about my mock tests.",
  'Help me create a study break routine.',
  "I can't focus no matter what I try.",
  'Motivate me — I feel like giving up on GATE.',
];

export const MAX_JOURNAL_CHARS = 3000;
export const MAX_NOTE_CHARS = 200;
export const JOURNAL_WARNING_CHARS = 2800;
export const AUTOSAVE_INTERVAL_MS = 30000;
