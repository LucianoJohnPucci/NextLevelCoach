
import { supabase } from "@/integrations/supabase/client";
import { Note } from "@/pages/NotesPage";

// Fetch notes from Supabase
export const fetchNotesFromSupabase = async () => {
  const { data, error } = await supabase
    .from("users_notes")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  
  // Transform the data to match our Note interface
  return data.map(note => ({
    id: note.id,
    title: note.title,
    content: note.content,
    category: note.category as "mind" | "body" | "soul",
    created_at: new Date(note.created_at)
  }));
};

// Save a note to Supabase
export const saveNoteToSupabase = async (
  userId: string,
  title: string,
  content: string,
  category: "mind" | "body" | "soul"
) => {
  const { data, error } = await supabase
    .from("users_notes")
    .insert({
      user_id: userId,
      title,
      content,
      category
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    category: data.category as "mind" | "body" | "soul",
    created_at: new Date(data.created_at)
  };
};

// Delete a note from Supabase
export const deleteNoteFromSupabase = async (noteId: string) => {
  const { error } = await supabase
    .from("users_notes")
    .delete()
    .eq("id", noteId);
  
  if (error) throw error;
};
