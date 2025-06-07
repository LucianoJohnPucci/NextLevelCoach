
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

export interface Task {
  id: string;
  title: string;
  due_date?: Date;
  importance_level: "low" | "medium" | "high";
  completed: boolean;
  created_at: Date;
}

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

const TaskItem = ({ task, onDelete, onToggleComplete }: TaskItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const getImportanceBadgeVariant = (level: string) => {
    switch (level) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed;

  return (
    <TableRow className={task.completed ? "opacity-60" : ""}>
      <TableCell>
        <Checkbox
          checked={task.completed}
          onCheckedChange={(checked) => onToggleComplete(task.id, checked as boolean)}
        />
      </TableCell>
      <TableCell className={task.completed ? "line-through" : ""}>
        {task.title}
      </TableCell>
      <TableCell>
        <Badge variant={getImportanceBadgeVariant(task.importance_level)}>
          {task.importance_level}
        </Badge>
      </TableCell>
      <TableCell>
        {task.due_date ? (
          <span className={isOverdue ? "text-red-500 font-medium" : ""}>
            {format(new Date(task.due_date), "MMM d, yyyy")}
          </span>
        ) : (
          <span className="text-muted-foreground">No due date</span>
        )}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default TaskItem;
