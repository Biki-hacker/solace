/**
 * Journal routes.
 * POST /api/journals — save/update a journal entry
 * GET  /api/journals — fetch recent journal entries
 */
const express = require('express');
const router = express.Router();
const firebaseAuth = require('../middleware/firebaseAuth');
const { validateJournalSave, validateJournalQuery } = require('../middleware/validate');
const firestoreService = require('../services/firestore.service');
const { admin } = require('../services/firestore.service');
const { success, error } = require('../utils/responseHelper');

router.use(firebaseAuth);

/** POST /api/journals — save or update a journal entry */
router.post('/', validateJournalSave, async (req, res) => {
  try {
    const { content, moodScore, date } = req.body;
    const uid = req.user.uid;

    const existing = await firestoreService.getJournal(uid, date);

    await firestoreService.saveJournal(uid, date, {
      content,
      moodScore,
      ...(!existing && { createdAt: admin.firestore.FieldValue.serverTimestamp() }),
      analysisStatus: existing?.analysisStatus === 'complete' ? 'complete' : null,
    });

    return success(res, { savedAt: new Date().toISOString() });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Save journal error:', err);
    }
    return error(res, 'Failed to save journal entry', 500);
  }
});

/** GET /api/journals — fetch recent journal entries */
router.get('/', validateJournalQuery, async (req, res) => {
  try {
    const uid = req.user.uid;
    const limit = parseInt(req.query.limit) || 7;
    const journals = await firestoreService.getRecentJournals(uid, limit);
    return success(res, { journals });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Get journals error:', err);
    }
    return error(res, 'Failed to fetch journals', 500);
  }
});

module.exports = router;
