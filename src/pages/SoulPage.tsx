
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Users } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useSoulMetrics } from "@/services/soulMetricsService";
import { toast } from "sonner";
import ReflectionsSection from "@/components/soul/ReflectionsSection";

const SoulPage = () => {
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
  
  const [meditationCount, setMeditationCount] = useState(0);
  const [gratitudeCount, setGratitudeCount] = useState(0);
  const [connectionCount, setConnectionCount] = useState(0);
  
  // Initialize counts from database values when loaded
  useEffect(() => {
    if (!isLoading && todayMetrics) {
      setMeditationCount(todayMetrics.reflection_minutes || 0);
      setGratitudeCount(todayMetrics.gratitude_streak_days || 0);
      setConnectionCount(todayMetrics.connections_attended || 0);
    }
  }, [todayMetrics, isLoading]);
  
  const handleMeditationClick = () => {
    const newCount = meditationCount + 1;
    setMeditationCount(newCount);
    if (user) {
      updateMetrics({ reflection_minutes: newCount });
      toast.success("Meditation practice recorded!");
    } else {
      toast.error("Please log in to save your progress");
    }
  };
  
  const handleGratitudeClick = () => {
    const newCount = gratitudeCount + 1;
    setGratitudeCount(newCount);
    if (user) {
      updateMetrics({ gratitude_streak_days: newCount });
      toast.success("Daily gratitude recorded!");
    } else {
      toast.error("Please log in to save your progress");
    }
  };
  
  const handleConnectionClick = () => {
    const newCount = connectionCount + 1;
    setConnectionCount(newCount);
    if (user) {
      updateMetrics({ connections_attended: newCount });
      toast.success("Connection made recorded!");
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
    <div className="space-y-6">
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Soul</h1>
        <p className="text-muted-foreground">
          Daily check-ins for spiritual growth and inner peace.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow" onClick={handleMeditationClick}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-fit rounded-lg bg-blue-100 p-3 text-blue-600">
                <Brain className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Meditation Practiced</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {meditationCount}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Times practiced today
              </p>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMeditationClick();
                }}
              >
                + Add Practice
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow" onClick={handleGratitudeClick}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-fit rounded-lg bg-red-100 p-3 text-red-600">
                <Heart className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Daily Gratitude</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">
                {gratitudeCount}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Gratitude moments today
              </p>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGratitudeClick();
                }}
              >
                + Express Gratitude
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow" onClick={handleConnectionClick}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-fit rounded-lg bg-green-100 p-3 text-green-600">
                <Users className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Helped Someone</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {connectionCount}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Connections made today
              </p>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleConnectionClick();
                }}
              >
                + Made Connection
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <motion.div
        className="max-w-2xl mx-auto text-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="rounded-lg bg-primary/5 p-6">
          <h3 className="text-lg font-semibold mb-2">Today's Soul Progress</h3>
          <p className="text-muted-foreground">
            Keep nurturing your spiritual growth through daily practices of mindfulness, gratitude, and human connection.
          </p>
        </div>
      </motion.div>

      {/* Reflections section moved from Daily Input page */}
      <div className="max-w-4xl mx-auto">
        <ReflectionsSection />
      </div>
    </div>
  );
};

export default SoulPage;
