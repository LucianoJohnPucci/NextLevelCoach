
import React, { useState } from "react";
import { Habit } from "./hooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, CheckCircle, XCircle, Target, Flame } from "lucide-react";
import HabitTrackingDialog from "./HabitTrackingDialog";

interface HabitItemProps {
  habit: Habit & {
    current_streak?: number;
    today_completed?: boolean;
    today_avoided_old_habit?: boolean;
    today_practiced_new_habit?: boolean;
    completion_rate?: number;
  };
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onTrackProgress?: (habitId: string, completed: boolean, avoidedOld?: boolean, practicedNew?: boolean) => void;
}

const HabitItem = ({ habit, onEdit, onDelete, onTrackProgress }: HabitItemProps) => {
  const [showTracking, setShowTracking] = useState(false);

  const getFrequencyDisplay = (frequency: string) => {
    switch (frequency) {
      case "daily": return "D";
      case "weekly": return "W";
      case "monthly": return "M";
      default: return frequency.charAt(0).toUpperCase();
    }
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 21) return "text-purple-600";
    if (streak >= 7) return "text-green-600";
    if (streak >= 3) return "text-blue-600";
    return "text-gray-600";
  };

  const handleQuickComplete = () => {
    if (onTrackProgress) {
      onTrackProgress(habit.id, !habit.today_completed);
    }
  };

  return (
    <>
      <div className={`flex items-center justify-between rounded-lg border p-4 ${habit.today_completed ? 'bg-green-50 border-green-200' : ''}`}>
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="font-medium">{habit.title}</div>
            
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
              {getFrequencyDisplay(habit.frequency)}
            </div>
            
            {habit.rating && (
              <Badge variant="secondary" className="text-xs">
                ⭐ {habit.rating}/5
              </Badge>
            )}

            {habit.current_streak !== undefined && habit.current_streak > 0 && (
              <Badge variant="outline" className={`text-xs ${getStreakColor(habit.current_streak)}`}>
                <Flame className="w-3 h-3 mr-1" />
                {habit.current_streak} day{habit.current_streak !== 1 ? 's' : ''}
              </Badge>
            )}

            {habit.completion_rate !== undefined && (
              <Badge variant="outline" className="text-xs">
                {habit.completion_rate}% success
              </Badge>
            )}
          </div>
          
          {(habit.old_habit || habit.new_habit) && (
            <div className="text-sm text-muted-foreground space-y-1">
              {habit.old_habit && (
                <div className="flex items-center gap-2">
                  <XCircle className="w-3 h-3 text-red-500" />
                  <span>Avoid: {habit.old_habit}</span>
                  {habit.today_avoided_old_habit === true && (
                    <Badge variant="outline" className="text-xs text-green-600">✓ Avoided today</Badge>
                  )}
                </div>
              )}
              {habit.new_habit && (
                <div className="flex items-center gap-2">
                  <Target className="w-3 h-3 text-green-500" />
                  <span>Practice: {habit.new_habit}</span>
                  {habit.today_practiced_new_habit === true && (
                    <Badge variant="outline" className="text-xs text-green-600">✓ Practiced today</Badge>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={habit.today_completed ? "default" : "outline"}
            size="sm"
            onClick={handleQuickComplete}
            className="gap-1"
          >
            <CheckCircle className="w-4 h-4" />
            {habit.today_completed ? "Done" : "Mark Done"}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowTracking(true)}
            className="h-8 w-8"
            title="Detailed tracking"
          >
            <Target className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onEdit(habit)}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(habit.id)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <HabitTrackingDialog
        open={showTracking}
        onOpenChange={setShowTracking}
        habit={habit}
        onTrackProgress={onTrackProgress}
      />
    </>
  );
};

export default HabitItem;
