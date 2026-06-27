/**
 * Journal Page — Date navigator, editor with auto-save, AI analysis panel.
 */
import { useState } from 'react';
import AppShell from '../components/layout/AppShell';
import PageWrapper from '../components/layout/PageWrapper';
import DateNavigator from '../components/features/journal/DateNavigator';
import JournalEditor from '../components/features/journal/JournalEditor';
import AIInsightPanel from '../components/features/journal/AIInsightPanel';
import MoodMiniPicker from '../components/features/mood/MoodMiniPicker';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import JournalEmpty from '../assets/vectors/JournalEmpty';
import { useJournal } from '../hooks/useJournal';
import { getTodayString } from '../utils/dateUtils';
import { Sparkles } from 'lucide-react';

export default function Journal() {
  const [date, setDate] = useState(getTodayString());
  const {
    content,
    setContent,
    moodScore,
    setMoodScore,
    analysis,
    analysisStatus,
    loading,
    saveStatus,
    analyzing,
    save,
    analyze,
  } = useJournal(date);

  const canAnalyze = content.length >= 100 && moodScore !== null && !analyzing;

  return (
    <AppShell>
      <PageWrapper narrow={false}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main editor area */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-pearl tracking-tight">Journal</h1>
              <DateNavigator date={date} onDateChange={setDate} />
            </div>

            {loading ? (
              <div className="space-y-4">
                <Skeleton variant="rect" height="40px" />
                <Skeleton variant="card" height="400px" />
              </div>
            ) : (
              <>
                {/* Mood selector */}
                <div className="mb-4">
                  <p className="text-xs text-pearl/50 mb-2">How are you feeling today?</p>
                  <MoodMiniPicker selected={moodScore} onSelect={setMoodScore} />
                </div>

                {/* Editor */}
                {!content && !analysis ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <JournalEmpty className="mb-6 opacity-50" />
                    <p className="text-sm text-pearl/50 max-w-xs mb-4">
                      Writing even a little each day helps Solace understand your patterns.
                    </p>
                    <JournalEditor
                      content={content}
                      onChange={setContent}
                      saveStatus={saveStatus}
                    />
                  </div>
                ) : (
                  <JournalEditor
                    content={content}
                    onChange={setContent}
                    saveStatus={saveStatus}
                  />
                )}

                {/* Analyze button */}
                <div className="flex items-center gap-3 mt-4">
                  <Button
                    onClick={analyze}
                    disabled={!canAnalyze}
                    loading={analyzing}
                    icon={<Sparkles size={16} />}
                  >
                    Analyze with AI
                  </Button>
                  <Button variant="ghost" onClick={save}>
                    Save
                  </Button>
                  {!canAnalyze && content.length > 0 && content.length < 100 && (
                    <span className="text-xs text-pearl/30">
                      Write at least 100 characters to analyze
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* AI Insight Panel */}
          {analysis && (
            <div className="w-full lg:w-80 flex-shrink-0">
              <AIInsightPanel analysis={analysis} />
            </div>
          )}
        </div>
      </PageWrapper>
    </AppShell>
  );
}
