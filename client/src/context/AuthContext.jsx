/**
 * AuthContext — provides auth state and user profile throughout the app.
 * Listens to Firebase onAuthStateChanged and fetches/creates user profile.
 */
import { createContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getOrCreateUser, updateUser } from '../services/firestore.service';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userProfile = await getOrCreateUser(firebaseUser.uid, {
            displayName: firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || null,
          });
          setProfile(userProfile);
        } catch (err) {
          if (import.meta.env.DEV) {
            console.error('Error fetching user profile:', err);
          }
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    try {
      const userProfile = await getOrCreateUser(user.uid, {
        displayName: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || null,
      });
      setProfile(userProfile);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error refreshing profile:', err);
      }
    }
  }, [user]);

  const updateProfile = useCallback(
    async (data) => {
      if (!user) return;
      try {
        await updateUser(user.uid, data);
        setProfile((prev) => ({ ...prev, ...data }));
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Error updating profile:', err);
        }
        throw err;
      }
    },
    [user]
  );

  const value = {
    user,
    profile,
    loading,
    refreshProfile,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
