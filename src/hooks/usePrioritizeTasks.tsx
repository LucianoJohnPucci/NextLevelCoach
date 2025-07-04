import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export interface Task {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  importance: "high" | "medium" | "low";
  due_date?: string;
  completed: boolean;
  user_id: string;
}

export const usePrioritizeTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching tasks:", error);
          toast({
            title: "Error fetching tasks",
            description: error.message,
            variant: "destructive",
          });
        }

        if (data) {
          setTasks(data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast({
          title: "Unexpected error",
          description: "Failed to retrieve tasks. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user, toast]);

  const addTask = async (
    title: string,
    priority: "high" | "medium" | "low",
    importance: "high" | "medium" | "low",
    due_date?: string
  ) => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to add tasks.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([
          {
            title,
            priority,
            importance,
            due_date,
            user_id: user.id,
          },
        ])
        .select();

      if (error) {
        console.error("Error adding task:", error);
        toast({
          title: "Error adding task",
          description: error.message,
          variant: "destructive",
        });
      }

      if (data) {
        setTasks([...tasks, data[0]]);
        toast({
          title: "Task added",
          description: `Task "${title}" added successfully.`,
        });
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Unexpected error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to update tasks.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) {
        console.error("Error updating task:", error);
        toast({
          title: "Error updating task",
          description: error.message,
          variant: "destructive",
        });
      }

      if (data) {
        setTasks(tasks.map((task) => (task.id === id ? data[0] : task)));
        toast({
          title: "Task updated",
          description: `Task "${data[0].title}" updated successfully.`,
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Unexpected error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeTask = async (id: string) => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to remove tasks.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);

      if (error) {
        console.error("Error removing task:", error);
        toast({
          title: "Error removing task",
          description: error.message,
          variant: "destructive",
        });
      }

      setTasks(tasks.filter((task) => task.id !== id));
      toast({
        title: "Task removed",
        description: "Task removed successfully.",
      });
    } catch (error) {
      console.error("Error removing task:", error);
      toast({
        title: "Unexpected error",
        description: "Failed to remove task. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { tasks, loading, addTask, updateTask, removeTask };
};
