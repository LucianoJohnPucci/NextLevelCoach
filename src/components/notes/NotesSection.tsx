import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Sparkles, Plus, Search, BookOpen } from "lucide-react";
import NoteForm from "@/components/notes/NoteForm";
import NoteItem from "@/components/notes/NoteItem";
import { useNotes } from "@/components/notes/useNotes";

/**
 * Stand-alone Notes UI extracted from the previous `NotesPage`.  
 * It can be embedded anywhere – e.g. inside the "Goals & Tasks" page – without
 * pulling in the Sleep-tracker.  All state is self-contained.
 */
const NotesSection = () => {
  const [openNoteForm, setOpenNoteForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { notes, addNote, deleteNote, loading: notesLoading } = useNotes();

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle>Notes</CardTitle>
          </div>
        </div>
        <CardDescription>Capture insights and knowledge across mind, body, and soul.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search & create bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="ml-4" onClick={() => setOpenNoteForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Note
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="notes">
          <TabsList>
            <TabsTrigger value="notes">
              <BookOpen className="mr-2 h-4 w-4" /> All
            </TabsTrigger>
            <TabsTrigger value="mind">
              <Brain className="mr-2 h-4 w-4" /> Mind
            </TabsTrigger>
            <TabsTrigger value="body">
              <Heart className="mr-2 h-4 w-4" /> Body
            </TabsTrigger>
            <TabsTrigger value="soul">
              <Sparkles className="mr-2 h-4 w-4" /> Soul
            </TabsTrigger>
          </TabsList>

          {/* All */}
          <TabsContent value="notes" className="mt-4">
            {notesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : filteredNotes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[100px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotes.map((note) => (
                    <NoteItem key={note.id} note={note} onDelete={deleteNote} />
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "No matching notes found" : "No notes yet. Create your first note!"}
              </div>
            )}
          </TabsContent>

          {/* Category-specific */}
          {['mind', 'body', 'soul'].map((category) => (
            <TabsContent key={category} value={category} className="mt-4">
              {notesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : filteredNotes.filter((n) => n.category === category).length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-[100px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotes
                      .filter((n) => n.category === category)
                      .map((note) => (
                        <NoteItem
                          key={note.id}
                          note={note}
                          onDelete={deleteNote}
                          hideCategory
                        />
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'No matching notes found' : `No ${category} notes yet. Create your first note!`}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>

      {/* New note dialog */}
      <NoteForm open={openNoteForm} onOpenChange={setOpenNoteForm} onSubmit={addNote} />
    </Card>
  );
};

export default NotesSection;
