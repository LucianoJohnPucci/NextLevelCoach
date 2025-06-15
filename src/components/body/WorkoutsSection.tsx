

import { useState } from "react";
import { BarChart2, Activity } from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import WorkoutItem from "./WorkoutItem";
import WorkoutDialog from "./WorkoutDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import WorkoutHistoryDialog, { WorkoutHistoryItem } from "./WorkoutHistoryDialog";
import { useBodyMetrics } from "@/services/bodyMetricsService";

export interface Workout {
  title: string;
  category: string;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  favorite: boolean;
  exercises?: string[];
}

export interface WorkoutsSectionProps {
  initialWorkouts: Workout[];
  onAddWorkout: (minutes: number) => void;
}

export const WorkoutsSection = ({ initialWorkouts, onAddWorkout }: WorkoutsSectionProps) => {
  const [workoutFilter, setWorkoutFilter] = useState("all");
  const [workouts, setWorkouts] = useState(initialWorkouts);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Use body metrics service for recording sessions
  const { recordSession, isRecording } = useBodyMetrics();

  // Fetch the workout history (last 7 days) — refetch when dialog opens.
  const {
    data: historyData = [],
    isLoading: isHistoryLoading,
    error: historyError,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["body-metrics", "workout-history"],
    queryFn: async () => {
      // Get current user id via supabase.auth (session required)
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("User not authenticated");

      // 7 days ago
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const startDate = sevenDaysAgo.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from("body_metrics")
        .select("date, workout_minutes, calories_burned, streak_days")
        .eq("user_id", user.id)
        .gte("date", startDate)
        .order("date", { ascending: false });

      if (error) throw error;
      if (!data) return [];

      // Map results for table
      return data.map((item: any) => ({
        date: item.date,
        workout_minutes: item.workout_minutes ?? 0,
        calories_burned: item.calories_burned ?? 0,
        streak_days: item.streak_days ?? 0,
      })) as WorkoutHistoryItem[];
    },
    enabled: isHistoryOpen, // Only fetch when open
    refetchOnWindowFocus: false,
  });

  // Refetch workout history every time dialog opens.
  const handleOpenHistory = () => {
    setIsHistoryOpen(true);
    setTimeout(() => {
      refetchHistory();
    }, 0);
  };

  const filteredWorkouts = workouts.filter(workout => 
    workoutFilter === "all" || (workoutFilter === "favorites" && workout.favorite)
  );

  const toggleFavorite = (index: number) => {
    const updatedWorkouts = [...workouts];
    updatedWorkouts[index].favorite = !updatedWorkouts[index].favorite;
    setWorkouts(updatedWorkouts);

    toast.success(
      updatedWorkouts[index].favorite 
        ? `Added ${updatedWorkouts[index].title} to favorites` 
        : `Removed ${updatedWorkouts[index].title} from favorites`
    );
  };

  const handleLoadWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setIsDialogOpen(true);
  };

  const handleStartWorkout = async () => {
    if (selectedWorkout) {
      const minutes = parseInt(selectedWorkout.duration.match(/(\d+)/)?.[0] || "0", 10);
      
      try {
        // Record the workout session in Supabase
        recordSession({ minutes });
        
        onAddWorkout(minutes);
        setIsDialogOpen(false);
        toast.success(`Started ${selectedWorkout.title}! Workout recorded.`);
      } catch (error) {
        console.error("Failed to record workout session:", error);
        toast.error("Failed to record workout session. Please try again.");
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Today's Workouts
              </CardTitle>
              <CardDescription>
                Recommended exercises for your fitness goals.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={workoutFilter} onValueChange={setWorkoutFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Show" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Workouts</SelectItem>
                  <SelectItem value="favorites">Favorites</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredWorkouts.length === 0 ? (
              <div className="rounded-lg bg-muted p-4 text-center">
                <p>
                  {workoutFilter === "favorites" 
                    ? "No favorite workouts found" 
                    : "No workouts available"}
                </p>
              </div>
            ) : (
              filteredWorkouts.map((workout, index) => (
                <WorkoutItem 
                  key={index}
                  title={workout.title}
                  category={workout.category}
                  duration={workout.duration}
                  difficulty={workout.difficulty}
                  favorite={workout.favorite}
                  index={index}
                  onAdd={() => handleLoadWorkout(workout)}
                  onToggleFavorite={() => toggleFavorite(workouts.indexOf(workout))}
                  buttonLabel="Load Workout"
                />
              ))
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleOpenHistory}
            data-testid="view-workout-history"
          >
            <BarChart2 className="h-4 w-4" />
            View Workout History
          </Button>
        </CardFooter>
      </Card>

      <WorkoutDialog 
        workout={selectedWorkout}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onStartWorkout={handleStartWorkout}
        isRecording={isRecording}
      />

      {/* Workout History Dialog */}
      <WorkoutHistoryDialog
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        data={historyData}
        isLoading={isHistoryLoading}
        error={historyError}
      />
    </>
  );
};

export default WorkoutsSection;

