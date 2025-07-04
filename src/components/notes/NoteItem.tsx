
import { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Brain, Heart, Sparkles, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import { Note } from "@/pages/NotesPage";

interface NoteItemProps {
  note: Note;
  onDelete: (id: string) => void;
  hideCategory?: boolean;
}

const NoteItem = ({ note, onDelete, hideCategory = false }: NoteItemProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const getCategoryIcon = () => {
    switch (note.category) {
      case "mind":
        return <Brain className="h-4 w-4 text-primary" />;
      case "body":
        return <Heart className="h-4 w-4 text-primary" />;
      case "soul":
        return <Sparkles className="h-4 w-4 text-primary" />;
      default:
        return null;
    }
  };
  
  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{note.title}</TableCell>
        {!hideCategory && (
          <TableCell>
            <div className="flex items-center space-x-1">
              {getCategoryIcon()}
              <span className="capitalize">{note.category}</span>
            </div>
          </TableCell>
        )}
        <TableCell>{format(note.created_at, "MMM d, yyyy")}</TableCell>
        <TableCell>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowDetails(true)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(note.id)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <div className="flex items-center space-x-2">
              {getCategoryIcon()}
              <DialogTitle>{note.title}</DialogTitle>
            </div>
            <DialogDescription>
              {format(note.created_at, "MMMM d, yyyy")}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 whitespace-pre-wrap">{note.content}</div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NoteItem;
