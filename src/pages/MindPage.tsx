
import React from "react";
import { motion } from "framer-motion";
import { Brain, Timer, Calendar, BarChart2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { useMeditationSessions } from "@/services/meditationService";
import { useMindMetrics } from "@/services/mindMetricsService";
import MindMetricsCard from "@/components/mind/MindMetricsCard";
import FeatureCard from "@/components/mind/FeatureCard";
import MeditationSessionsList from "@/components/mind/MeditationSessionsList";
import DailyQuote from "@/components/mind/DailyQuote";
import type { MeditationSession } from "@/services/meditationService";

const MindPage = () => {
  const { user } = useAuth();
  const { 
    sessions: meditations, 
    isLoading: isMeditationsLoading,
    isError: isMeditationsError,
    toggleSession,
    isToggling
  } = useMeditationSessions();

  const {
    weeklyMinutes,
    currentStreak,
    focusScore,
    isLoading: isMetricsLoading,
    recordSession,
    isRecording
  } = useMindMetrics();
  
  const handlePlayMeditation = (session: MeditationSession) => {
    if (!user) {
      toast.info(`Playing ${session.title}`, {
        description: "This feature is under development"
      });
      return;
    }

    // Demo: Record a meditation session (in a real app, we'd time the actual session)
    const minutes = parseInt(session.duration.split(' ')[0]);
    
    if (isNaN(minutes)) {
      toast.info(`Playing ${session.title}`, {
        description: "Session started"
      });
      return;
    }
    
    recordSession({ minutes }, {
      onSuccess: () => {
        toast.success(`Meditation completed`, {
          description: `${minutes} minutes added to your progress`
        });
      },
      onError: (error) => {
        toast.error("Failed to record session", {
          description: error.message
        });
      }
    });
  };

  const handleToggleFavorite = (session: MeditationSession, enabled: boolean) => {
    if (!user) {
      toast.error("You must be logged in to save sessions", {
        description: "Please sign in to save your favorite meditation sessions."
      });
      return;
    }

    toggleSession({ 
      sessionId: session.id, 
      isEnabled: enabled 
    }, {
      onSuccess: () => {
        toast.success(enabled ? "Added to favorites" : "Removed from favorites", {
          description: enabled 
            ? `${session.title} has been added to your favorites`
            : `${session.title} has been removed from your favorites`
        });
      },
      onError: (error) => {
        toast.error("Failed to update session", {
          description: error.message
        });
      }
    });
  };
  
  // Calculate weekly goal percentage
  const weeklyGoalMinutes = 200;
  const weeklyProgressPercentage = Math.min(Math.round((weeklyMinutes / weeklyGoalMinutes) * 100), 100);
  
  return (
    <div className="space-y-6">
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Mind</h1>
        <p className="text-muted-foreground">
          Tools and exercises to nurture your mental wellbeing.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <MindMetricsCard
          title="Meditation Progress"
          icon={<Brain className="h-4 w-4" />}
          value={weeklyMinutes}
          unit="Minutes"
          progress={weeklyProgressPercentage}
          description={`${weeklyProgressPercentage}% of weekly goal (${weeklyGoalMinutes})`}
          isLoading={isMetricsLoading}
          delay={0.1}
        />
        
        <MindMetricsCard
          title="Current Streak"
          icon={<Calendar className="h-4 w-4" />}
          value={currentStreak}
          unit="Days"
          progress={Math.min(currentStreak * 10, 100)}
          description={`Consistent meditation for ${currentStreak} days`}
          isLoading={isMetricsLoading}
          delay={0.2}
        />
        
        <MindMetricsCard
          title="Focus Score"
          icon={<Timer className="h-4 w-4" />}
          value={focusScore}
          unit="Score"
          progress={focusScore}
          description="Based on recent sessions"
          isLoading={isMetricsLoading}
          delay={0.3}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <FeatureCard
          title="Guided Meditation"
          description="Follow along with expert-led meditation sessions."
          icon={Brain}
          action="Explore Sessions"
          delay={0.1}
        />
        
        <div className="md:col-span-2">
          <MeditationSessionsList
            sessions={meditations}
            isAuthenticated={!!user}
            isLoading={isMeditationsLoading}
            isError={isMeditationsError}
            isToggling={isToggling}
            onToggleFavorite={handleToggleFavorite}
            onPlayMeditation={handlePlayMeditation}
          />
        </div>
      </div>
      
      <DailyQuote
        quote="The mind that is anxious about future events is miserable."
        author="Seneca"
      />
    </div>
  );
};

export default MindPage;
