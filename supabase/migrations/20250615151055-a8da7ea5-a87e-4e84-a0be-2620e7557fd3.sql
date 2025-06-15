
-- Update the function to use a fixed search_path for security and reliability.
-- Also add SECURITY INVOKER if not required to run as definer.

CREATE OR REPLACE FUNCTION public.update_habit_tracking_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
