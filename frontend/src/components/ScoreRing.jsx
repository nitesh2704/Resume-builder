export default function ScoreRing({ score = 0, size = 'md' }) {
  const radius = size === 'lg' ? 42 : 32
  const stroke = 8
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(score, 100) / 100) * circumference
  const box = (radius + stroke) * 2

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={box} height={box} viewBox={`0 0 ${box} ${box}`} className="-rotate-90">
        <circle
          cx={box / 2}
          cy={box / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
          className="text-green-100 dark:text-emerald-950"
        />
        <circle
          cx={box / 2}
          cy={box / 2}
          r={radius}
          stroke="url(#scoreGradient)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#1F7A4C" />
            <stop offset="1" stopColor="#4ADE80" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-sm font-extrabold text-verdant-primary dark:text-green-300">{score}</span>
    </div>
  )
}
