import { Award, Flame, ClipboardCheck, TrendingUp, Sparkles, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export const BADGES: Record<
  string,
  { title: string; description: string; icon: typeof Award }
> = {
  first_steps: { title: "First Steps", description: "Completed 10 attempts.", icon: Sparkles },
  first_mock: { title: "First Mock Done", description: "Finished your first full mock exam.", icon: ClipboardCheck },
  seven_day_streak: { title: "7-Day Streak", description: "Practised 7 days in a row.", icon: Flame },
  level_up: { title: "Level Up", description: "Scored correctly above your starting level.", icon: TrendingUp },
  century_club: { title: "Century Club", description: "Logged 100 attempts.", icon: Trophy },
};

export function BadgesShelf({
  earned,
  className,
}: {
  earned: Set<string>;
  className?: string;
}) {
  const all = Object.entries(BADGES);
  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3", className)}>
      {all.map(([code, b]) => {
        const got = earned.has(code);
        const Icon = b.icon;
        return (
          <div
            key={code}
            className={cn(
              "rounded-2xl border p-4 text-center transition",
              got ? "border-accent/40 bg-accent/5" : "border-border bg-card/40 opacity-60",
            )}
          >
            <div
              className={cn(
                "mx-auto h-10 w-10 rounded-xl flex items-center justify-center",
                got ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="mt-2 text-sm font-semibold text-foreground">{b.title}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
              {b.description}
            </div>
            {!got && <div className="text-[10px] mt-1 uppercase tracking-wide text-muted-foreground">Locked</div>}
          </div>
        );
      })}
    </div>
  );
}
