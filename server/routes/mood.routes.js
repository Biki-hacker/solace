/**
 * Mood routes.
 * POST /api/moods — log a mood entry
 * GET  /api/moods — fetch recent mood logs
 */
const express = require('express');
const router = express.Router();
const firebaseAuth = require('../middleware/firebaseAuth');
const { validateMoodLog, validateMoodQuery } = require('../middleware/validate');
const firestoreService = require('../services/firestore.service');
const { success, error } = require('../utils/responseHelper');

router.use(firebaseAuth);

/** POST /api/moods — log a new mood entry */
router.post('/', validateMoodLog, async (req, res) => {
  try {
    const { score, label, note, date } = req.body;
    const uid = req.user.uid;

    const moodId = await firestoreService.saveMood(uid, {
      score,
      label,
      note: note || '',
      date,
    });

    return success(res, { moodId }, 201);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Log mood error:', err);
    }
    return error(res, 'Failed to log mood', 500);
  }
});

/** GET /api/moods — fetch recent mood logs */
router.get('/', validateMoodQuery, async (req, res) => {
  try {
    const uid = req.user.uid;
    const days = parseInt(req.query.days) || 30;
    const moods = await firestoreService.getRecentMoods(uid, days);
    return success(res, { moods });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Get moods error:', err);
    }
    return error(res, 'Failed to fetch mood logs', 500);
  }
});

module.exports = router;
