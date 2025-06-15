
CREATE OR REPLACE FUNCTION public.update_onboarding_last_updated()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$;
