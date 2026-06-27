/**
 * Client-side Firestore service — CRUD operations for users, journals, moods, chats.
 */
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Get or create a user document
 * @param {string} uid
 * @param {object} [defaultData]
 * @returns {Promise<object>}
 */
export const getOrCreateUser = async (uid, defaultData = {}) => {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }
  const userData = {
    ...defaultData,
    onboardingComplete: false,
    streakDays: 0,
    createdAt: serverTimestamp(),
    lastActive: serverTimestamp(),
  };
  await setDoc(ref, userData);
  return { id: uid, ...userData };
};

/**
 * Update a user document
 * @param {string} uid
 * @param {object} data
 */
export const updateUser = async (uid, data) => {
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, { ...data, lastActive: serverTimestamp() });
};

/**
 * Get a journal entry for a specific date
 * @param {string} uid
 * @param {string} date - YYYY-MM-DD
 * @returns {Promise<object|null>}
 */
export const getJournal = async (uid, date) => {
  const ref = doc(db, 'users', uid, 'journals', date);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

/**
 * Save a journal entry
 * @param {string} uid
 * @param {string} date
 * @param {object} data
 */
export const saveJournal = async (uid, date, data) => {
  const ref = doc(db, 'users', uid, 'journals', date);
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
};

/**
 * Get recent journal entries
 * @param {string} uid
 * @param {number} [limitCount=7]
 * @returns {Promise<Array>}
 */
export const getRecentJournals = async (uid, limitCount = 7) => {
  const ref = collection(db, 'users', uid, 'journals');
  const q = query(ref, orderBy('createdAt', 'desc'), firestoreLimit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Save a mood log
 * @param {string} uid
 * @param {object} data
 * @returns {Promise<string>} Document ID
 */
export const saveMood = async (uid, data) => {
  const ref = collection(db, 'users', uid, 'moods');
  const docRef = await addDoc(ref, { ...data, timestamp: serverTimestamp() });
  return docRef.id;
};

/**
 * Get mood logs for the last N days
 * @param {string} uid
 * @param {number} [days=30]
 * @returns {Promise<Array>}
 */
export const getRecentMoods = async (uid, days = 30) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().split('T')[0];

  const ref = collection(db, 'users', uid, 'moods');
  const q = query(ref, where('date', '>=', cutoffStr), orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Get the most recent chat session
 * @param {string} uid
 * @returns {Promise<object|null>}
 */
export const getRecentChatSession = async (uid) => {
  const ref = collection(db, 'users', uid, 'chatSessions');
  const q = query(ref, orderBy('updatedAt', 'desc'), firestoreLimit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
};

/**
 * Create a new chat session
 * @param {string} uid
 * @param {string} title
 * @returns {Promise<string>} Session ID
 */
export const createChatSession = async (uid, title) => {
  const ref = collection(db, 'users', uid, 'chatSessions');
  const docRef = await addDoc(ref, {
    sessionTitle: title,
    messages: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Update a chat session with new messages
 * @param {string} uid
 * @param {string} sessionId
 * @param {Array} messages
 */
export const updateChatSession = async (uid, sessionId, messages) => {
  const ref = doc(db, 'users', uid, 'chatSessions', sessionId);
  await updateDoc(ref, { messages, updatedAt: serverTimestamp() });
};

/**
 * Delete all user data (for account deletion)
 * @param {string} uid
 */
export const deleteUserData = async (uid) => {
  const subcollections = ['journals', 'moods', 'chatSessions', 'weeklyInsights'];
  for (const sub of subcollections) {
    const ref = collection(db, 'users', uid, sub);
    const snap = await getDocs(ref);
    for (const d of snap.docs) {
      await deleteDoc(d.ref);
    }
  }
  await deleteDoc(doc(db, 'users', uid));
};
