import { cn } from "@/lib/utils";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type CefrLevel = (typeof LEVELS)[number];

export function CefrProgress({
  current,
  target,
  className,
}: {
  current?: CefrLevel | null;
  target?: CefrLevel | null;
  className?: string;
}) {
  const currentIdx = current ? LEVELS.indexOf(current) : -1;
  const targetIdx = target ? LEVELS.indexOf(target) : -1;
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-end justify-between text-xs text-muted-foreground mb-2">
        <span>Beginner</span>
        <span>Proficient</span>
      </div>
      <div className="relative h-3 rounded-full bg-secondary overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-accent transition-all"
          style={{
            width: currentIdx >= 0 ? `${((currentIdx + 1) / LEVELS.length) * 100}%` : "0%",
          }}
        />
        {targetIdx >= 0 && (
          <div
            className="absolute inset-y-0 w-0.5 bg-primary"
            style={{ left: `${((targetIdx + 1) / LEVELS.length) * 100}%` }}
          />
        )}
      </div>
      <div className="mt-2 grid grid-cols-6 text-center text-xs font-medium">
        {LEVELS.map((lvl, i) => (
          <div
            key={lvl}
            className={cn(
              "py-1",
              i === currentIdx && "text-accent font-bold",
              i === targetIdx && i !== currentIdx && "text-primary font-bold",
              i !== currentIdx && i !== targetIdx && "text-muted-foreground",
            )}
          >
            {lvl}
          </div>
        ))}
      </div>
    </div>
  );
}
