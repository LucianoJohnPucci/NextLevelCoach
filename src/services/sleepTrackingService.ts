
import { supabase } from "@/integrations/supabase/client";

export interface SleepEntry {
  id?: string;
  user_id?: string;
  date: string;
  bedtime?: string;
  sleep_duration: number;
  sleep_quality: number;
  interrupted: boolean;
  interruption_cause?: string;
  dream_recall: boolean;
  dream_notes?: string;
  sleep_onset_time?: string;
  wake_feelings: number;
  additional_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const sleepTrackingService = {
  async createSleepEntry(entry: Omit<SleepEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('sleep_entries')
      .insert([{
        ...entry,
        user_id: (await supabase.auth.getUser()).data.user?.id
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSleepEntries(limit?: number) {
    let query = supabase
      .from('sleep_entries')
      .select('*')
      .order('date', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getAverageSleep(days: number = 7) {
    const { data, error } = await supabase
      .from('sleep_entries')
      .select('sleep_duration')
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .not('sleep_duration', 'is', null);

    if (error) throw error;
    
    if (!data || data.length === 0) return null;
    
    const total = data.reduce((sum, entry) => sum + (entry.sleep_duration || 0), 0);
    return total / data.length;
  },

  async getSleepTrend(currentDays: number = 7, previousDays: number = 7) {
    const currentDate = new Date();
    const currentStart = new Date(currentDate.getTime() - currentDays * 24 * 60 * 60 * 1000);
    const previousStart = new Date(currentDate.getTime() - (currentDays + previousDays) * 24 * 60 * 60 * 1000);
    
    const [currentData, previousData] = await Promise.all([
      supabase
        .from('sleep_entries')
        .select('sleep_duration')
        .gte('date', currentStart.toISOString().split('T')[0])
        .not('sleep_duration', 'is', null),
      supabase
        .from('sleep_entries')
        .select('sleep_duration')
        .gte('date', previousStart.toISOString().split('T')[0])
        .lt('date', currentStart.toISOString().split('T')[0])
        .not('sleep_duration', 'is', null)
    ]);

    if (currentData.error || previousData.error) {
      throw currentData.error || previousData.error;
    }

    if (!currentData.data?.length || !previousData.data?.length) return null;

    const currentAvg = currentData.data.reduce((sum, entry) => sum + (entry.sleep_duration || 0), 0) / currentData.data.length;
    const previousAvg = previousData.data.reduce((sum, entry) => sum + (entry.sleep_duration || 0), 0) / previousData.data.length;

    const percentChange = ((currentAvg - previousAvg) / previousAvg) * 100;
    
    return {
      currentAverage: currentAvg,
      previousAverage: previousAvg,
      percentChange: Math.round(Math.abs(percentChange)),
      isIncreasing: percentChange > 0
    };
  }
};
