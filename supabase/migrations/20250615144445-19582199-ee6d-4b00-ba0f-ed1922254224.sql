
-- Add persistent session count columns to body_metrics
ALTER TABLE public.body_metrics
  ADD COLUMN IF NOT EXISTS yoga_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cardio_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS strength_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS stretch_count integer NOT NULL DEFAULT 0;
