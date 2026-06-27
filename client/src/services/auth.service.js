/**
 * Auth service — sign in, sign up, Google auth, sign out, delete account.
 */
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
  deleteUser,
} from 'firebase/auth';
import { auth } from './firebase';

const googleProvider = new GoogleAuthProvider();

/** Firebase error code to user-friendly message mapping */
const ERROR_MESSAGES = {
  'auth/user-not-found': 'No account found with this email',
  'auth/wrong-password': 'Incorrect password. Try again or use the demo account.',
  'auth/email-already-in-use': 'This email is already registered. Try signing in.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
};

/**
 * Get a user-friendly error message from a Firebase error code
 * @param {string} code - Firebase error code
 * @returns {string}
 */
export const getAuthErrorMessage = (code) => {
  return ERROR_MESSAGES[code] || 'An unexpected error occurred. Please try again.';
};

/**
 * Sign in with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const signInWithEmail = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Sign up with email and password
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const signUpWithEmail = async (email, password, displayName) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  return credential;
};

/**
 * Sign in with Google OAuth
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const signInWithGoogle = async () => {
  return signInWithPopup(auth, googleProvider);
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  return firebaseSignOut(auth);
};

/**
 * Delete the current user account
 */
export const deleteAccount = async () => {
  const user = auth.currentUser;
  if (user) {
    await deleteUser(user);
  }
};

/**
 * Get the current user's ID token for API requests
 * @returns {Promise<string>}
 */
export const getIdToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user');
  return user.getIdToken();
};
