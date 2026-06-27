/**
 * useJournal hook — journal CRUD, auto-save, and AI analysis.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getJournal, saveJournal } from '../services/firestore.service';
import api from '../services/api.service';
import { AUTOSAVE_INTERVAL_MS } from '../utils/constants';

export const useJournal = (date) => {
  const { user, profile } = useAuth();
  const [content, setContent] = useState('');
  const [moodScore, setMoodScore] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analysisStatus, setAnalysisStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [analyzing, setAnalyzing] = useState(false);

  const lastSavedContent = useRef('');
  const autoSaveTimer = useRef(null);

  /** Fetch journal entry for the given date */
  const fetchJournal = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const entry = await getJournal(user.uid, date);
      if (entry) {
        setContent(entry.content || '');
        setMoodScore(entry.moodScore || null);
        setAnalysis(entry.aiAnalysis || null);
        setAnalysisStatus(entry.analysisStatus || null);
        lastSavedContent.current = entry.content || '';
      } else {
        setContent('');
        setMoodScore(null);
        setAnalysis(null);
        setAnalysisStatus(null);
        lastSavedContent.current = '';
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error fetching journal:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [user, date]);

  useEffect(() => {
    fetchJournal();
    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    };
  }, [fetchJournal]);

  /** Auto-save every 30 seconds if content has changed */
  useEffect(() => {
    if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);

    autoSaveTimer.current = setInterval(async () => {
      if (content && content !== lastSavedContent.current && user) {
        await save();
      }
    }, AUTOSAVE_INTERVAL_MS);

    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    };
  }, [content, user]);

  /** Save the current journal entry */
  const save = useCallback(async () => {
    if (!user || !content) return;
    setSaving(true);
    setSaveStatus('saving');
    try {
      await saveJournal(user.uid, date, {
        content,
        moodScore: moodScore || 3,
        createdAt: new Date(),
      });
      lastSavedContent.current = content;
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      setSaveStatus('error');
      if (import.meta.env.DEV) {
        console.error('Error saving journal:', err);
      }
    } finally {
      setSaving(false);
    }
  }, [user, date, content, moodScore]);

  /** Run AI analysis on the journal entry */
  const analyze = useCallback(async () => {
    if (!user || !content || content.length < 100 || !moodScore) return;
    setAnalyzing(true);
    setAnalysisStatus('pending');
    try {
      await save();
      const response = await api.post('/api/ai/analyze-journal', {
        journalContent: content,
        date,
        examType: profile?.examType || 'OTHER',
      });
      setAnalysis(response.analysis);
      setAnalysisStatus('complete');
    } catch (err) {
      setAnalysisStatus('error');
      if (import.meta.env.DEV) {
        console.error('Error analyzing journal:', err);
      }
    } finally {
      setAnalyzing(false);
    }
  }, [user, content, moodScore, date, profile, save]);

  return {
    content,
    setContent,
    moodScore,
    setMoodScore,
    analysis,
    analysisStatus,
    loading,
    saving,
    saveStatus,
    analyzing,
    save,
    analyze,
    refetch: fetchJournal,
  };
};
