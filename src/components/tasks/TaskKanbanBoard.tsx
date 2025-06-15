
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Task } from "./TaskItem";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";

interface TaskKanbanBoardProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

const TaskKanbanBoard = ({ tasks, onDelete, onStatusChange }: TaskKanbanBoardProps) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  const columns = [
    { id: "new", title: "New", status: "new" },
    { id: "in_progress", title: "In Progress", status: "in_progress" },
    { id: "hurdles", title: "Hurdles", status: "hurdles" },
    { id: "completed", title: "Completed", status: "completed" }
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveTask(null);
    
    if (!over) return;
    
    const taskId = active.id as string;
    const newStatus = over.id as string;
    
    // Find the task and check if status actually changed
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      onStatusChange(taskId, newStatus);
    }
  };

  const TaskCard = ({ task, isDragging = false }: { task: Task; isDragging?: boolean }) => {
    const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed;
    
    return (
      <Card 
        className={`mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
          isDragging ? "opacity-50" : ""
        }`}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", task.id);
        }}
      >
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
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

  const DroppableColumn = ({ column, children }: { column: any; children: React.ReactNode }) => {
    const [isDragOver, setIsDragOver] = useState(false);

    return (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          const taskId = e.dataTransfer.getData("text/plain");
          if (taskId) {
            onStatusChange(taskId, column.status);
          }
        }}
        className={`h-full transition-colors ${
          isDragOver ? "bg-muted/50" : ""
        }`}
      >
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              {column.title}
              <Badge variant="secondary" className="text-xs">
                {getTasksByStatus(column.status).length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 min-h-[200px]">
              {children}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.status);
          
          return (
            <DroppableColumn key={column.id} column={column}>
              {columnTasks.length > 0 ? (
                columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", task.id);
                      setActiveTask(task);
                    }}
                  >
                    <TaskCard task={task} />
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  No tasks
                </div>
              )}
            </DroppableColumn>
          );
        })}
      </div>
      
      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} isDragging />}
      </DragOverlay>
    </DndContext>
  );
};

export default TaskKanbanBoard;
