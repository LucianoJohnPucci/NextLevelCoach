
import { Note } from "@/pages/NotesPage";

const NOTES_STORAGE_KEY = "userNotes";

export const getNotesFromLocalStorage = (): Note[] => {
  try {
    const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
    if (!savedNotes) return [];
    
    const parsedNotes = JSON.parse(savedNotes);
    return parsedNotes.map((note: any) => ({
      ...note,
      created_at: new Date(note.created_at)
    }));
  } catch (error) {
    console.error("Failed to parse saved notes:", error);
    return [];
  }
};

export const saveNotesToLocalStorage = (notes: Note[]): void => {
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
};
