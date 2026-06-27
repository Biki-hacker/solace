/**
 * Mood Log Page — Radial mood selector, calendar, and trend chart.
 */
import { useState } from 'react';
import {
  LineChart, Line, XAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import AppShell from '../components/layout/AppShell';
import PageWrapper from '../components/layout/PageWrapper';
import MoodRadial from '../components/features/mood/MoodRadial';
import MoodCalendar from '../components/features/mood/MoodCalendar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';
import { useMood } from '../hooks/useMood';
import { getMoodLabel, getMoodColor } from '../utils/moodUtils';
import { getLastNDays, getShortDay } from '../utils/dateUtils';
import { MAX_NOTE_CHARS, MOOD_DESCRIPTIONS } from '../utils/constants';

export default function MoodLog() {
  const { moods, todaysMood, loading, loggingMood, logMood } = useMood();
  const [selectedScore, setSelectedScore] = useState(todaysMood?.score || null);
  const [note, setNote] = useState('');

  const handleLogMood = () => {
    if (!selectedScore) return;
    logMood(selectedScore, note);
    setNote('');
  };

  /* Chart data */
  const days = getLastNDays(30);
  const moodMap = {};
  moods.forEach((m) => {
    if (!moodMap[m.date]) moodMap[m.date] = m.score;
  });
  const chartData = days.map((day) => ({
    name: getShortDay(day),
    score: moodMap[day] || null,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.[0]?.value) {
      return (
        <div className="bg-navy-700 border border-white/[0.08] rounded-lg px-3 py-2">
          <p className="text-xs text-pearl">{getMoodLabel(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <AppShell>
      <PageWrapper>
        <h1 className="text-2xl sm:text-3xl font-bold text-pearl mb-8 tracking-tight">
          Mood Log
        </h1>

        {loading ? (
          <div className="space-y-6">
            <Skeleton variant="card" height="360px" />
            <Skeleton variant="card" height="200px" />
          </div>
        ) : (
          <>
            {/* Radial Selector */}
            <Card className="mb-6 flex flex-col items-center py-8">
              <MoodRadial
                selected={selectedScore}
                onSelect={setSelectedScore}
              />

              {/* Note input */}
              <div className="w-full max-w-sm mt-6 space-y-3">
                <Input
                  placeholder={
                    selectedScore
                      ? MOOD_DESCRIPTIONS[selectedScore] || 'Add a note (optional)'
                      : 'Add a note (optional)'
                  }
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={MAX_NOTE_CHARS}
                />
                <Button
                  onClick={handleLogMood}
                  disabled={!selectedScore || !!todaysMood}
                  loading={loggingMood}
                  fullWidth
                  size="lg"
                >
                  {todaysMood ? 'Mood Logged Today' : 'Log My Mood'}
                </Button>
              </div>
            </Card>

            {/* Calendar */}
            <Card className="mb-6">
              <p className="text-xs text-pearl/50 mb-4">Last 30 Days</p>
              <MoodCalendar moods={moods} />
            </Card>

            {/* Trend Chart */}
            <Card>
              <p className="text-xs text-pearl/50 mb-4">30-Day Trend</p>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(248,249,255,0.3)', fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#9A88FF"
                    strokeWidth={2}
                    dot={false}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </>
        )}
      </PageWrapper>
    </AppShell>
  );
}
