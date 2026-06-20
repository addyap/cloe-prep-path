/**
 * Shared client helpers: streak, daily minutes, activity map, badge evaluation.
 * Pure functions — no I/O.
 */

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
const levelToNum = (l: string | null | undefined) =>
  l ? LEVELS.indexOf(l as (typeof LEVELS)[number]) + 1 : 0;

export type AttemptLite = {
  created_at: string;
  cefr_level: string;
  is_correct: boolean | null;
};
export type SessionLite = {
  started_at: string;
  completed_at: string | null;
  mode: string;
};

const dayKey = (d: Date) => d.toISOString().slice(0, 10);

export function computeActivity(sessions: SessionLite[], attempts: AttemptLite[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const s of sessions) {
    if (!s.completed_at) continue;
    const ms = new Date(s.completed_at).getTime() - new Date(s.started_at).getTime();
    if (ms <= 0 || ms > 4 * 60 * 60 * 1000) continue;
    const key = s.completed_at.slice(0, 10);
    map[key] = (map[key] ?? 0) + ms / 60000;
  }
  // Ensure attempt-only days still register a tiny minute so streak counts.
  for (const a of attempts) {
    const key = a.created_at.slice(0, 10);
    if (!(key in map)) map[key] = 1;
  }
  for (const k of Object.keys(map)) map[k] = Math.round(map[k]);
  return map;
}

export function computeStreak(activity: Record<string, number>): number {
  const days = new Set(Object.keys(activity).filter((k) => activity[k] > 0));
  let streak = 0;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  if (!days.has(dayKey(d))) d.setDate(d.getDate() - 1);
  while (days.has(dayKey(d))) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function todayMinutes(activity: Record<string, number>): number {
  return activity[dayKey(new Date())] ?? 0;
}

export function evaluateBadges(
  attempts: AttemptLite[],
  sessions: SessionLite[],
  activity: Record<string, number>,
): string[] {
  const earned: string[] = [];
  if (attempts.length >= 10) earned.push("first_steps");
  if (attempts.length >= 100) earned.push("century_club");

  if (sessions.some((s) => s.mode === "mock" && s.completed_at)) earned.push("first_mock");

  if (computeStreak(activity) >= 7) earned.push("seven_day_streak");

  // level_up: any correct attempt higher than the lowest level seen
  const levels = attempts.map((a) => levelToNum(a.cefr_level)).filter((n) => n > 0);
  if (levels.length > 0) {
    const min = Math.min(...levels);
    const beat = attempts.some(
      (a) => a.is_correct === true && levelToNum(a.cefr_level) > min,
    );
    if (beat) earned.push("level_up");
  }

  return earned;
}
