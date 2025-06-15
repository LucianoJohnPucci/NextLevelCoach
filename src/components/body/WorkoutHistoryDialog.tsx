
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { BarChart2 } from "lucide-react";

export interface WorkoutHistoryItem {
  date: string;
  workout_minutes: number;
  calories_burned: number;
  streak_days: number;
  workout_title: string | null;
}

interface WorkoutHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: WorkoutHistoryItem[];
  isLoading: boolean;
  error: any;
}

const WorkoutHistoryDialog: React.FC<WorkoutHistoryDialogProps> = ({ isOpen, onClose, data, isLoading, error }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Workout History
          </DialogTitle>
          <DialogDescription>
            View your recent workout stats by date.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {isLoading ? (
            <div className="text-center text-muted-foreground py-6">Loading...</div>
          ) : error ? (
            <div className="text-center text-destructive py-6">Failed to load. Please try again.</div>
          ) : data.length === 0 ? (
            <div className="text-center text-muted-foreground py-6">No workout history found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Workout</TableHead>
                  <TableHead>Minutes</TableHead>
                  <TableHead>Calories</TableHead>
                  <TableHead>Streak</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.date}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.workout_title || "General Workout"}</TableCell>
                    <TableCell>{item.workout_minutes}</TableCell>
                    <TableCell>{item.calories_burned}</TableCell>
                    <TableCell>{item.streak_days}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutHistoryDialog;
