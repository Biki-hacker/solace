/**
 * WeeklyMoodChart — Recharts AreaChart showing last 7 days of mood scores.
 * @param {object} props
 * @param {Array} props.moods - Array of mood objects with { date, score }
 * @param {string} [props.className]
 */
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../ui/Card';
import { getLastNDays, getShortDay } from '../../../utils/dateUtils';
import { getMoodLabel } from '../../../utils/moodUtils';

export default function WeeklyMoodChart({ moods = [], className = '' }) {
  const days = getLastNDays(7);

  const moodMap = {};
  moods.forEach((m) => {
    if (!moodMap[m.date]) moodMap[m.date] = m.score;
  });

  const chartData = days.map((day) => ({
    name: getShortDay(day),
    score: moodMap[day] || null,
    date: day,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length && payload[0].value) {
      const score = payload[0].value;
      return (
        <div className="bg-navy-700 border border-white/[0.08] rounded-lg px-3 py-2">
          <p className="text-xs text-pearl">{getMoodLabel(score)}</p>
          <p className="text-[10px] text-pearl/40">{score} / 5</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <p className="text-xs text-pearl/50 mb-4">Weekly Mood Trend</p>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9A88FF" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#9A88FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(248,249,255,0.3)', fontSize: 10 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#9A88FF"
            strokeWidth={2}
            fill="url(#moodGradient)"
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
