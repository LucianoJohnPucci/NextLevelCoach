
import { useState, useEffect } from "react";
import { Note } from "@/pages/NotesPage";
import { useToast } from "@/hooks/use-toast";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const { toast } = useToast();
  
  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("userNotes");
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        // Convert string dates back to Date objects
        const notesWithDates = parsedNotes.map((note: any) => ({
          ...note,
          created_at: new Date(note.created_at)
        }));
        setNotes(notesWithDates);
      } catch (error) {
        console.error("Failed to parse saved notes:", error);
        setNotes([]);
      }
    }
  }, []);
  
  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("userNotes", JSON.stringify(notes));
  }, [notes]);
  
  const addNote = (title: string, content: string, category: "mind" | "body" | "soul") => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      category,
      created_at: new Date()
    };
    
    setNotes(prev => [newNote, ...prev]);
    
    toast({
      title: "Note Added",
      description: "Your note has been successfully created.",
    });
    
    return newNote;
  };
  
  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    
    toast({
      title: "Note Deleted",
      description: "Your note has been removed.",
    });
  };
  
  return {
    notes,
    addNote,
    deleteNote
  };
};
