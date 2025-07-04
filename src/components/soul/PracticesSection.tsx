
import { useState, useEffect } from "react";
import PracticeCard from "./PracticeCard";
import { Clock, Users, Heart } from "lucide-react";
import { useSoulMetrics } from "@/services/soulMetricsService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const PracticesSection = () => {
  const { user } = useAuth();
  const { 
    reflectionMinutes, 
    connectionsAttended, 
    gratitudeStreak, 
    updateMetrics,
    isLoading,
    isError,
    todayMetrics
  } = useSoulMetrics();
  
  const [localReflectionMinutes, setLocalReflectionMinutes] = useState(0);
  const [localConnectionsAttended, setLocalConnectionsAttended] = useState(0);
  const [localGratitudeDays, setLocalGratitudeDays] = useState(0);
  
  // Initialize local state from database values when loaded
  useEffect(() => {
    if (!isLoading && todayMetrics) {
      setLocalReflectionMinutes(todayMetrics.reflection_minutes || 0);
      setLocalConnectionsAttended(todayMetrics.connections_attended || 0);
      setLocalGratitudeDays(todayMetrics.gratitude_streak_days || 0);
    }
  }, [todayMetrics, isLoading]);
  
  // Also update when the individual values change
  useEffect(() => {
    setLocalReflectionMinutes(reflectionMinutes);
  }, [reflectionMinutes]);
  
  useEffect(() => {
    setLocalConnectionsAttended(connectionsAttended);
  }, [connectionsAttended]);
  
  useEffect(() => {
    setLocalGratitudeDays(gratitudeStreak);
  }, [gratitudeStreak]);
  
  // Handle updating reflection minutes
  const handleReflectionChange = (value: number) => {
    setLocalReflectionMinutes(value);
    if (user) {
      updateMetrics({ reflection_minutes: value });
      toast.success("Reflection minutes updated");
    } else {
      toast.error("Please log in to save your progress");
    }
  };
  
  // Handle updating connections attended
  const handleConnectionsChange = (value: number) => {
    setLocalConnectionsAttended(value);
    if (user) {
      updateMetrics({ connections_attended: value });
      toast.success("Connections attended updated");
    } else {
      toast.error("Please log in to save your progress");
    }
  };
  
  // Handle updating gratitude days
  const handleGratitudeDaysChange = (value: number) => {
    setLocalGratitudeDays(value);
    if (user) {
      updateMetrics({ gratitude_streak_days: value });
      toast.success("Gratitude streak updated");
    } else {
      toast.error("Please log in to save your progress");
    }
  };
  
  if (isError) {
    return (
      <div className="text-center p-4 bg-destructive/10 rounded-md">
        <p className="text-destructive">Error loading soul metrics. Please try again later.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <PracticeCard
        title="Daily Reflection"
        description="Take time to reflect on your values and principles."
        icon={Clock}
        measurementType="Time spent reflecting"
        currentValue={localReflectionMinutes}
        maxValue={60}
        unit="minutes"
        delay={0.1}
        onValueChange={handleReflectionChange}
      />
      <PracticeCard
        title="Meaningful Connections"
        description="Join community events and discussions."
        icon={Users}
        measurementType="Events attended"
        currentValue={localConnectionsAttended}
        maxValue={5}
        unit="events"
        delay={0.2}
        onValueChange={handleConnectionsChange}
      />
      <PracticeCard
        title="Gratitude Practice"
        description="Cultivate thankfulness for life's gifts."
        icon={Heart}
        measurementType="Thankfulness streak"
        currentValue={localGratitudeDays}
        maxValue={10}
        unit="days"
        delay={0.3}
        onValueChange={handleGratitudeDaysChange}
      />
    </div>
  );
};

export default PracticesSection;
