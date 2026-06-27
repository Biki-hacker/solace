/**
 * JournalEditor — Full-width textarea with character counter and save status.
 * @param {object} props
 * @param {string} props.content
 * @param {Function} props.onChange
 * @param {string} props.saveStatus - 'idle' | 'saving' | 'saved' | 'error'
 * @param {string} [props.className]
 */
import { MAX_JOURNAL_CHARS, JOURNAL_WARNING_CHARS } from '../../../utils/constants';

export default function JournalEditor({ content, onChange, saveStatus, className = '' }) {
  const charCount = content.length;
  const isWarning = charCount >= JOURNAL_WARNING_CHARS;
  const isOver = charCount > MAX_JOURNAL_CHARS;

  const statusText = {
    idle: '',
    saving: 'Saving...',
    saved: 'Saved',
    error: 'Save failed',
  };

  const statusColor = {
    idle: '',
    saving: 'text-pearl/40',
    saved: 'text-sage-400',
    error: 'text-rose-mood',
  };

  return (
    <div className={`relative ${className}`}>
      {/* Save status */}
      <div className="flex justify-end mb-2">
        <span className={`text-xs ${statusColor[saveStatus]}`}>
          {statusText[saveStatus]}
        </span>
      </div>

      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="What's on your mind today?"
        maxLength={MAX_JOURNAL_CHARS + 100}
        className="w-full min-h-[300px] sm:min-h-[400px] bg-transparent text-pearl text-base leading-relaxed resize-none focus:outline-none placeholder:text-pearl/20 border border-transparent focus:border-lavender-500/20 rounded-xl p-4 transition-colors"
        aria-label="Journal entry"
      />

      {/* Character counter */}
      <div className="flex justify-end mt-2">
        <span
          className={`text-xs ${
            isOver
              ? 'text-rose-mood'
              : isWarning
              ? 'text-amber-wellness'
              : 'text-pearl/30'
          }`}
        >
          {charCount} / {MAX_JOURNAL_CHARS}
        </span>
      </div>
    </div>
  );
}
