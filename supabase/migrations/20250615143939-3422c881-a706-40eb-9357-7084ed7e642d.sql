
-- Add persistent session count columns to mind_metrics
ALTER TABLE public.mind_metrics
  ADD COLUMN IF NOT EXISTS read_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS learn_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS journal_count integer NOT NULL DEFAULT 0;
