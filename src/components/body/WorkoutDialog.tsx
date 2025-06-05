
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Dumbbell, Target } from "lucide-react";

interface Workout {
  title: string;
  category: string;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  favorite: boolean;
  exercises?: string[];
}

interface WorkoutDialogProps {
  workout: Workout | null;
  isOpen: boolean;
  onClose: () => void;
  onStartWorkout: () => void;
}

const WorkoutDialog = ({ workout, isOpen, onClose, onStartWorkout }: WorkoutDialogProps) => {
  if (!workout) return null;

  // Default exercises based on workout type
  const getWorkoutExercises = (title: string) => {
    switch (title.toLowerCase()) {
      case 'leg day':
        return [
          'Squats - 3 sets of 12 reps',
          'Romanian Deadlifts - 3 sets of 10 reps',
          'Leg Press - 3 sets of 15 reps',
          'Walking Lunges - 3 sets of 12 each leg',
          'Calf Raises - 4 sets of 15 reps',
          'Leg Curls - 3 sets of 12 reps'
        ];
      case 'chest day':
        return [
          'Bench Press - 4 sets of 8-10 reps',
          'Incline Dumbbell Press - 3 sets of 10 reps',
          'Chest Flyes - 3 sets of 12 reps',
          'Push-ups - 3 sets to failure',
          'Dips - 3 sets of 10 reps',
          'Cable Crossovers - 3 sets of 12 reps'
        ];
      case 'back day':
        return [
          'Pull-ups - 4 sets of 8-10 reps',
          'Barbell Rows - 3 sets of 10 reps',
          'Lat Pulldowns - 3 sets of 12 reps',
          'Seated Cable Rows - 3 sets of 12 reps',
          'Face Pulls - 3 sets of 15 reps',
          'Deadlifts - 3 sets of 8 reps'
        ];
      case 'arm day':
        return [
          'Bicep Curls - 3 sets of 12 reps',
          'Tricep Dips - 3 sets of 10 reps',
          'Hammer Curls - 3 sets of 12 reps',
          'Overhead Tricep Extension - 3 sets of 10 reps',
          'Preacher Curls - 3 sets of 10 reps',
          'Close-Grip Push-ups - 3 sets of 12 reps'
        ];
      default:
        return workout.exercises || [
          'Dynamic Warm-up - 5 minutes',
          'Main Exercise Block - 20 minutes',
          'Cool Down Stretches - 10 minutes'
        ];
    }
  };

  const exercises = getWorkoutExercises(workout.title);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            {workout.title}
          </DialogTitle>
          <DialogDescription>
            Get ready for your workout routine
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{workout.duration}</span>
            </div>
            <Badge variant="outline" className={getDifficultyColor(workout.difficulty)}>
              {workout.difficulty}
            </Badge>
            <Badge variant="secondary">
              {workout.category}
            </Badge>
          </div>

          <div>
            <h4 className="flex items-center gap-2 font-medium mb-3">
              <Target className="h-4 w-4" />
              Workout Plan
            </h4>
            <div className="space-y-2">
              {exercises.map((exercise, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">{exercise}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onStartWorkout} className="gap-2">
            <Dumbbell className="h-4 w-4" />
            Start Workout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutDialog;
