/**
 * useMood hook — mood logging and history fetching.
 */
import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { saveMood, getRecentMoods } from '../services/firestore.service';
import { useFirestore } from './useFirestore';
import { getTodayString } from '../utils/dateUtils';
import { getMoodLabel } from '../utils/moodUtils';
import toast from 'react-hot-toast';

export const useMood = () => {
  const { user } = useAuth();
  const [loggingMood, setLoggingMood] = useState(false);

  /** Fetch recent moods */
  const {
    data: moods,
    loading,
    error,
    refetch,
  } = useFirestore(
    () => (user ? getRecentMoods(user.uid, 30) : Promise.resolve([])),
    [user?.uid]
  );

  /** Check if mood was already logged today */
  const todaysMood = moods?.find((m) => m.date === getTodayString()) || null;

  /** Log a new mood */
  const logMood = useCallback(
    async (score, note = '') => {
      if (!user) return;
      setLoggingMood(true);
      try {
        const today = getTodayString();
        await saveMood(user.uid, {
          score,
          label: getMoodLabel(score),
          note,
          date: today,
        });
        toast.success('Mood logged successfully');
        await refetch();
      } catch (err) {
        toast.error('Failed to log mood');
        if (import.meta.env.DEV) {
          console.error('Error logging mood:', err);
        }
      } finally {
        setLoggingMood(false);
      }
    },
    [user, refetch]
  );

  return {
    moods: moods || [],
    todaysMood,
    loading,
    error,
    loggingMood,
    logMood,
    refetch,
  };
};
