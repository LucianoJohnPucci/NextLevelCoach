
-- Update the function to use a fixed search_path for security and reliability.
-- Also add SECURITY INVOKER if not required to run as definer.

CREATE OR REPLACE FUNCTION public.update_community_events_updated_at()
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
