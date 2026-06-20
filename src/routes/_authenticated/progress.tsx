import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CefrProgress, type CefrLevel } from "@/components/cefr-progress";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { Flame, Clock, Target, TrendingUp, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/progress")({
  component: ProgressPage,
});

const LEVELS: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const levelToNum = (l: string | null | undefined) =>
  l ? LEVELS.indexOf(l as CefrLevel) + 1 : 0;
const numToLevel = (n: number): CefrLevel => {
  const i = Math.max(1, Math.min(6, Math.round(n))) - 1;
  return LEVELS[i];
};

const SKILLS = ["listening", "reading", "grammar_vocab", "writing", "speaking"] as const;
const SKILL_LABEL: Record<string, string> = {
  listening: "Listening",
  reading: "Reading",
  grammar_vocab: "Grammar",
  writing: "Writing",
  speaking: "Speaking",
};
const SKILL_ROUTE: Record<string, string> = {
  listening: "/practice/listening",
  reading: "/practice/reading",
  grammar_vocab: "/practice/grammar-vocab",
  writing: "/practice/writing",
  speaking: "/practice/speaking",
};

type Attempt = {
  id: string;
  created_at: string;
  skill: string;
  cefr_level: string;
  is_correct: boolean | null;
  score: number | null;
  question_id: string;
  questions: { context_tag: string | null } | null;
};

type Session = {
  started_at: string;
  completed_at: string | null;
  skill: string | null;
};

