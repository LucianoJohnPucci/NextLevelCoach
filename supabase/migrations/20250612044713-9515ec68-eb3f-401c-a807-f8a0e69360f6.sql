
-- Add the status column to the user_tasks table
ALTER TABLE public.user_tasks 
ADD COLUMN status text NOT NULL DEFAULT 'new';

-- Add a check constraint to ensure only valid status values
ALTER TABLE public.user_tasks 
ADD CONSTRAINT valid_status_values 
CHECK (status IN ('new', 'in_progress', 'hurdles', 'completed'));
