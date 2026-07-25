import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { CefrLevel } from "@/components/cefr-progress";

export const Route = createFileRoute("/_authenticated/profile")({ component: ProfilePage });

const LEVELS: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

function ProfilePage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [target, setTarget] = useState<CefrLevel | "">("");
  const [saving, setSaving] = useState(false);
  // Anonymous (no-login) visitors have no email and nothing to sign out of.
  const [isAnonymous, setIsAnonymous] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setIsAnonymous(u.user.is_anonymous ?? false);
      setEmail(u.user.email ?? "");
      const { data } = await supabase
        .from("profiles")
        .select("full_name, target_cefr_level")
        .eq("id", u.user.id)
        .maybeSingle();
      setFullName(data?.full_name ?? "");
      setTarget((data?.target_cefr_level as CefrLevel) ?? "");
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        target_cefr_level: target || null,
      })
      .eq("id", u.user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated.");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <AppShell>
      <div className="p-5 md:p-10 max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Profile</h1>
        <div className="mt-6 rounded-3xl bg-card border border-border p-6 md:p-8 shadow-card space-y-4">
          {!isAnonymous && (
            <div>
              <Label>Email</Label>
              <Input value={email} disabled />
            </div>
          )}
          <div>
            <Label htmlFor="fn">Full name</Label>
            <Input id="fn" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <Label>Target CEFR level</Label>
            <Select value={target || undefined} onValueChange={(v) => setTarget(v as CefrLevel)}>
              <SelectTrigger>
                <SelectValue placeholder="Pick a level" />
              </SelectTrigger>
              <SelectContent>
                {LEVELS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              onClick={save}
              disabled={saving}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Save changes
            </Button>
            {!isAnonymous && (
              <Button variant="outline" onClick={signOut}>
                Sign out
              </Button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
