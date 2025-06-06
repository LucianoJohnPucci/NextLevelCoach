
-- Function to get habit tracking data with streak calculation
CREATE OR REPLACE FUNCTION public.get_habit_tracking_with_streaks()
RETURNS TABLE (
  habit_id UUID,
  habit_title TEXT,
  habit_frequency TEXT,
  habit_old_habit TEXT,
  habit_new_habit TEXT,
  habit_rating INTEGER,
  current_streak INTEGER,
  total_completions INTEGER,
  completion_rate NUMERIC,
  last_completed_date DATE,
  today_completed BOOLEAN,
  today_avoided_old_habit BOOLEAN,
  today_practiced_new_habit BOOLEAN
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH habit_stats AS (
    SELECT 
      h.id,
      h.title,
      h.frequency,
      h.old_habit,
      h.new_habit,
      h.rating,
      -- Calculate current streak
      COALESCE((
        SELECT COUNT(*)
        FROM (
          SELECT ht.date,
                 ROW_NUMBER() OVER (ORDER BY ht.date DESC) as rn,
                 ht.date - INTERVAL '1 day' * (ROW_NUMBER() OVER (ORDER BY ht.date DESC) - 1) as expected_date
          FROM habit_tracking ht
          WHERE ht.habit_id = h.id 
            AND ht.completed = true
            AND ht.user_id = auth.uid()
          ORDER BY ht.date DESC
        ) streak_calc
        WHERE streak_calc.date = streak_calc.expected_date
      ), 0) as current_streak,
      -- Total completions
      COALESCE((
        SELECT COUNT(*)
        FROM habit_tracking ht
        WHERE ht.habit_id = h.id 
          AND ht.completed = true
          AND ht.user_id = auth.uid()
      ), 0) as total_completions,
      -- Completion rate
      CASE 
        WHEN (SELECT COUNT(*) FROM habit_tracking ht WHERE ht.habit_id = h.id AND ht.user_id = auth.uid()) > 0 THEN
          ROUND(
            (SELECT COUNT(*)::numeric FROM habit_tracking ht WHERE ht.habit_id = h.id AND ht.completed = true AND ht.user_id = auth.uid()) / 
            (SELECT COUNT(*)::numeric FROM habit_tracking ht WHERE ht.habit_id = h.id AND ht.user_id = auth.uid()) * 100, 
            1
          )
        ELSE 0
      END as completion_rate,
      -- Last completed date
      (
        SELECT MAX(ht.date)
        FROM habit_tracking ht
        WHERE ht.habit_id = h.id 
          AND ht.completed = true
          AND ht.user_id = auth.uid()
      ) as last_completed_date,
      -- Today's tracking data
      COALESCE((
        SELECT ht.completed
        FROM habit_tracking ht
        WHERE ht.habit_id = h.id 
          AND ht.date = CURRENT_DATE
          AND ht.user_id = auth.uid()
      ), false) as today_completed,
      (
        SELECT ht.avoided_old_habit
        FROM habit_tracking ht
        WHERE ht.habit_id = h.id 
          AND ht.date = CURRENT_DATE
          AND ht.user_id = auth.uid()
      ) as today_avoided_old_habit,
      (
        SELECT ht.practiced_new_habit
        FROM habit_tracking ht
        WHERE ht.habit_id = h.id 
          AND ht.date = CURRENT_DATE
          AND ht.user_id = auth.uid()
      ) as today_practiced_new_habit
    FROM habits h
    WHERE h.user_id = auth.uid()
  )
  SELECT 
    hs.id,
    hs.title,
    hs.frequency,
    hs.old_habit,
    hs.new_habit,
    hs.rating,
    hs.current_streak,
    hs.total_completions,
    hs.completion_rate,
    hs.last_completed_date,
    hs.today_completed,
    hs.today_avoided_old_habit,
    hs.today_practiced_new_habit
  FROM habit_stats hs;
END;
$$;

-- Function to track habit progress for a specific date
CREATE OR REPLACE FUNCTION public.track_habit_progress(
  p_habit_id UUID,
  p_date DATE DEFAULT CURRENT_DATE,
  p_completed BOOLEAN DEFAULT false,
  p_avoided_old_habit BOOLEAN DEFAULT NULL,
  p_practiced_new_habit BOOLEAN DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO habit_tracking (
    user_id, habit_id, date, completed, avoided_old_habit, practiced_new_habit, notes
  )
  VALUES (
    auth.uid(), p_habit_id, p_date, p_completed, p_avoided_old_habit, p_practiced_new_habit, p_notes
  )
  ON CONFLICT (habit_id, date)
  DO UPDATE SET
    completed = EXCLUDED.completed,
    avoided_old_habit = EXCLUDED.avoided_old_habit,
    practiced_new_habit = EXCLUDED.practiced_new_habit,
    notes = EXCLUDED.notes,
    updated_at = now();
END;
$$;

-- Function to get habit streak history
CREATE OR REPLACE FUNCTION public.get_habit_streak_history(
  p_habit_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  date DATE,
  completed BOOLEAN,
  avoided_old_habit BOOLEAN,
  practiced_new_habit BOOLEAN,
  notes TEXT
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ht.date,
    ht.completed,
    ht.avoided_old_habit,
    ht.practiced_new_habit,
    ht.notes
  FROM habit_tracking ht
  WHERE ht.habit_id = p_habit_id
    AND ht.user_id = auth.uid()
    AND ht.date >= CURRENT_DATE - INTERVAL '1 day' * p_days
  ORDER BY ht.date DESC;
END;
$$;
