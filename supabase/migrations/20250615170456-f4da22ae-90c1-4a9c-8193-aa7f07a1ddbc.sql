
-- Add workout_title column to body_metrics table
ALTER TABLE public.body_metrics 
ADD COLUMN workout_title TEXT;
