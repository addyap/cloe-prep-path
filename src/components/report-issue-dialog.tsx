import { useState } from "react";
import { Flag } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

/** Small "Report an issue" affordance for a practice question — lets a
 *  learner flag a wrong/ambiguous item straight from the session. Writes to
 *  question_reports (insert-only RLS; reviewed via the Supabase CLI, no
 *  admin UI needed for this). */
export function ReportIssueDialog({
  questionId,
  userAnswer,
}: {
  questionId: string;
  userAnswer?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setSubmitting(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) {
      toast.error("You need to be signed in to report an issue.");
      setSubmitting(false);
      return;
    }
    const { error } = await supabase.from("question_reports").insert({
      question_id: questionId,
      user_id: u.user.id,
      user_answer: userAnswer ?? null,
      reason: reason.trim() || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't send your report. Please try again.");
      return;
    }
    toast.success("Thanks — this question has been flagged for review.");
    setReason("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-primary"
        >
          <Flag className="h-3.5 w-3.5" />
          Report an issue with this question
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report an issue</DialogTitle>
          <DialogDescription>
            Think this question is wrong, ambiguous, or broken? Let us know — this helps us keep the
            question bank accurate.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="What's wrong? (optional)"
          rows={4}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={submitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {submitting ? "Sending…" : "Send report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
