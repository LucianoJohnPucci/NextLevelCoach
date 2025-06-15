
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ChecklistItem } from "./types";

export const useDailyChecklist = (recordsEnabled: boolean) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);

  // Initialize default items
  const defaultItems: ChecklistItem[] = [
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
  ];

  // Load items from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dailyChecklistItems');
    if (saved) {
      try {
        const parsedItems = JSON.parse(saved);
        // Validate that parsed items have the correct structure
        if (Array.isArray(parsedItems) && parsedItems.length > 0) {
          setItems(parsedItems);
        } else {
          // If no valid saved items, use default items
          setItems(defaultItems);
          localStorage.setItem('dailyChecklistItems', JSON.stringify(defaultItems));
        }
      } catch (error) {
        console.error('Error loading checklist items:', error);
        // If error parsing, use default items
        setItems(defaultItems);
        localStorage.setItem('dailyChecklistItems', JSON.stringify(defaultItems));
      }
    } else {
      // If no saved items, use default items
      setItems(defaultItems);
      localStorage.setItem('dailyChecklistItems', JSON.stringify(defaultItems));
    }
  }, []);

  // Save items to localStorage and trigger custom event whenever items change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('dailyChecklistItems', JSON.stringify(items));
      // Dispatch custom event to notify other components about checklist updates
      window.dispatchEvent(new CustomEvent('checklistUpdated'));
    }
  }, [items]);

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

  return {
    items,
    toggleItem,
    addNewItem
  };
};
