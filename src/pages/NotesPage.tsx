
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Sparkles, Plus, Search, BookOpen, LogIn } from "lucide-react";
import { format } from "date-fns";
import NoteForm from "@/components/notes/NoteForm";
import NoteItem from "@/components/notes/NoteItem";
import { useNotes } from "@/components/notes/useNotes";
import { useAuth } from "@/components/AuthProvider";
import { Link } from "react-router-dom";

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
  const { notes, addNote, deleteNote, loading } = useNotes();
  const { user } = useAuth();
  
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
      
      {!user && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <div>
                <h3 className="text-lg font-medium">Sign in to sync your notes</h3>
                <p className="text-sm text-muted-foreground">
                  Your notes are currently stored locally. Sign in to access them from any device.
                </p>
              </div>
              <Button asChild className="sm:ml-auto">
                <Link to="/auth">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
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
                {loading ? (
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
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                  ) : filteredNotes.filter(note => note.category === category).length > 0 ? (
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
