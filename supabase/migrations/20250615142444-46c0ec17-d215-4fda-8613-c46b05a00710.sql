
-- Drop the existing "Users can create own daily entries" policy if it exists
DROP POLICY IF EXISTS "Users can create own daily entries" ON public.daily_entries;

-- Create optimized policy using (select auth.uid())
CREATE POLICY "Users can create own daily entries"
  ON public.daily_entries
  FOR INSERT
  WITH CHECK (user_id = (select auth.uid()));
