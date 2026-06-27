/**
 * Firebase Admin SDK initialization and Firestore helper functions.
 * Uses individual environment variables — not a JSON credentials file.
 */
const admin = require('firebase-admin');

if (!admin.apps.length) {
  const adminConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
  };

  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    adminConfig.credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    });
  }

  admin.initializeApp(adminConfig);
}

const db = admin.firestore();

/**
 * Get a user document by UID
 * @param {string} uid
 * @returns {Promise<object|null>}
 */
const getUser = async (uid) => {
  const doc = await db.collection('users').doc(uid).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

/**
 * Update a user document
 * @param {string} uid
 * @param {object} data
 */
const updateUser = async (uid, data) => {
  await db.collection('users').doc(uid).set(data, { merge: true });
};

/**
 * Save or update a journal entry
 * @param {string} uid
 * @param {string} date - YYYY-MM-DD
 * @param {object} data
 */
const saveJournal = async (uid, date, data) => {
  await db
    .collection('users')
    .doc(uid)
    .collection('journals')
    .doc(date)
    .set(
      {
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
};

/**
 * Get a journal entry by date
 * @param {string} uid
 * @param {string} date - YYYY-MM-DD
 * @returns {Promise<object|null>}
 */
const getJournal = async (uid, date) => {
  const doc = await db
    .collection('users')
    .doc(uid)
    .collection('journals')
    .doc(date)
    .get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

/**
 * Get recent journal entries
 * @param {string} uid
 * @param {number} limit
 * @returns {Promise<Array>}
 */
const getRecentJournals = async (uid, limit = 7) => {
  const snapshot = await db
    .collection('users')
    .doc(uid)
    .collection('journals')
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    content: doc.data().content?.substring(0, 200),
  }));
};

/**
 * Save a mood log
 * @param {string} uid
 * @param {object} data
 * @returns {string} The created mood document ID
 */
const saveMood = async (uid, data) => {
  const ref = await db
    .collection('users')
    .doc(uid)
    .collection('moods')
    .add({
      ...data,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  return ref.id;
};

/**
 * Get mood logs for a given number of days
 * @param {string} uid
 * @param {number} days
 * @returns {Promise<Array>}
 */
const getRecentMoods = async (uid, days = 30) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().split('T')[0];

  const snapshot = await db
    .collection('users')
    .doc(uid)
    .collection('moods')
    .where('date', '>=', cutoffStr)
    .orderBy('date', 'desc')
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Get or create a weekly insight
 * @param {string} uid
 * @param {string} weekId - e.g. "2024-W42"
 * @returns {Promise<object|null>}
 */
const getWeeklyInsight = async (uid, weekId) => {
  const doc = await db
    .collection('users')
    .doc(uid)
    .collection('weeklyInsights')
    .doc(weekId)
    .get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

/**
 * Save a weekly insight
 * @param {string} uid
 * @param {string} weekId
 * @param {object} data
 */
const saveWeeklyInsight = async (uid, weekId, data) => {
  await db
    .collection('users')
    .doc(uid)
    .collection('weeklyInsights')
    .doc(weekId)
    .set({
      ...data,
      generatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
};

module.exports = {
  admin,
  db,
  getUser,
  updateUser,
  saveJournal,
  getJournal,
  getRecentJournals,
  saveMood,
  getRecentMoods,
  getWeeklyInsight,
  saveWeeklyInsight,
};
