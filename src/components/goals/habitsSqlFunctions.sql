
-- Function to get all habits for a user
CREATE OR REPLACE FUNCTION public.get_habits()
RETURNS TABLE (
  id UUID,
  title TEXT,
  old_habit TEXT,
  new_habit TEXT,
  frequency TEXT,
  rating INTEGER,
  created_at TIMESTAMPTZ,
  user_id UUID
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT h.id, h.title, h.old_habit, h.new_habit, h.frequency, h.rating, h.created_at, h.user_id
  FROM public.habits h
  WHERE h.user_id = auth.uid();
END;
$$;

-- Function to add a new habit
CREATE OR REPLACE FUNCTION public.add_habit(
  p_title TEXT,
  p_user_id UUID,
  p_old_habit TEXT DEFAULT NULL,
  p_new_habit TEXT DEFAULT NULL,
  p_frequency TEXT DEFAULT 'daily',
  p_rating INTEGER DEFAULT NULL
)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.habits(
    title, user_id, old_habit, new_habit, frequency, rating
  )
  VALUES (
    p_title, p_user_id, p_old_habit, p_new_habit, p_frequency, p_rating
  );
END;
$$;

-- Function to update a habit
CREATE OR REPLACE FUNCTION public.update_habit(
  p_id UUID,
  p_title TEXT DEFAULT NULL,
  p_frequency TEXT DEFAULT NULL,
  p_old_habit TEXT DEFAULT NULL,
  p_new_habit TEXT DEFAULT NULL,
  p_rating INTEGER DEFAULT NULL
)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.habits
  SET
    title = COALESCE(p_title, title),
    frequency = COALESCE(p_frequency, frequency),
    old_habit = p_old_habit,
    new_habit = p_new_habit,
    rating = p_rating,
    updated_at = now()
  WHERE
    id = p_id AND
    user_id = auth.uid();
END;
$$;

-- Function to delete a habit
CREATE OR REPLACE FUNCTION public.delete_habit(p_id UUID)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.habits
  WHERE id = p_id AND user_id = auth.uid();
END;
$$;
