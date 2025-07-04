import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Edit, Trash2, FileText, Lightbulb, Heart, Target, Calendar, User, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import SleepTracker from "@/components/notes/SleepTracker";

const NotesPage = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editNoteTitle, setEditNoteTitle] = useState("");
  const [editNoteContent, setEditNoteContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchNotes();
  }, [user]);

  const fetchNotes = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notes:", error);
        toast({
          title: "Error",
          description: "Failed to fetch notes. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast({
        title: "Error",
        description: "Failed to fetch notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addNote = async () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter both title and content for the note.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("notes")
        .insert([
          {
            title: newNoteTitle,
            content: newNoteContent,
            user_id: user.id,
          },
        ]);

      if (error) {
        console.error("Error adding note:", error);
        toast({
          title: "Error",
          description: "Failed to add note. Please try again.",
          variant: "destructive",
        });
        return;
      }

      fetchNotes();
      setIsDialogOpen(false);
      setNewNoteTitle("");
      setNewNoteContent("");
      toast({
        title: "Success",
        description: "Note added successfully!",
      });
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const editNote = async () => {
    if (!editNoteTitle.trim() || !editNoteContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter both title and content for the note.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("notes")
        .update({ title: editNoteTitle, content: editNoteContent })
        .eq("id", selectedNote.id);

      if (error) {
        console.error("Error editing note:", error);
        toast({
          title: "Error",
          description: "Failed to edit note. Please try again.",
          variant: "destructive",
        });
        return;
      }

      fetchNotes();
      setIsEditDialogOpen(false);
      setSelectedNote(null);
      setEditNoteTitle("");
      setEditNoteContent("");
      toast({
        title: "Success",
        description: "Note edited successfully!",
      });
    } catch (error) {
      console.error("Error editing note:", error);
      toast({
        title: "Error",
        description: "Failed to edit note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase.from("notes").delete().eq("id", id);

      if (error) {
        console.error("Error deleting note:", error);
        toast({
          title: "Error",
          description: "Failed to delete note. Please try again.",
          variant: "destructive",
        });
        return;
      }

      fetchNotes();
      toast({
        title: "Success",
        description: "Note deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredNotes = notes.filter((note) => {
    const searchTextMatch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch =
      filterCategory === "all" || note.category === filterCategory;
    return searchTextMatch && categoryMatch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Your Notes</h1>
        <div className="flex items-center space-x-2">
          <Input
            type="search"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Note</DialogTitle>
                <DialogDescription>
                  Create a new note to capture your thoughts and ideas.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="content" className="text-right">
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    className="col-span-3 min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={addNote}>
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading notes...</div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center text-muted-foreground">No notes found.</div>
        ) : (
          filteredNotes.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <CardTitle>{note.title}</CardTitle>
                <CardDescription>
                  {format(new Date(note.created_at), "MMMM d, yyyy 'at' h:mm a")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{note.content.substring(0, 100)}...</p>
              </CardContent>
              <div className="flex justify-between p-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedNote(note);
                    setEditNoteTitle(note.title);
                    setEditNoteContent(note.content);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteNote(note.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>Edit your existing note.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title
              </Label>
              <Input
                id="edit-title"
                value={editNoteTitle}
                onChange={(e) => setEditNoteTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-content" className="text-right">
                Content
              </Label>
              <Textarea
                id="edit-content"
                value={editNoteContent}
                onChange={(e) => setEditNoteContent(e.target.value)}
                className="col-span-3 min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={editNote}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <SleepTracker />
    </motion.div>
  );
};

export default NotesPage;
