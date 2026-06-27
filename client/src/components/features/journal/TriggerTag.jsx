/**
 * TriggerTag — Highlighted stress trigger chip.
 * @param {object} props
 * @param {string} props.label
 * @param {string} [props.className]
 */
export default function TriggerTag({ label, className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-wellness/10 text-amber-wellness border border-amber-wellness/20 ${className}`}
    >
      {label}
    </span>
  );
}
