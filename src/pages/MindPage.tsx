
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Brain, Timer, Play, Bookmark, Loader2, BarChart2, Calendar } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { useMeditationSessions } from "@/services/meditationService";
import { useMindMetrics } from "@/services/mindMetricsService";
import type { MeditationSession } from "@/services/meditationService";

const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  action, 
  delay 
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType; 
  action: string | React.ReactNode; 
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="h-full">
        <CardHeader>
          <div className="mb-2 rounded-lg bg-primary/10 p-2 w-fit text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" className="w-full">
            {typeof action === 'string' ? action : action}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const MeditationSession = ({ 
  session,
  isAuthenticated,
  isToggling,
  onToggle,
  onPlay
}: { 
  session: MeditationSession;
  isAuthenticated: boolean;
  isToggling: boolean;
  onToggle: (enabled: boolean) => void;
  onPlay: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex justify-between rounded-lg border bg-card p-4 shadow-sm"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{session.title}</h3>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
            {session.duration}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{session.description}</p>
      </div>
      <div className="flex items-center gap-2">
        {isAuthenticated && (
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => onToggle(!session.is_enabled)}
            disabled={isToggling}
          >
            {isToggling ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : session.is_enabled ? (
              <Bookmark className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        )}
        <Button size="icon" onClick={onPlay}>
          <Play className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Meditation Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isMetricsLoading ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary/70" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <Brain className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">Minutes</span>
                    </div>
                    <div className="text-2xl font-bold">{weeklyMinutes}</div>
                  </div>
                  <Progress value={weeklyProgressPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {weeklyProgressPercentage}% of weekly goal ({weeklyGoalMinutes})
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isMetricsLoading ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary/70" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">Days</span>
                    </div>
                    <div className="text-2xl font-bold">{currentStreak}</div>
                  </div>
                  <Progress value={Math.min(currentStreak * 10, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Consistent meditation for {currentStreak} days
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Focus Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isMetricsLoading ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary/70" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <Timer className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">Score</span>
                    </div>
                    <div className="text-2xl font-bold">{focusScore}</div>
                  </div>
                  <Progress value={focusScore} className="h-2" />
                  <p className="text-xs text-muted-foreground">Based on recent sessions</p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Meditation Sessions
              </CardTitle>
              <CardDescription>
                Guided practices to improve focus and reduce stress.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isMeditationsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
                  </div>
                ) : isMeditationsError ? (
                  <div className="rounded-lg bg-destructive/10 p-4 text-center text-destructive">
                    <p>Failed to load meditation sessions</p>
                  </div>
                ) : meditations.length === 0 ? (
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <p>No meditation sessions available</p>
                  </div>
                ) : (
                  meditations.map((meditation) => (
                    <MeditationSession 
                      key={meditation.id}
                      session={meditation}
                      isAuthenticated={!!user}
                      isToggling={isToggling}
                      onToggle={(enabled) => handleToggleFavorite(meditation, enabled)}
                      onPlay={() => handlePlayMeditation(meditation)}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quote of the Day</CardTitle>
            <CardDescription>
              A thought to ponder and apply to your life.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-primary/5 p-6 text-center">
              <p className="mb-4 text-lg italic">
                "The mind that is anxious about future events is miserable."
              </p>
              <p className="font-medium">— Seneca</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MindPage;
