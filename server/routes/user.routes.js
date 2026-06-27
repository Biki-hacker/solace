/**
 * User routes.
 * GET /api/users/:uid/weekly-summary — aggregated weekly wellness summary
 */
const express = require('express');
const router = express.Router();
const firebaseAuth = require('../middleware/firebaseAuth');
const { validateUserParam } = require('../middleware/validate');
const firestoreService = require('../services/firestore.service');
const geminiService = require('../services/gemini.service');
const { success, error } = require('../utils/responseHelper');

router.use(firebaseAuth);

/** GET /api/users/:uid/weekly-summary */
router.get('/:uid/weekly-summary', validateUserParam, async (req, res) => {
  try {
    const { uid } = req.params;

    if (uid !== req.user.uid) {
      return error(res, 'Forbidden: You can only access your own data', 403);
    }

    const user = await firestoreService.getUser(uid);
    const moods = await firestoreService.getRecentMoods(uid, 7);
    const journals = await firestoreService.getRecentJournals(uid, 7);

    const moodScores = moods.map((m) => m.score);
    const averageMood =
      moodScores.length > 0
        ? parseFloat((moodScores.reduce((a, b) => a + b, 0) / moodScores.length).toFixed(1))
        : 0;

    const wellnessScores = journals
      .filter((j) => j.aiAnalysis?.wellnessScore)
      .map((j) => j.aiAnalysis.wellnessScore);
    const averageWellnessScore =
      wellnessScores.length > 0
        ? parseFloat(
            (wellnessScores.reduce((a, b) => a + b, 0) / wellnessScores.length).toFixed(1)
          )
        : 0;

    const allTriggers = journals
      .filter((j) => j.aiAnalysis?.stressTriggers)
      .flatMap((j) => j.aiAnalysis.stressTriggers);
    const triggerCounts = {};
    allTriggers.forEach((t) => {
      triggerCounts[t] = (triggerCounts[t] || 0) + 1;
    });
    const topTriggers = Object.entries(triggerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([trigger]) => trigger);

    let progressNote = 'Keep journaling and logging your mood to get personalized weekly insights.';
    if (journals.length >= 3 && moods.length >= 3) {
      try {
        const suggestionResult = await geminiService.dailySuggestion(
          user?.examType || 'competitive exams',
          moodScores,
          topTriggers
        );
        progressNote = suggestionResult.suggestion;
      } catch {
        /* use default progressNote */
      }
    }

    const summary = {
      averageMood,
      averageWellnessScore,
      topTriggers,
      progressNote,
      journalCount: journals.length,
      moodLogCount: moods.length,
      weekStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    return success(res, { summary });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Weekly summary error:', err);
    }
    return error(res, 'Failed to generate weekly summary', 500);
  }
});

module.exports = router;
