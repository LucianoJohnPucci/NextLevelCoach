
-- Create a table for sleep tracking entries
CREATE TABLE public.sleep_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  bedtime TIME,
  sleep_duration NUMERIC(3,1), -- e.g., 7.5 hours
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  interrupted BOOLEAN DEFAULT false,
  interruption_cause TEXT,
  dream_recall BOOLEAN DEFAULT false,
  dream_notes TEXT,
  sleep_onset_time TEXT, -- "<10", "10-30", "30-60", ">60"
  wake_feelings INTEGER CHECK (wake_feelings >= 1 AND wake_feelings <= 5),
  additional_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date) -- One entry per user per day
);

-- Enable Row Level Security
ALTER TABLE public.sleep_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own sleep entries" 
  ON public.sleep_entries 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sleep entries" 
  ON public.sleep_entries 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sleep entries" 
  ON public.sleep_entries 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sleep entries" 
  ON public.sleep_entries 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_sleep_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sleep_entries_updated_at
  BEFORE UPDATE ON public.sleep_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_sleep_entries_updated_at();
