
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Target, Heart, Brain, Sparkles } from "lucide-react";

interface DailyChecklistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (item: { title: string; description: string; category: string; icon: string }) => void;
}

const DailyChecklistDialog = ({ open, onOpenChange, onAddItem }: DailyChecklistDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const suggestions = [
    { title: "Morning Meditation", description: "Start your day with 10 minutes of mindfulness", category: "mind", icon: "brain" },
    { title: "Gratitude Journal", description: "Write down 3 things you're grateful for", category: "soul", icon: "sparkles" },
    { title: "Daily Exercise", description: "Get your body moving for at least 30 minutes", category: "body", icon: "heart" },
    { title: "Read for Learning", description: "Spend 20 minutes reading something educational", category: "mind", icon: "brain" },
    { title: "Hydration Check", description: "Drink at least 8 glasses of water", category: "body", icon: "heart" },
    { title: "Evening Reflection", description: "Reflect on your day and plan for tomorrow", category: "soul", icon: "sparkles" },
    { title: "Skill Practice", description: "Practice a skill you want to develop", category: "mind", icon: "target" },
    { title: "Connect with Someone", description: "Reach out to a friend or family member", category: "soul", icon: "sparkles" },
  ];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "mind": return <Brain className="h-4 w-4" />;
      case "body": return <Heart className="h-4 w-4" />;
      case "soul": return <Sparkles className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    
    onAddItem({
      title: title.trim(),
      description: description.trim(),
      category: category || "general",
      icon: category === "mind" ? "brain" : category === "body" ? "heart" : category === "soul" ? "sparkles" : "target"
    });
    
    // Reset form
    setTitle("");
    setDescription("");
    setCategory("");
    onOpenChange(false);
  };

  const handleSuggestionClick = (suggestion: typeof suggestions[0]) => {
    setTitle(suggestion.title);
    setDescription(suggestion.description);
    setCategory(suggestion.category);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Create New Daily Habit
          </DialogTitle>
          <DialogDescription>
            Build your perfect daily routine! These daily check-ins with modifications allow new habits to be BORN. 
            Choose from suggestions below or create your own custom habit.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Suggestions */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Quick Suggestions</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-3 text-left justify-start"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-start gap-2 w-full">
                    {getCategoryIcon(suggestion.category)}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{suggestion.title}</div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {suggestion.description}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Input Form */}
          <div className="border-t pt-4">
            <Label className="text-sm font-medium mb-3 block">Or Create Your Own</Label>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Habit Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Morning stretching routine"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this habit involves..."
                  className="resize-none"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mind">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Mind
                      </div>
                    </SelectItem>
                    <SelectItem value="body">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Body
                      </div>
                    </SelectItem>
                    <SelectItem value="soul">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Soul
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Preview */}
          {title && (
            <div className="border rounded-lg p-3 bg-muted/50">
              <Label className="text-sm font-medium mb-2 block">Preview</Label>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {getCategoryIcon(category)}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{title}</div>
                  {description && (
                    <div className="text-sm text-muted-foreground mt-1">{description}</div>
                  )}
                </div>
                {category && (
                  <Badge variant="secondary" className="capitalize">
                    {category}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            Add to Daily Routine
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DailyChecklistDialog;
