/**
 * Dashboard Page — Main app dashboard with greeting, wellness, streak, mood, chart, and suggestions.
 */
import { useEffect, useState } from 'react';
import AppShell from '../components/layout/AppShell';
import PageWrapper from '../components/layout/PageWrapper';
import WellnessScoreCard from '../components/features/dashboard/WellnessScoreCard';
import StreakCard from '../components/features/dashboard/StreakCard';
import WeeklyMoodChart from '../components/features/dashboard/WeeklyMoodChart';
import InsightCard from '../components/features/dashboard/InsightCard';
import DailySuggestion from '../components/features/dashboard/DailySuggestion';
import MoodMiniPicker from '../components/features/mood/MoodMiniPicker';
import ExamBadges from '../assets/vectors/ExamBadges';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import { useAuth } from '../hooks/useAuth';
import { useMood } from '../hooks/useMood';
import { useFirestore } from '../hooks/useFirestore';
import { getRecentJournals } from '../services/firestore.service';
import api from '../services/api.service';
import { getGreeting, getDaysRemaining } from '../utils/dateUtils';
import { wellnessToPercentage, calculateAverageMood } from '../utils/moodUtils';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const { moods, todaysMood, loading: moodsLoading, logMood } = useMood();
  const [weeklyData, setWeeklyData] = useState(null);
  const [weeklyLoading, setWeeklyLoading] = useState(true);

  const { data: journals, loading: journalsLoading } = useFirestore(
    () => (user ? getRecentJournals(user.uid, 7) : Promise.resolve([])),
    [user?.uid]
  );

  useEffect(() => {
    if (!user) return;
    const fetchWeekly = async () => {
      try {
        const response = await api.get(`/api/users/${user.uid}/weekly-summary`);
        setWeeklyData(response.summary);
      } catch {
        setWeeklyData(null);
      } finally {
        setWeeklyLoading(false);
      }
    };
    fetchWeekly();
  }, [user]);

  const firstName = profile?.displayName?.split(' ')[0] || 'there';
  const daysLeft = profile?.targetYear ? getDaysRemaining(profile.targetYear) : null;
  const wellnessScore = weeklyData?.averageWellnessScore
    ? wellnessToPercentage(weeklyData.averageWellnessScore)
    : 0;

  const recentInsight = journals?.find((j) => j.aiAnalysis?.suggestedActions?.length > 0);
  const recentMoodScores = moods.map((m) => m.score);
  const recentTriggers = journals
    ?.filter((j) => j.aiAnalysis?.stressTriggers)
    ?.flatMap((j) => j.aiAnalysis.stressTriggers)
    ?.slice(0, 5) || [];

  return (
    <AppShell>
      <PageWrapper>
        {/* Greeting */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-pearl tracking-tight">
              {getGreeting()}, {firstName}.
            </h1>
            {profile?.examType && daysLeft !== null && (
              <p className="text-sm text-pearl/50 mt-1 flex items-center gap-2">
                Your {profile.examType} exam is in {daysLeft} days.
                <ExamBadges examType={profile.examType} size={24} />
              </p>
            )}
          </div>
        </div>

        {/* Row 1: Wellness + Streak */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {weeklyLoading ? (
            <>
              <Skeleton variant="card" height="140px" />
              <Skeleton variant="card" height="140px" />
            </>
          ) : (
            <>
              <WellnessScoreCard score={wellnessScore} />
              <StreakCard streakDays={profile?.streakDays || 0} />
            </>
          )}
        </div>

        {/* Row 2: Quick Mood Check */}
        <Card className="mb-4">
          <p className="text-xs text-pearl/50 mb-3">
            {todaysMood ? 'Mood logged today' : 'How are you feeling right now?'}
          </p>
          <MoodMiniPicker
            selected={todaysMood?.score || null}
            onSelect={(score) => logMood(score)}
            disabled={!!todaysMood}
          />
        </Card>

        {/* Row 3: Weekly Mood Chart */}
        {moodsLoading ? (
          <Skeleton variant="card" height="200px" className="mb-4" />
        ) : (
          <WeeklyMoodChart moods={moods} className="mb-4" />
        )}

        {/* Row 4: Daily Suggestion */}
        <DailySuggestion
          recentMoods={recentMoodScores}
          recentTriggers={recentTriggers}
          className="mb-4"
        />

        {/* Row 5: Recent Insight */}
        {recentInsight && (
          <InsightCard
            insight={recentInsight.aiAnalysis.suggestedActions[0]}
            date={recentInsight.id}
          />
        )}
      </PageWrapper>
    </AppShell>
  );
}
