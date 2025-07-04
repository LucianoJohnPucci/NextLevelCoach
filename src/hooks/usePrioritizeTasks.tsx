
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

export interface PriorityTask {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: "low" | "medium" | "high";
  importance: "low" | "medium" | "high";
  created_at: string;
  updated_at: string;
}

export const usePrioritizeTasks = () => {
  const [tasks, setTasks] = useState<PriorityTask[]>([]);
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
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedTasks: PriorityTask[] = (data || []).map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description || undefined,
        due_date: task.due_date || undefined,
        priority: task.priority as "low" | "medium" | "high",
        importance: task.importance as "low" | "medium" | "high",
        created_at: task.created_at,
        updated_at: task.updated_at,
      }));

      setTasks(formattedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: {
    title: string;
    description?: string;
    due_date?: string;
    priority: "low" | "medium" | "high";
    importance: "low" | "medium" | "high";
  }) => {
    if (!user) {
      toast.error("You must be logged in to add tasks");
      return false;
    }

    try {
      const { error } = await supabase.from("tasks").insert({
        user_id: user.id,
        title: taskData.title,
        description: taskData.description,
        due_date: taskData.due_date,
        priority: taskData.priority,
        importance: taskData.importance,
      });

      if (error) throw error;

      toast.success("Task added successfully!");
      fetchTasks();
      return true;
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task");
      return false;
    }
  };

  const updateTask = async (
    id: string,
    updates: Partial<Omit<PriorityTask, "id" | "created_at" | "updated_at">>
  ) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      toast.success("Task updated successfully!");
      fetchTasks();
      return true;
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
      return false;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Task deleted successfully!");
      fetchTasks();
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
      return false;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    refreshTasks: fetchTasks,
  };
};
