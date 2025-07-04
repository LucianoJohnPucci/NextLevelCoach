import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Task } from "./TaskItem";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTasks = async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedTasks: Task[] = (data || []).map((task) => ({
        id: task.id,
        title: task.title,
        due_date: task.due_date ? new Date(task.due_date) : undefined,
        importance_level: task.importance_level as "low" | "medium" | "high",
        completed: task.completed,
        status: (task.status || "new") as "new" | "in_progress" | "hurdles" | "completed",
        created_at: new Date(task.created_at),
      }));

      setTasks(formattedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: { title: string; due_date?: Date; importance_level: string }) => {
    if (!user) {
      toast.error("You must be logged in to add tasks");
      return;
    }

    try {
      const { error } = await supabase.from("user_tasks").insert({
        user_id: user.id,
        title: taskData.title,
        due_date: taskData.due_date ? taskData.due_date.toISOString().split('T')[0] : null,
        importance_level: taskData.importance_level,
        status: "new",
      });

      if (error) throw error;

      toast.success("Task added successfully!");
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from("user_tasks")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Task deleted successfully!");
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  const toggleTaskComplete = async (id: string, completed: boolean) => {
    try {
      const updateData: any = { completed };
      
      // If marking as completed, also update status
      if (completed) {
        updateData.status = "completed";
      }

      const { error } = await supabase
        .from("user_tasks")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      toast.success(completed ? "Task completed!" : "Task marked as incomplete");
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const updateTaskStatus = async (id: string, status: string) => {
    try {
      const updateData: any = { status };
      
      // If status is completed, also mark as completed
      if (status === "completed") {
        updateData.completed = true;
      } else if (status !== "completed") {
        updateData.completed = false;
      }

      const { error } = await supabase
        .from("user_tasks")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      toast.success("Task status updated!");
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  return {
    tasks,
    loading,
    addTask,
    deleteTask,
    toggleTaskComplete,
    updateTaskStatus,
  };
};
