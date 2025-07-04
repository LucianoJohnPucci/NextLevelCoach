import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Fetch notes from Supabase
  const fetchNotes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notes:", error);
        toast({
          title: "Error fetching notes",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setNotes(data as Note[]);
      }
    } catch (error) {
      console.error("Error in fetchNotes:", error);
    }
  };

  // Load notes when the component mounts
  useEffect(() => {
    if (user) {
      fetchNotes();
    } else {
      // If no user is logged in, try to load from localStorage as fallback
      const savedNotes = localStorage.getItem("userNotes");
      if (savedNotes) {
        try {
          setNotes(JSON.parse(savedNotes));
        } catch (e) {
          console.error("Failed to parse saved notes:", e);
        }
      }
    }
  }, [user]);

  // Save notes to localStorage whenever they change (as fallback)
  useEffect(() => {
    if (notes.length > 0 && !user) {
      localStorage.setItem("userNotes", JSON.stringify(notes));
    }
  }, [notes, user]);

  // Function to add a new note
  const addNote = async (title: string, content: string, category: string) => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please enter a title and content for the note");
      return;
    }

    setIsLoading(true);

    if (user) {
      // Add to Supabase
      try {
        const { data, error } = await supabase
          .from("notes")
          .insert([
            {
              title,
              content,
              category,
              user_id: user.id,
            }
          ])
          .select();

        if (error) {
          console.error("Error adding note:", error);
          toast({
            title: "Error adding note",
            description: error.message,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // Refresh notes after adding
        fetchNotes();
        toast.success("Note added successfully!");
      } catch (error) {
        console.error("Error in addNote:", error);
        toast.error("Failed to add note. Please try again.");
      }
    } else {
      // Add to local state if no user
      const newNote = {
        id: Date.now().toString(),
        title,
        content,
        category,
        created_at: new Date().toISOString(),
      };
      setNotes(prev => [...prev, newNote]);
      toast.success("Note added locally!");
    }

    setIsLoading(false);
  };

  // Function to remove a note
  const removeNote = async (id: string) => {
    if (user) {
      // Remove from Supabase
      try {
        const { error } = await supabase
          .from("notes")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Error removing note:", error);
          toast({
            title: "Error removing note",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        // Update local state
        setNotes(prev => prev.filter(note => note.id !== id));
        toast.success("Note removed successfully!");
      } catch (error) {
        console.error("Error in removeNote:", error);
      }
    } else {
      // Remove from local state
      setNotes(prev => prev.filter(note => note.id !== id));
      toast.success("Note removed locally!");
    }
  };

  // Function to update a note
  const updateNote = async (id: string, title: string, content: string, category: string) => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please enter a title and content for the note");
      return;
    }

    if (user) {
      try {
        const { error } = await supabase
          .from("notes")
          .update({ title, content, category })
          .eq("id", id);

        if (error) {
          console.error("Error updating note:", error);
          toast({
            title: "Error updating note",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        // Refresh notes after updating
        fetchNotes();
        toast.success("Note updated successfully!");
      } catch (error) {
        console.error("Error in updateNote:", error);
        toast.error("Failed to update note. Please try again.");
      }
    } else {
      // Update local state
      setNotes(prev =>
        prev.map(note =>
          note.id === id ? { ...note, title, content, category } : note
        )
      );
      toast.success("Note updated locally!");
    }
  };

  return {
    notes,
    isLoading,
    addNote,
    removeNote,
    updateNote,
  };
};