function ProgressPage() {
  const [current, setCurrent] = useState<CefrLevel | null>(null);
  const [target, setTarget] = useState<CefrLevel | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const [profileRes, attemptsRes, sessionsRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("current_estimated_level, target_cefr_level")
          .eq("id", u.user.id)
          .maybeSingle(),
        supabase
          .from("attempts")
          .select("id, created_at, skill, cefr_level, is_correct, score, question_id, questions(context_tag)")
          .eq("user_id", u.user.id)
          .order("created_at", { ascending: true }),
        supabase
          .from("practice_sessions")
          .select("started_at, completed_at, skill")
          .eq("user_id", u.user.id),
      ]);
      setCurrent((profileRes.data?.current_estimated_level as CefrLevel) ?? null);
      setTarget((profileRes.data?.target_cefr_level as CefrLevel) ?? null);
      setAttempts((attemptsRes.data as Attempt[]) ?? []);
      setSessions((sessionsRes.data as Session[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    // Level over time: rolling avg of attempted cefr_level (weighted by correct)
    const byDay = new Map<string, { total: number; sum: number }>();
    for (const a of attempts) {
      const day = a.created_at.slice(0, 10);
      const lvl = levelToNum(a.cefr_level);
      const weight = a.is_correct ? lvl : Math.max(1, lvl - 0.5);
      const entry = byDay.get(day) ?? { total: 0, sum: 0 };
      entry.total += 1;
      entry.sum += weight;
      byDay.set(day, entry);
    }
    const levelOverTime = Array.from(byDay.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, v]) => ({
        day: day.slice(5),
        level: +(v.sum / v.total).toFixed(2),
      }));

    // Accuracy by skill
    const skillAgg: Record<string, { correct: number; total: number; levelSum: number }> = {};
    for (const s of SKILLS) skillAgg[s] = { correct: 0, total: 0, levelSum: 0 };
    for (const a of attempts) {
      const k = skillAgg[a.skill];
      if (!k) continue;
      if (a.is_correct !== null) {
        k.total += 1;
        if (a.is_correct) k.correct += 1;
      } else if (a.score !== null) {
        // writing/speaking: score 0-5 → treat as accuracy %
        k.total += 1;
        if (a.score >= 3) k.correct += 1;
      }
      k.levelSum += levelToNum(a.cefr_level);
    }
    const accuracyBySkill = SKILLS.map((s) => ({
      skill: SKILL_LABEL[s],
      accuracy: skillAgg[s].total ? Math.round((skillAgg[s].correct / skillAgg[s].total) * 100) : 0,
      total: skillAgg[s].total,
    }));
    const radarData = SKILLS.map((s) => ({
      skill: SKILL_LABEL[s],
      level: skillAgg[s].total ? +(skillAgg[s].levelSum / skillAgg[s].total).toFixed(2) : 0,
    }));

    // Practice time (minutes)
    let totalMinutes = 0;
    for (const s of sessions) {
      if (!s.completed_at) continue;
      const ms = new Date(s.completed_at).getTime() - new Date(s.started_at).getTime();
      if (ms > 0 && ms < 1000 * 60 * 60 * 4) totalMinutes += ms / 60000;
    }
    totalMinutes = Math.round(totalMinutes);

    // Streak: consecutive days ending today (or yesterday) with attempts
    const days = new Set(attempts.map((a) => a.created_at.slice(0, 10)));
    let streak = 0;
    const d = new Date();
    if (!days.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
    while (days.has(d.toISOString().slice(0, 10))) {
      streak += 1;
      d.setDate(d.getDate() - 1);
    }

    // Weakest context tags
    const tagAgg: Record<string, { correct: number; total: number; skill: string }> = {};
    for (const a of attempts) {
      const tag = a.questions?.context_tag;
      if (!tag || a.is_correct === null) continue;
      const key = tag;
      const entry = tagAgg[key] ?? { correct: 0, total: 0, skill: a.skill };
      entry.total += 1;
      if (a.is_correct) entry.correct += 1;
      tagAgg[key] = entry;
    }
    const weakTags = Object.entries(tagAgg)
      .filter(([, v]) => v.total >= 3)
      .map(([tag, v]) => ({
        tag,
        skill: v.skill,
        accuracy: Math.round((v.correct / v.total) * 100),
        total: v.total,
      }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 4);

    return { levelOverTime, accuracyBySkill, radarData, totalMinutes, streak, weakTags };
  }, [attempts, sessions]);

  const currentNum = levelToNum(current);
  const targetNum = levelToNum(target);
  const readiness =
    targetNum > 0 ? Math.min(100, Math.round((currentNum / targetNum) * 100)) : 0;

  if (loading) {
    return (
      <AppShell>
        <div className="p-10 text-muted-foreground">Loading your progress…</div>
      </AppShell>
    );
  }

  const hasData = attempts.length > 0;

  return (
    <AppShell>
      <div className="p-5 md:p-10 max-w-6xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Your progress</h1>
          <p className="text-sm text-muted-foreground mt-1">
            How far you've come and where to push next.
          </p>
        </header>

        {!hasData && (
          <div className="rounded-3xl bg-card border border-border p-8 text-center shadow-card">
            <p className="text-muted-foreground">
              No practice data yet. Try a skill to start building your profile.
            </p>
            <Button asChild className="mt-4">
              <Link to="/dashboard">Start practising</Link>
            </Button>
          </div>
        )}

        {/* Readiness meter */}
        <section className="rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border p-6 md:p-8 shadow-card">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4" /> Readiness meter
              </div>
              <div className="mt-2 flex items-baseline gap-3">
                <div className="text-5xl font-extrabold text-primary">{readiness}%</div>
                <div className="text-sm text-muted-foreground">
                  there toward <span className="font-semibold text-foreground">{target ?? "—"}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                {readiness >= 100
                  ? "You're ready — consider booking the exam."
                  : readiness >= 80
                    ? "Almost there. Polish weak spots below."
                    : "Keep going. Daily short sessions move the needle fastest."}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Now</div>
              <div className="text-3xl font-bold text-accent">{current ?? "—"}</div>
            </div>
          </div>
          <CefrProgress current={current} target={target} className="mt-6" />
        </section>

        {/* Quick stats */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard icon={<Flame className="h-5 w-5" />} label="Day streak" value={`${stats.streak}`} />
          <StatCard icon={<Clock className="h-5 w-5" />} label="Practice time" value={`${stats.totalMinutes} min`} />
          <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Attempts" value={`${attempts.length}`} />
        </section>

        {/* Charts row */}
        <section className="grid md:grid-cols-2 gap-4">
          <ChartCard title="Estimated level over time">
            {stats.levelOverTime.length > 1 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={stats.levelOverTime}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis
                    domain={[1, 6]}
                    ticks={[1, 2, 3, 4, 5, 6]}
                    tickFormatter={(v) => numToLevel(v)}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(v: number) => [numToLevel(v), "Level"]}
                    contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="level"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart text="Practice a few more days to see your trend." />
            )}
          </ChartCard>

          <ChartCard title="Accuracy by skill">
            {hasData ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.accuracyBySkill}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="skill" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
                  <Tooltip
                    formatter={(v: number) => [`${v}%`, "Accuracy"]}
                    contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
                  />
                  <Bar dataKey="accuracy" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart text="No accuracy data yet." />
            )}
          </ChartCard>
        </section>

        {/* Radar */}
        <section className="grid md:grid-cols-2 gap-4">
          <ChartCard title="Four-skill balance">
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={stats.radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis
                  domain={[0, 6]}
                  tickFormatter={(v) => (v ? numToLevel(v) : "")}
                  tick={{ fontSize: 10 }}
                />
                <Radar
                  dataKey="level"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.35}
                />
                <Tooltip
                  formatter={(v: number) => [v ? numToLevel(v) : "—", "Avg level"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="rounded-3xl bg-card border border-border p-6 shadow-card">
            <div className="text-sm font-semibold text-muted-foreground">Drill your weak spots</div>
            <p className="text-xs text-muted-foreground mt-1">
              Areas with the lowest accuracy. One click to practise.
            </p>
            <div className="mt-4 space-y-3">
              {stats.weakTags.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Complete a few more questions to surface your weak spots.
                </p>
              )}
              {stats.weakTags.map((t) => (
                <div
                  key={t.tag}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-secondary/40"
                >
                  <div className="min-w-0">
                    <div className="font-semibold capitalize truncate">
                      {t.tag.replaceAll("_", " ")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {SKILL_LABEL[t.skill] ?? t.skill} · {t.accuracy}% over {t.total} attempts
                    </div>
                  </div>
                  <Button asChild size="sm" variant="secondary">
                    <Link to={SKILL_ROUTE[t.skill] ?? "/dashboard"}>
                      Drill <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-card border border-border p-4 shadow-card">
      <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold text-primary">{value}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-card border border-border p-5 shadow-card">
      <div className="text-sm font-semibold text-muted-foreground mb-3">{title}</div>
      {children}
    </div>
  );
}

function EmptyChart({ text }: { text: string }) {
  return (
    <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
