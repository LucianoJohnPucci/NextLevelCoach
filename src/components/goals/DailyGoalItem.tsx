
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Clock, Brain, Heart, Sparkles } from "lucide-react";
import { DailyGoal } from "@/pages/GoalsPage";
import DailyGoalDialog from "./DailyGoalDialog";

interface DailyGoalItemProps {
  goal: DailyGoal;
  onRemove: (id: string) => void;
  onToggleCompletion: (id: string) => void;
  onUpdate: (id: string, updates: Partial<DailyGoal>) => void;
}

const DailyGoalItem = ({ goal, onRemove, onToggleCompletion, onUpdate }: DailyGoalItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(goal.title);
  const [editCategory, setEditCategory] = useState(goal.category);
  const [editStartTime, setEditStartTime] = useState(goal.startTime);
  const [editDuration, setEditDuration] = useState(goal.duration);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "mind": return <Brain className="h-4 w-4" />;
      case "body": return <Heart className="h-4 w-4" />;
      case "soul": return <Sparkles className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "mind": return "bg-blue-100 text-blue-800";
      case "body": return "bg-green-100 text-green-800";
      case "soul": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (time: string) => {
    if (!time) return "Not scheduled";
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleSaveEdit = () => {
    onUpdate(goal.id, {
      title: editTitle,
      category: editCategory,
      startTime: editStartTime,
      duration: editDuration
    });
    setIsEditing(false);
  };

  return (
    <>
      <div className={`p-4 border rounded-lg ${goal.completed ? 'bg-muted/50' : ''}`}>
        <div className="flex items-start gap-3">
          <Checkbox
            checked={goal.completed}
            onCheckedChange={() => onToggleCompletion(goal.id)}
            className="mt-1"
          />
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className={`font-medium ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                {goal.title}
              </h3>
              <Badge variant="secondary" className={getCategoryColor(goal.category)}>
                {getCategoryIcon(goal.category)}
                <span className="ml-1 capitalize">{goal.category}</span>
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatTime(goal.startTime)}</span>
              </div>
              <span>•</span>
              <span>{goal.duration} minutes</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(goal.id)}
              className="h-8 w-8 p-0 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <DailyGoalDialog
        open={isEditing}
        onOpenChange={setIsEditing}
        goalTitle={editTitle}
        setGoalTitle={setEditTitle}
        goalCategory={editCategory}
        setGoalCategory={setEditCategory}
        startTime={editStartTime}
        setStartTime={setEditStartTime}
        duration={editDuration}
        setDuration={setEditDuration}
        onAddGoal={handleSaveEdit}
        isLoading={false}
        isEditing={true}
      />
    </>
  );
};

export default DailyGoalItem;
