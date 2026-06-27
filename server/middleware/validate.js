/**
 * Validation middleware using express-validator.
 * Provides validation schemas for all route inputs.
 */
const { body, query, param, validationResult } = require('express-validator');

/** Run validations and return 400 with errors if any fail */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

/** Validate journal analysis request */
const validateAnalyzeJournal = [
  body('journalContent')
    .isString()
    .isLength({ min: 50, max: 3100 })
    .withMessage('Journal content must be between 50 and 3100 characters'),
  body('date')
    .isString()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in YYYY-MM-DD format'),
  body('examType')
    .isString()
    .isIn(['NEET', 'JEE', 'CUET', 'CAT', 'GATE', 'UPSC', 'OTHER'])
    .withMessage('Invalid exam type'),
  handleValidation,
];

/** Validate chat request */
const validateChat = [
  body('message')
    .isString()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('sessionHistory')
    .isArray({ max: 20 })
    .withMessage('Session history must be an array with max 20 messages'),
  body('examType')
    .isString()
    .isIn(['NEET', 'JEE', 'CUET', 'CAT', 'GATE', 'UPSC', 'OTHER'])
    .withMessage('Invalid exam type'),
  handleValidation,
];

/** Validate daily suggestion request */
const validateDailySuggestion = [
  body('examType')
    .isString()
    .isIn(['NEET', 'JEE', 'CUET', 'CAT', 'GATE', 'UPSC', 'OTHER'])
    .withMessage('Invalid exam type'),
  body('recentMoods')
    .optional()
    .isArray()
    .withMessage('Recent moods must be an array'),
  body('recentTriggers')
    .optional()
    .isArray()
    .withMessage('Recent triggers must be an array'),
  handleValidation,
];

/** Validate journal save request */
const validateJournalSave = [
  body('content')
    .isString()
    .isLength({ min: 1, max: 3100 })
    .withMessage('Content must be between 1 and 3100 characters'),
  body('moodScore')
    .isInt({ min: 1, max: 5 })
    .withMessage('Mood score must be between 1 and 5'),
  body('date')
    .isString()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in YYYY-MM-DD format'),
  handleValidation,
];

/** Validate mood log request */
const validateMoodLog = [
  body('score')
    .isInt({ min: 1, max: 5 })
    .withMessage('Score must be between 1 and 5'),
  body('label')
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('Label is required'),
  body('note')
    .optional()
    .isString()
    .isLength({ max: 210 })
    .withMessage('Note must be under 210 characters'),
  body('date')
    .isString()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in YYYY-MM-DD format'),
  handleValidation,
];

/** Validate journal list query */
const validateJournalQuery = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 30 })
    .withMessage('Limit must be between 1 and 30'),
  handleValidation,
];

/** Validate mood list query */
const validateMoodQuery = [
  query('days')
    .optional()
    .isInt({ min: 1, max: 90 })
    .withMessage('Days must be between 1 and 90'),
  handleValidation,
];

/** Validate user param matches authenticated user */
const validateUserParam = [
  param('uid')
    .isString()
    .withMessage('User ID is required'),
  handleValidation,
];

module.exports = {
  validateAnalyzeJournal,
  validateChat,
  validateDailySuggestion,
  validateJournalSave,
  validateJournalQuery,
  validateMoodLog,
  validateMoodQuery,
  validateUserParam,
};
