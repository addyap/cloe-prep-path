import { cn } from "@/lib/utils";

/**
 * Compact 12-week activity heatmap (84 days).
 * `activity` maps `YYYY-MM-DD` → minutes practised that day.
 */
export function StreakHeatmap({
  activity,
  className,
  weeks = 12,
}: {
  activity: Record<string, number>;
  className?: string;
  weeks?: number;
}) {
  const days = weeks * 7;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cells: { day: string; minutes: number; label: string }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    cells.push({
      day: key,
      minutes: activity[key] ?? 0,
      label: d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
    });
  }

  const intensity = (m: number) =>
    m <= 0
      ? "bg-secondary"
      : m < 5
        ? "bg-accent/30"
        : m < 15
          ? "bg-accent/55"
          : m < 30
            ? "bg-accent/80"
            : "bg-accent";

  return (
    <div className={cn("w-full", className)}>
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))`,
          gridTemplateRows: "repeat(7, minmax(0, 1fr))",
          gridAutoFlow: "column",
        }}
      >
        {cells.map((c) => (
          <div
            key={c.day}
            title={`${c.label} · ${c.minutes} min`}
            className={cn("aspect-square rounded-[3px]", intensity(c.minutes))}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>{weeks} weeks ago</span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          {["bg-secondary", "bg-accent/30", "bg-accent/55", "bg-accent/80", "bg-accent"].map(
            (c) => (
              <span key={c} className={cn("h-2 w-2 rounded-[2px]", c)} />
            ),
          )}
          <span>More</span>
        </div>
        <span>Today</span>
      </div>
    </div>
  );
}
