/**
 * StarterPrompts — 4 suggested prompt chips for empty chat state.
 * @param {object} props
 * @param {Function} props.onSelect
 */
import { STARTER_PROMPTS } from '../../../utils/constants';

export default function StarterPrompts({ onSelect }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-pearl mb-1">
          Start a conversation
        </h3>
        <p className="text-sm text-pearl/40">
          Share what is on your mind, or try one of these
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
        {STARTER_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => onSelect(prompt)}
            className="text-left glass-card p-3 rounded-xl text-sm text-pearl/70 hover:text-pearl hover:bg-white/[0.07] transition-all duration-200"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
