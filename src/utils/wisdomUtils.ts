
import { Message } from "@/types/wisdom";
import { Note } from "@/pages/NotesPage";
import { saveNoteToSupabase } from "@/services/notesService";
import { getNotesFromLocalStorage, saveNotesToLocalStorage } from "@/services/localStorageService";

// Function to add a wisdom message to notes
export const addWisdomToNotes = async (
  message: Message, 
  user: any | null,
  toast: any
): Promise<Note | null> => {
  const title = "Wisdom: " + message.content.substring(0, 30) + (message.content.length > 30 ? "..." : "");
  
  try {
    if (user) {
      // If user is logged in, save to Supabase
      const newNote = await saveNoteToSupabase(
        user.id,
        title,
        message.content,
        "soul" // Wisdom goes into the soul category
      );
      
      toast({
        title: "Added to Notes",
        description: "The wisdom has been added to your notes.",
      });
      
      return newNote;
    } else {
      // If user is not logged in, save to localStorage
      const tempNote: Note = {
        id: `local-${Date.now()}`,
        title,
        content: message.content,
        category: "soul",
        created_at: new Date()
      };
      
      // Get existing notes from localStorage
      const existingNotes = getNotesFromLocalStorage();
      
      // Add new note and save back to localStorage
      const updatedNotes = [tempNote, ...existingNotes];
      saveNotesToLocalStorage(updatedNotes);
      
      toast({
        title: "Added to Notes",
        description: "The wisdom has been saved to your local notes. Sign in to sync across devices.",
      });
      
      return tempNote;
    }
  } catch (error) {
    console.error("Error adding wisdom to notes:", error);
    toast({
      title: "Error",
      description: "Failed to add wisdom to notes. Please try again.",
      variant: "destructive"
    });
    return null;
  }
};
