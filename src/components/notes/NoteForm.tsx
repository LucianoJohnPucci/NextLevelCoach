
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Brain, Heart, Sparkles } from "lucide-react";

interface NoteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (title: string, content: string, category: "mind" | "body" | "soul") => void;
}

const NoteForm = ({ open, onOpenChange, onSubmit }: NoteFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"mind" | "body" | "soul">("mind");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim() && content.trim()) {
      onSubmit(title, content, category);
      resetForm();
      onOpenChange(false);
    }
  };
  
  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory("mind");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
          <DialogDescription>
            Add a new note to capture your thoughts, insights, and reflections.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your note"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note here..."
                className="min-h-[120px]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Category</Label>
              <RadioGroup 
                value={category}
                onValueChange={(value) => setCategory(value as "mind" | "body" | "soul")}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mind" id="category-mind" />
                  <Label htmlFor="category-mind" className="flex items-center cursor-pointer">
                    <Brain className="mr-2 h-4 w-4 text-primary" /> Mind
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="body" id="category-body" />
                  <Label htmlFor="category-body" className="flex items-center cursor-pointer">
                    <Heart className="mr-2 h-4 w-4 text-primary" /> Body
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="soul" id="category-soul" />
                  <Label htmlFor="category-soul" className="flex items-center cursor-pointer">
                    <Sparkles className="mr-2 h-4 w-4 text-primary" /> Soul
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Note</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NoteForm;
