
import { useState, useEffect } from "react";
import { Note } from "@/pages/NotesPage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Load notes from Supabase on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) {
        // If user is not logged in, try to load from localStorage as fallback
        const savedNotes = localStorage.getItem("userNotes");
        if (savedNotes) {
          try {
            const parsedNotes = JSON.parse(savedNotes);
            const notesWithDates = parsedNotes.map((note: any) => ({
              ...note,
              created_at: new Date(note.created_at)
            }));
            setNotes(notesWithDates);
          } catch (error) {
            console.error("Failed to parse saved notes:", error);
          }
        }
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from("users_notes")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        
        // Transform the data to match our Note interface
        const formattedNotes = data.map(note => ({
          id: note.id,
          title: note.title,
          content: note.content,
          category: note.category as "mind" | "body" | "soul",
          created_at: new Date(note.created_at)
        }));
        
        setNotes(formattedNotes);
      } catch (error) {
        console.error("Error fetching notes:", error);
        toast({
          title: "Error",
          description: "Failed to load notes. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotes();
  }, [user, toast]);
  
  const addNote = async (title: string, content: string, category: "mind" | "body" | "soul") => {
    // Create a temporary note with a local ID
    const tempNote: Note = {
      id: `temp-${Date.now()}`,
      title,
      content,
      category,
      created_at: new Date()
    };
    
    // Optimistically update UI
    setNotes(prev => [tempNote, ...prev]);
    
    if (!user) {
      // If user is not logged in, save to localStorage
      const updatedNotes = [tempNote, ...notes];
      localStorage.setItem("userNotes", JSON.stringify(updatedNotes));
      
      toast({
        title: "Note Added",
        description: "Your note has been saved locally. Sign in to sync across devices.",
      });
      
      return tempNote;
    }
    
    // Save to Supabase
    try {
      const { data, error } = await supabase
        .from("users_notes")
        .insert({
          user_id: user.id,
          title,
          content,
          category
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Replace the temporary note with the one from the database
      const newNote: Note = {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category,
        created_at: new Date(data.created_at)
      };
      
      setNotes(prev => [
        newNote,
        ...prev.filter(note => note.id !== tempNote.id)
      ]);
      
      toast({
        title: "Note Added",
        description: "Your note has been successfully saved to the cloud.",
      });
      
      return newNote;
    } catch (error) {
      console.error("Error adding note:", error);
      
      toast({
        title: "Error",
        description: "Failed to save note. Please try again.",
        variant: "destructive"
      });
      
      // Remove the temporary note if the request failed
      setNotes(prev => prev.filter(note => note.id !== tempNote.id));
      return null;
    }
  };
  
  const deleteNote = async (id: string) => {
    // Optimistically update UI
    setNotes(prev => prev.filter(note => note.id !== id));
    
    if (!user) {
      // If user is not logged in, update localStorage
      const updatedNotes = notes.filter(note => note.id !== id);
      localStorage.setItem("userNotes", JSON.stringify(updatedNotes));
      
      toast({
        title: "Note Deleted",
        description: "Your note has been removed.",
      });
      
      return;
    }
    
    // Delete from Supabase
    try {
      const { error } = await supabase
        .from("users_notes")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Note Deleted",
        description: "Your note has been permanently removed.",
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      
      // Restore the note if the request failed
      const noteToRestore = notes.find(note => note.id === id);
      if (noteToRestore) {
        setNotes(prev => [...prev, noteToRestore].sort((a, b) => 
          b.created_at.getTime() - a.created_at.getTime()
        ));
      }
      
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return {
    notes,
    addNote,
    deleteNote,
    loading
  };
};
