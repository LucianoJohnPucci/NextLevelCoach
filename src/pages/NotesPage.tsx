
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Brain, Heart, Sparkles, Plus, Search, BookOpen, LogIn, CheckSquare, Database, List, Kanban } from "lucide-react";
import { format } from "date-fns";
import NoteForm from "@/components/notes/NoteForm";
import NoteItem from "@/components/notes/NoteItem";
import TaskForm from "@/components/tasks/TaskForm";
import TaskItem from "@/components/tasks/TaskItem";
import TaskKanbanBoard from "@/components/tasks/TaskKanbanBoard";
import { useNotes } from "@/components/notes/useNotes";
import { useTasks } from "@/components/tasks/useTasks";
import { useAuth } from "@/components/AuthProvider";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export interface Note {
  id: string;
  title: string;
  content: string;
  category: "mind" | "body" | "soul";
  created_at: Date;
}

const NotesPage = () => {
  const [openNoteForm, setOpenNoteForm] = useState(false);
  const [openTaskForm, setOpenTaskForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recordsEnabled, setRecordsEnabled] = useState(true);
  const [taskViewMode, setTaskViewMode] = useState<"list" | "kanban">("list");
  const { notes, addNote, deleteNote, loading: notesLoading } = useNotes();
  const { tasks, addTask, deleteTask, toggleTaskComplete, updateTaskStatus, loading: tasksLoading } = useTasks();
  const { user } = useAuth();
  
  const filteredNotes = notes.filter((note) => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRecordsToggle = (enabled: boolean) => {
    setRecordsEnabled(enabled);
    toast(enabled ? 'Database records enabled' : 'Database records disabled', {
      description: enabled ? 'Your entries will be saved to the database.' : 'Your entries will not be saved to the database.',
      icon: <Database className="h-4 w-4" />,
    });
  };
  
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Notes & Tasks</h1>
        <p className="text-muted-foreground">
          Capture insights and manage tasks across mind, body, and soul.
        </p>
      </div>
      
      {!user && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <div>
                <h3 className="text-lg font-medium">Sign in to sync your notes and tasks</h3>
                <p className="text-sm text-muted-foreground">
                  Your notes and tasks are currently stored locally. Sign in to access them from any device.
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
            placeholder="Search notes and tasks..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 ml-4">
          <Button onClick={() => setOpenNoteForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Note
          </Button>
          <Button onClick={() => setOpenTaskForm(true)} variant="outline">
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList>
          <TabsTrigger value="tasks">
            <CheckSquare className="mr-2 h-4 w-4" /> Tasks
          </TabsTrigger>
          <TabsTrigger value="notes">
            <BookOpen className="mr-2 h-4 w-4" /> Notes
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
        
        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Tasks</CardTitle>
                  <CardDescription>Track your important tasks and deadlines</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={taskViewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTaskViewMode("list")}
                  >
                    <List className="mr-2 h-4 w-4" /> List
                  </Button>
                  <Button
                    variant={taskViewMode === "kanban" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTaskViewMode("kanban")}
                  >
                    <Kanban className="mr-2 h-4 w-4" /> Board
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {tasksLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : filteredTasks.length > 0 ? (
                taskViewMode === "list" ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Done</TableHead>
                        <TableHead>Task</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="w-[100px]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTasks.map((task) => (
                        <TaskItem 
                          key={task.id} 
                          task={task}
                          onDelete={deleteTask}
                          onToggleComplete={toggleTaskComplete}
                          onStatusChange={updateTaskStatus}
                        />
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <TaskKanbanBoard
                    tasks={filteredTasks}
                    onDelete={deleteTask}
                    onStatusChange={updateTaskStatus}
                  />
                )
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? "No matching tasks found" : "No tasks yet. Create your first task!"}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Notes</CardTitle>
              <CardDescription>All your collected notes across categories</CardDescription>
            </CardHeader>
            <CardContent>
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
                {notesLoading ? (
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
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      
      <Card className="mb-6 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" /> Database Records
          </CardTitle>
          <CardDescription>
            Control whether your daily entries are saved to the database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-4 space-y-6">
            <div className="flex items-center justify-center space-x-4 w-full max-w-md">
              <Label htmlFor="database-toggle" className="text-lg font-medium text-muted-foreground">Off</Label>
              <Switch 
                id="database-toggle" 
                className="scale-150 data-[state=checked]:bg-green-500" 
                checked={recordsEnabled} 
                onCheckedChange={handleRecordsToggle} 
              />
              <Label htmlFor="database-toggle" className="text-lg font-medium text-muted-foreground">On</Label>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {recordsEnabled 
                ? "Database records are enabled. Your entries will be saved." 
                : "Database records are disabled. Your entries will not be saved."}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <NoteForm
        open={openNoteForm}
        onOpenChange={setOpenNoteForm}
        onSubmit={addNote}
      />

      <TaskForm
        open={openTaskForm}
        onOpenChange={setOpenTaskForm}
        onSubmit={addTask}
      />
    </div>
  );
};

export default NotesPage;
