import { useState } from "react";
import { BarChart2, Activity } from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import WorkoutItem from "./WorkoutItem";

export interface Workout {
  title: string;
  category: string;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  favorite: boolean;
}

export interface WorkoutsSectionProps {
  initialWorkouts: Workout[];
  onAddWorkout: (minutes: number) => void;
}

export const WorkoutsSection = ({ initialWorkouts, onAddWorkout }: WorkoutsSectionProps) => {
  const [workoutFilter, setWorkoutFilter] = useState("all");
  const [workouts, setWorkouts] = useState(initialWorkouts);
  
  const filteredWorkouts = workouts.filter(workout => 
    workoutFilter === "all" || (workoutFilter === "favorites" && workout.favorite)
  );
  
  const addWorkout = (duration: string) => {
    const minutes = parseInt(duration.match(/(\d+)/)?.[0] || "0", 10);
    onAddWorkout(minutes);
    toast.success(`Added ${minutes} minutes to your workout`);
  };
  
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
  
  return (
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
                onAdd={() => addWorkout(workout.duration)}
                onToggleFavorite={() => toggleFavorite(workouts.indexOf(workout))}
              />
            ))
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full gap-2">
          <BarChart2 className="h-4 w-4" />
          View Workout History
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkoutsSection;
