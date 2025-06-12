
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Task } from "./TaskItem";

interface TaskKanbanBoardProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

const TaskKanbanBoard = ({ tasks, onDelete, onStatusChange }: TaskKanbanBoardProps) => {
  const columns = [
    { id: "new", title: "New", status: "new" },
    { id: "in_progress", title: "In Progress", status: "in_progress" },
    { id: "hurdles", title: "Hurdles", status: "hurdles" },
    { id: "completed", title: "Completed", status: "completed" }
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
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

  const TaskCard = ({ task }: { task: Task }) => {
    const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed;
    
    return (
      <Card className="mb-3 cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.id)}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={getImportanceBadgeVariant(task.importance_level)} className="text-xs">
                {task.importance_level}
              </Badge>
            </div>
            
            {task.due_date && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span className={isOverdue ? "text-red-500 font-medium" : ""}>
                  {format(new Date(task.due_date), "MMM d, yyyy")}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.status);
        
        return (
          <div key={column.id} className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  {column.title}
                  <Badge variant="secondary" className="text-xs">
                    {columnTasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {columnTasks.length > 0 ? (
                    columnTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  ) : (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      No tasks
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default TaskKanbanBoard;
