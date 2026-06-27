/**
 * DateNavigator — Prev/Next arrows with date display for journal navigation.
 * @param {object} props
 * @param {string} props.date - YYYY-MM-DD
 * @param {Function} props.onDateChange
 */
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDisplayDate, getPrevDay, getNextDay, isDateToday } from '../../../utils/dateUtils';

export default function DateNavigator({ date, onDateChange }) {
  const isToday = isDateToday(date);

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => onDateChange(getPrevDay(date))}
        className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
        aria-label="Previous day"
      >
        <ChevronLeft size={20} className="text-pearl/50" />
      </button>

      <span className="text-sm font-medium text-pearl min-w-[160px] text-center">
        {isToday ? 'Today' : formatDisplayDate(date)}
      </span>

      <button
        onClick={() => onDateChange(getNextDay(date))}
        className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors disabled:opacity-30"
        disabled={isToday}
        aria-label="Next day"
      >
        <ChevronRight size={20} className="text-pearl/50" />
      </button>
    </div>
  );
}
