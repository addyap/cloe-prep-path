import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  ClipboardCheck,
  GraduationCap,
  ArrowRight,
  Flame,
  Pencil,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SKILL_ROUTES, type SkillSlug } from "@/lib/skills";
import { AppShell } from "@/components/app-shell";
import { CefrProgress, type CefrLevel } from "@/components/cefr-progress";
import { DailyGoalRing } from "@/components/daily-goal-ring";
import { StreakHeatmap } from "@/components/streak-heatmap";
import { BadgesShelf } from "@/components/badges-shelf";
import { OnboardingTour } from "@/components/onboarding-tour";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  computeActivity,
  computeStreak,
  todayMinutes,
  evaluateBadges,
  type AttemptLite,
  type SessionLite,
} from "@/lib/progress-stats";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

const SKILLS: { slug: SkillSlug; title: string; icon: typeof Headphones; desc: string }[] = [
  {
    slug: "listening",
    title: "Listening",
    icon: Headphones,
    desc: "Phone calls, meetings, announcements.",
  },
  { slug: "reading", title: "Reading", icon: BookOpen, desc: "Emails, reports, documents." },
  {
    slug: "grammar_vocab",
    title: "Grammar & Vocab",
    icon: PenLine,
    desc: "Fix errors, build precision.",
  },
  { slug: "writing", title: "Writing", icon: Pencil, desc: "Professional emails and short texts." },
  { slug: "speaking", title: "Speaking", icon: Mic, desc: "Respond to realistic prompts." },
];

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string>("");
  const [current, setCurrent] = useState<CefrLevel | null>(null);
  const [target, setTarget] = useState<CefrLevel | null>(null);
  const [goal, setGoal] = useState(15);
  const [editingGoal, setEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(15);
  const [attempts, setAttempts] = useState<AttemptLite[]>([]);
  const [sessions, setSessions] = useState<SessionLite[]>([]);
  const [earned, setEarned] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const [profileRes, attemptsRes, sessionsRes, badgesRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("full_name, current_estimated_level, target_cefr_level, daily_goal_minutes")
          .eq("id", u.user.id)
          .maybeSingle(),
        supabase
          .from("attempts")
          .select("created_at, cefr_level, is_correct")
          .eq("user_id", u.user.id),
        supabase
          .from("practice_sessions")
          .select("started_at, completed_at, mode")
          .eq("user_id", u.user.id),
        supabase.from("badges").select("code").eq("user_id", u.user.id),
      ]);

      const profile = profileRes.data;
      setName((profile?.full_name ?? u.user.email ?? "").split(" ")[0] ?? "");
      setCurrent((profile?.current_estimated_level as CefrLevel) ?? null);
      setTarget((profile?.target_cefr_level as CefrLevel) ?? null);
      const g = profile?.daily_goal_minutes ?? 15;
      setGoal(g);
      setTempGoal(g);

      const att = (attemptsRes.data as AttemptLite[]) ?? [];
      const ses = (sessionsRes.data as SessionLite[]) ?? [];
      setAttempts(att);
      setSessions(ses);
      const already = new Set((badgesRes.data ?? []).map((b) => b.code));

      // Award new badges
      const activity = computeActivity(ses, att);
      const newlyEarned = evaluateBadges(att, ses, activity);
      const toAward = newlyEarned.filter((c) => !already.has(c));
      if (toAward.length > 0) {
        await supabase
          .from("badges")
          .insert(toAward.map((code) => ({ user_id: u.user!.id, code })));
        for (const code of toAward) {
          already.add(code);
          toast.success(`🏆 Badge unlocked: ${code.replaceAll("_", " ")}`);
        }
      }
      setEarned(already);
      setLoading(false);
    })();
  }, []);

  const activity = computeActivity(sessions, attempts);
  const streak = computeStreak(activity);
  const today = todayMinutes(activity);

  const saveGoal = async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const n = Math.max(5, Math.min(120, Number(tempGoal) || 15));
    const { error } = await supabase
      .from("profiles")
      .update({ daily_goal_minutes: n })
      .eq("id", u.user.id);
    if (error) return toast.error(error.message);
    setGoal(n);
    setEditingGoal(false);
    toast.success(`Daily goal set to ${n} min.`);
  };

  return (
    <AppShell>
      <OnboardingTour />
      <div className="p-5 md:p-10 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">Hi {name || "there"} 👋</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Let's get you closer to your CLOE goal today.
            </p>
          </div>
        </div>

        {/* Top row: Level + Daily goal + Streak */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="md:col-span-1 rounded-3xl bg-card border border-border p-6 shadow-card">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-accent" />
              <div className="text-sm font-semibold text-muted-foreground">Estimated level</div>
            </div>
            {loading ? (
              <Skeleton className="h-12 w-20 mt-2" />
            ) : (
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-5xl font-extrabold text-primary">{current ?? "—"}</span>
                {target && (
                  <span className="text-sm text-muted-foreground">
                    Target: <strong className="text-foreground">{target}</strong>
                  </span>
                )}
              </div>
            )}
            <CefrProgress current={current} target={target} className="mt-4" />
          </div>

          <div className="rounded-3xl bg-card border border-border p-6 shadow-card flex flex-col items-center justify-center">
            <div className="text-sm font-semibold text-muted-foreground self-start flex items-center justify-between w-full">
              <span>Today's goal</span>
              {!editingGoal && (
                <button
                  onClick={() => setEditingGoal(true)}
                  className="text-xs text-accent hover:underline"
                >
                  Edit
                </button>
              )}
            </div>
            {loading ? (
              <Skeleton className="h-24 w-24 rounded-full mt-2" />
            ) : (
              <div className="mt-2">
                <DailyGoalRing minutes={today} goal={goal} />
              </div>
            )}
            {editingGoal ? (
              <div className="mt-3 flex gap-2 items-center">
                <Input
                  type="number"
                  min={5}
                  max={120}
                  value={tempGoal}
                  onChange={(e) => setTempGoal(Number(e.target.value))}
                  className="w-20 h-8"
                />
                <Button size="sm" onClick={saveGoal}>
                  Save
                </Button>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground mt-2">
                {today >= goal
                  ? "🎉 Goal hit — nice work!"
                  : `${Math.max(0, goal - today)} min to go`}
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-accent/15 to-primary/10 border border-border p-6 shadow-card">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Flame className="h-4 w-4 text-accent" /> Streak
            </div>
            {loading ? (
              <Skeleton className="h-12 w-16 mt-2" />
            ) : (
              <>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-primary">{streak}</span>
                  <span className="text-sm text-muted-foreground">
                    day{streak === 1 ? "" : "s"}
                  </span>
                </div>
                <StreakHeatmap activity={activity} className="mt-4" weeks={10} />
              </>
            )}
          </div>
        </div>

        {/* Badges */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-foreground">Badges</h2>
          {loading ? (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : (
            <BadgesShelf earned={earned} className="mt-3" />
          )}
        </section>

        <h2 className="mt-10 text-lg font-bold text-foreground">Practice by skill</h2>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILLS.map((s) => (
            <Link
              key={s.slug}
              to={SKILL_ROUTES[s.slug]}
              className="group rounded-2xl bg-card border border-border p-5 shadow-card hover:shadow-elevated hover:border-accent/50 transition"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 font-semibold text-foreground">{s.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.desc}</div>
              <div className="mt-4 text-sm font-medium text-accent flex items-center gap-1">
                Start <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}

          <Link
            to="/mock-exam"
            className="group rounded-2xl bg-primary text-primary-foreground p-5 shadow-elevated hover:opacity-95 transition"
          >
            <div className="h-10 w-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div className="mt-4 font-semibold">Full Mock Exam</div>
            <div className="text-sm text-primary-foreground/80 mt-1">
              Simulate the full adaptive CLOE in one sitting.
            </div>
            <div className="mt-4 text-sm font-medium text-accent flex items-center gap-1">
              Start mock <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
