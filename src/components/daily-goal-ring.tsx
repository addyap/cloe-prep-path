export function DailyGoalRing({
  minutes,
  goal,
  size = 96,
}: {
  minutes: number;
  goal: number;
  size?: number;
}) {
  const pct = goal > 0 ? Math.min(1, minutes / goal) : 0;
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          className="text-secondary"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          className="text-accent transition-all"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-xl font-extrabold text-primary leading-none">{minutes}</div>
        <div className="text-[10px] text-muted-foreground mt-0.5">/ {goal} min</div>
      </div>
    </div>
  );
}
