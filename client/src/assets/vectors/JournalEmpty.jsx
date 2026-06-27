/**
 * JournalEmpty — Abstract open-book empty state illustration.
 * @param {object} props
 * @param {string} [props.className]
 * @param {object} [props.style]
 */
export default function JournalEmpty({ className = '', style }) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={className}
      style={{ width: '200px', ...style }}
      role="img"
      aria-label="Empty journal illustration"
    >
      <defs>
        <linearGradient id="bookGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--accent-secondary)" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Left page */}
      <path
        d="M100 30 L30 40 L30 130 L100 120 Z"
        fill="url(#bookGrad)"
        stroke="var(--accent-primary)"
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Right page */}
      <path
        d="M100 30 L170 40 L170 130 L100 120 Z"
        fill="url(#bookGrad)"
        stroke="var(--accent-primary)"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Spine */}
      <line x1="100" y1="30" x2="100" y2="120" stroke="var(--accent-primary)" strokeWidth="1.5" opacity="0.4" />

      {/* Lines on left page */}
      <line x1="42" y1="55" x2="90" y2="52" stroke="var(--text-muted)" strokeWidth="1" opacity="0.3" />
      <line x1="42" y1="67" x2="85" y2="64" stroke="var(--text-muted)" strokeWidth="1" opacity="0.25" />
      <line x1="42" y1="79" x2="80" y2="76" stroke="var(--text-muted)" strokeWidth="1" opacity="0.2" />
      <line x1="42" y1="91" x2="75" y2="88" stroke="var(--text-muted)" strokeWidth="1" opacity="0.15" />

      {/* Lines on right page */}
      <line x1="110" y1="52" x2="158" y2="55" stroke="var(--text-muted)" strokeWidth="1" opacity="0.3" />
      <line x1="110" y1="64" x2="155" y2="67" stroke="var(--text-muted)" strokeWidth="1" opacity="0.25" />
      <line x1="110" y1="76" x2="152" y2="79" stroke="var(--text-muted)" strokeWidth="1" opacity="0.2" />

      {/* Pen */}
      <line x1="155" y1="95" x2="175" y2="75" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <circle cx="155" cy="95" r="2" fill="var(--accent-primary)" opacity="0.5" />
    </svg>
  );
}
