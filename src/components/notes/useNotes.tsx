
import { useState, useEffect } from "react";
import { Note } from "@/pages/NotesPage";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { fetchNotesFromSupabase, saveNoteToSupabase, deleteNoteFromSupabase } from "@/services/notesService";
import { getNotesFromLocalStorage, saveNotesToLocalStorage } from "@/services/localStorageService";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Load notes on component mount
  useEffect(() => {
    const loadNotes = async () => {
      setLoading(true);
      
      try {
        if (user) {
          // If user is logged in, fetch from Supabase
          const formattedNotes = await fetchNotesFromSupabase();
          setNotes(formattedNotes);
        } else {
          // If user is not logged in, load from localStorage
          const localNotes = getNotesFromLocalStorage();
          setNotes(localNotes);
        }
      } catch (error) {
        console.error("Error loading notes:", error);
        toast({
          title: "Error",
          description: "Failed to load notes. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadNotes();
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
      saveNotesToLocalStorage(updatedNotes);
      
      toast({
        title: "Note Added",
        description: "Your note has been saved locally. Sign in to sync across devices.",
      });
      
      return tempNote;
    }
    
    // Save to Supabase
    try {
      const newNote = await saveNoteToSupabase(user.id, title, content, category);
      
      // Replace the temporary note with the one from the database
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
      saveNotesToLocalStorage(updatedNotes);
      
      toast({
        title: "Note Deleted",
        description: "Your note has been removed.",
      });
      
      return;
    }
    
    // Delete from Supabase
    try {
      await deleteNoteFromSupabase(id);
      
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
