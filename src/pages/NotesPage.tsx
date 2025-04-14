
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Sparkles, Plus, Search, BookOpen } from "lucide-react";
import { format } from "date-fns";
import NoteForm from "@/components/notes/NoteForm";
import NoteItem from "@/components/notes/NoteItem";
import { useNotes } from "@/components/notes/useNotes";

export interface Note {
  id: string;
  title: string;
  content: string;
  category: "mind" | "body" | "soul";
  created_at: Date;
}

const NotesPage = () => {
  const [openForm, setOpenForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { notes, addNote, deleteNote } = useNotes();
  
  const filteredNotes = notes.filter((note) => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Notes</h1>
        <p className="text-muted-foreground">
          Capture insights and reflections across mind, body, and soul.
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setOpenForm(true)} className="ml-4">
          <Plus className="mr-2 h-4 w-4" /> New Note
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            <BookOpen className="mr-2 h-4 w-4" /> All Notes
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
        
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Notes</CardTitle>
              <CardDescription>All your collected notes across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNotes.length > 0 ? (
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
                        <NoteItem 
                          key={note.id} 
                          note={note}
                          onDelete={deleteNote}
                        />
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery ? "No matching notes found" : "No notes yet. Create your first note!"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {["mind", "body", "soul"].map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{category} Notes</CardTitle>
                <CardDescription>Your notes related to {category}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredNotes.filter(note => note.category === category).length > 0 ? (
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
                          .filter(note => note.category === category)
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
                      {searchQuery ? "No matching notes found" : `No ${category} notes yet. Create your first note!`}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      
      <NoteForm
        open={openForm}
        onOpenChange={setOpenForm}
        onSubmit={addNote}
      />
    </div>
  );
};

export default NotesPage;
