-- Phase 2 of the fill-in-the-blank / text-reconstruction / word-bank format
-- rebuild. New enum value only in this file — a CHECK constraint expression
-- referencing 'reconstruction' counts as using it, so it can't share this
-- transaction (see the follow-up migration).
ALTER TYPE public.question_type ADD VALUE IF NOT EXISTS 'reconstruction';
