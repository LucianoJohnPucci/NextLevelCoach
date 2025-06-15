
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, Sparkles, Target, Plus } from "lucide-react";
import { toast } from "sonner";
import DailyChecklistDialog from "./DailyChecklistDialog";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
  icon: string;
}

interface DailyChecklistProps {
  recordsEnabled: boolean;
}

const DailyChecklist = ({ recordsEnabled }: DailyChecklistProps) => {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: "1",
      title: "Braindump your tasks, ideas, and notes",
      description: "Get everything out of your head and onto paper or digital format",
      completed: false,
      category: "mind",
      icon: "brain"
    },
    {
      id: "2", 
      title: "Prioritize tasks and get AI feedback",
      description: "Use AI to help organize and prioritize your daily tasks",
      completed: false,
      category: "mind",
      icon: "brain"
    },
    {
      id: "3",
      title: "Mark completed items for AI optimization",
      description: "Track your progress to help AI learn your patterns",
      completed: false,
      category: "general",
      icon: "target"
    },
    {
      id: "4",
      title: "Review your progress and plan for tomorrow",
      description: "Reflect on achievements and set intentions for the next day",
      completed: false,
      category: "soul",
      icon: "sparkles"
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);

  // Load items from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dailyChecklistItems');
    if (saved) {
      try {
        const parsedItems = JSON.parse(saved);
        setItems(parsedItems);
      } catch (error) {
        console.error('Error loading checklist items:', error);
      }
    }
  }, []);

  // Save items to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('dailyChecklistItems', JSON.stringify(items));
  }, [items]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "brain": return <Brain className="h-4 w-4" />;
      case "heart": return <Heart className="h-4 w-4" />;
      case "sparkles": return <Sparkles className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "mind": return "bg-blue-100 text-blue-800";
      case "body": return "bg-green-100 text-green-800"; 
      case "soul": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));

    const item = items.find(i => i.id === id);
    if (item && recordsEnabled) {
      toast.success(
        item.completed ? "Item unmarked" : "Great job! Item completed", 
        {
          description: `${item.title} ${item.completed ? "unmarked" : "completed"}`,
        }
      );
    }
  };

  const addNewItem = (newItem: { title: string; description: string; category: string; icon: string }) => {
    const item: ChecklistItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      completed: false,
      category: newItem.category,
      icon: newItem.icon
    };
    
    setItems(prev => [...prev, item]);
    
    toast.success("New habit added to your daily routine!", {
      description: "Remember: Daily check-ins with modifications allow new habits to be BORN 🌱"
    });
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-right">
            <div className="text-2xl font-bold">{completedCount}/{totalCount}</div>
            <div className="text-sm text-muted-foreground">{Math.round(progressPercentage)}% Complete</div>
          </div>
        </div>
        
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-start space-x-3 rounded-lg border p-4 transition-all duration-200 ${
              item.completed 
                ? 'bg-green-50 border-green-200 opacity-75' 
                : 'bg-background hover:bg-muted/50'
            }`}
          >
            <Checkbox
              id={item.id}
              checked={item.completed}
              onCheckedChange={() => toggleItem(item.id)}
              className="mt-1"
            />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded-full ${getCategoryColor(item.category)} bg-opacity-20`}>
                  {getIcon(item.icon)}
                </div>
                <label
                  htmlFor={item.id}
                  className={`font-medium cursor-pointer ${
                    item.completed ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {item.title}
                </label>
                {item.category !== "general" && (
                  <Badge variant="secondary" className={`text-xs ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </Badge>
                )}
              </div>
              <p className={`text-sm ${item.completed ? 'text-muted-foreground line-through' : 'text-muted-foreground'}`}>
                {item.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => console.log(`Navigate to ${item.title}`)}
            >
              Go
            </Button>
          </div>
        ))}

        <div className="pt-4 border-t">
          <Button 
            variant="outline" 
            className="w-full gap-2" 
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Go to inputs
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Add new habits to your daily routine. Daily check-ins with modifications allow new habits to be BORN! 🌱
          </p>
        </div>
      </CardContent>

      <DailyChecklistDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAddItem={addNewItem}
      />
    </>
  );
};

export default DailyChecklist;
