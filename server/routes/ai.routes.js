/**
 * AI routes — all Gemini-powered endpoints.
 * POST /api/ai/analyze-journal
 * POST /api/ai/chat
 * POST /api/ai/daily-suggestion
 */
const express = require('express');
const router = express.Router();
const firebaseAuth = require('../middleware/firebaseAuth');
const { aiLimiter } = require('../middleware/rateLimiter');
const {
  validateAnalyzeJournal,
  validateChat,
  validateDailySuggestion,
} = require('../middleware/validate');
const geminiService = require('../services/gemini.service');
const firestoreService = require('../services/firestore.service');
const { success, error } = require('../utils/responseHelper');

router.use(firebaseAuth);
router.use(aiLimiter);

/** POST /api/ai/analyze-journal */
router.post('/analyze-journal', validateAnalyzeJournal, async (req, res) => {
  try {
    const { journalContent, date, examType } = req.body;
    const uid = req.user.uid;

    const analysis = await geminiService.analyzeJournal(journalContent, examType);

    await firestoreService.saveJournal(uid, date, {
      aiAnalysis: analysis,
      analysisStatus: 'complete',
    });

    return success(res, { analysis });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Analyze journal error:', err);
    }
    return error(res, 'Failed to analyze journal entry', 500);
  }
});

/** POST /api/ai/chat */
router.post('/chat', validateChat, async (req, res) => {
  try {
    const { message, sessionHistory, examType, recentMoodAvg, recentTriggers } = req.body;

    const reply = await geminiService.chat(message, sessionHistory, {
      examType,
      recentMoodAvg,
      recentTriggers,
    });

    return success(res, { reply });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Chat error:', err);
    }
    return error(res, 'Failed to get AI response', 500);
  }
});

/** POST /api/ai/daily-suggestion */
router.post('/daily-suggestion', validateDailySuggestion, async (req, res) => {
  try {
    const { examType, recentMoods, recentTriggers } = req.body;
    const uid = req.user.uid;

    const today = new Date().toISOString().split('T')[0];
    const weekNumber = getWeekNumber(new Date());
    const weekId = `${new Date().getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;

    const cached = await firestoreService.getWeeklyInsight(uid, weekId);
    if (cached && cached.dailySuggestion && cached.suggestionDate === today) {
      return success(res, {
        suggestion: cached.dailySuggestion,
        category: cached.suggestionCategory || 'mindset',
      });
    }

    const result = await geminiService.dailySuggestion(examType, recentMoods, recentTriggers);

    await firestoreService.saveWeeklyInsight(uid, weekId, {
      dailySuggestion: result.suggestion,
      suggestionCategory: result.category,
      suggestionDate: today,
    });

    return success(res, result);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Daily suggestion error:', err);
    }
    return error(res, 'Failed to get daily suggestion', 500);
  }
});

/** Helper: get ISO week number */
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

module.exports = router;
