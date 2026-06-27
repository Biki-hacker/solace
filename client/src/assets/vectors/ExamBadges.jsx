/**
 * ExamBadges — Minimal vector badges for exam types.
 * @param {object} props
 * @param {string} props.examType - NEET | JEE | CUET | CAT | GATE | UPSC | OTHER
 * @param {string} [props.className]
 * @param {number} [props.size]
 * @param {object} [props.style]
 */
export default function ExamBadges({ examType = 'OTHER', className = '', size = 36, style }) {
  const badgeColors = {
    NEET: '#8EBD9B',
    JEE: '#9A88FF',
    CUET: '#B8ACFF',
    CAT: '#F5C842',
    GATE: '#A8D1AE',
    UPSC: '#D5CCFF',
    OTHER: '#B8ACFF',
  };

  const color = badgeColors[examType] || badgeColors.OTHER;

  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      style={style}
      role="img"
      aria-label={`${examType} exam badge`}
    >
      {/* Background hexagon */}
      <polygon
        points="24,4 44,16 44,32 24,44 4,32 4,16"
        fill={color}
        opacity="0.12"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.3"
      />

      {/* Exam text */}
      <text
        x="24"
        y="26"
        textAnchor="middle"
        fill={color}
        fontSize={examType.length > 4 ? '8' : '10'}
        fontWeight="700"
        fontFamily="Inter, sans-serif"
        dominantBaseline="middle"
      >
        {examType}
      </text>
    </svg>
  );
}
