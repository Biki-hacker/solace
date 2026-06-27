/**
 * TypingIndicator — Three-dot pulse animation for AI typing state.
 */
export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="glass-card rounded-[18px] rounded-tl-[4px] px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-lavender-400"
              style={{
                animation: `typing-dot 1.4s ${i * 0.2}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
        <style>{`
          @keyframes typing-dot {
            0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
            30% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}
