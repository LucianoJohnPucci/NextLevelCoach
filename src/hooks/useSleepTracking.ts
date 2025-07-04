
import { useState, useEffect } from 'react';
import { sleepTrackingService, SleepEntry } from '@/services/sleepTrackingService';
import { useAuth } from '@/components/AuthProvider';

export const useSleepTracking = () => {
  const [entries, setEntries] = useState<SleepEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageSleep, setAverageSleep] = useState<number | null>(null);
  const [sleepTrend, setSleepTrend] = useState<{
    currentAverage: number;
    previousAverage: number;
    percentChange: number;
    isIncreasing: boolean;
  } | null>(null);
  const { user } = useAuth();

  const fetchEntries = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await sleepTrackingService.getSleepEntries();
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching sleep entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSleepMetrics = async () => {
    if (!user) return;
    
    try {
      const [avgSleep, trend] = await Promise.all([
        sleepTrackingService.getAverageSleep(7),
        sleepTrackingService.getSleepTrend(7, 7)
      ]);
      
      setAverageSleep(avgSleep);
      setSleepTrend(trend);
    } catch (error) {
      console.error('Error fetching sleep metrics:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEntries();
      fetchSleepMetrics();
    }
  }, [user]);

  const addSleepEntry = async (entry: Omit<SleepEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      await sleepTrackingService.createSleepEntry(entry);
      await fetchEntries();
      await fetchSleepMetrics();
      return true;
    } catch (error) {
      console.error('Error adding sleep entry:', error);
      return false;
    }
  };

  return {
    entries,
    loading,
    averageSleep,
    sleepTrend,
    addSleepEntry,
    refreshData: () => {
      fetchEntries();
      fetchSleepMetrics();
    }
  };
};
