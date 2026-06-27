/**
 * MoodCalendar — 30-day color grid showing mood history.
 * @param {object} props
 * @param {Array} props.moods - Array of mood objects with { date, score }
 * @param {string} [props.className]
 */
import { useState } from 'react';
import { MOOD_COLORS, MOOD_LABELS } from '../../../utils/constants';
import { getLastNDays, formatDisplayDate } from '../../../utils/dateUtils';

export default function MoodCalendar({ moods = [], className = '' }) {
  const [hoveredDay, setHoveredDay] = useState(null);
  const days = getLastNDays(30);

  const moodMap = {};
  moods.forEach((m) => {
    if (!moodMap[m.date] || m.score) {
      moodMap[m.date] = m;
    }
  });

  return (
    <div className={className}>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const mood = moodMap[day];
          const color = mood ? MOOD_COLORS[mood.score] : 'rgba(255,255,255,0.04)';

          return (
            <div
              key={day}
              className="relative"
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <div
                className="w-full aspect-square rounded-md transition-all duration-200 hover:scale-110 cursor-default"
                style={{ backgroundColor: color }}
                aria-label={
                  mood
                    ? `${formatDisplayDate(day)}: ${MOOD_LABELS[mood.score]}`
                    : `${formatDisplayDate(day)}: No mood logged`
                }
              />

              {/* Tooltip */}
              {hoveredDay === day && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10 px-2 py-1 rounded-lg bg-navy-700 border border-white/[0.08] whitespace-nowrap">
                  <p className="text-[10px] text-pearl/70">
                    {formatDisplayDate(day)}
                  </p>
                  <p className="text-[10px] font-medium" style={{ color: mood ? MOOD_COLORS[mood.score] : 'rgba(248,249,255,0.3)' }}>
                    {mood ? MOOD_LABELS[mood.score] : 'No log'}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
