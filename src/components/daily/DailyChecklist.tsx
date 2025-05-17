
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Calendar, MessageSquare, ListCheck, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

interface ChecklistItem {
  id: string;
  text: string;
  emoji: string;
  linkTo: string;
  icon: React.ElementType;
  completed: boolean;
}

interface DailyChecklistProps {
  recordsEnabled: boolean;
}

const DailyChecklist = ({ recordsEnabled }: DailyChecklistProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    {
      id: "braindump",
      text: "Braindump your tasks, ideas, and notes",
      emoji: "🧠",
      linkTo: "/notes",
      icon: BookOpen,
      completed: false,
    },
    {
      id: "prioritize",
      text: "Prioritize tasks and get AI feedback",
      emoji: "🤖",
      linkTo: "/wisdom",
      icon: MessageSquare,
      completed: false,
    },
    {
      id: "complete",
      text: "Mark completed items for AI optimization",
      emoji: "✅",
      linkTo: "/goals",
      icon: ListCheck,
      completed: false,
    },
    {
      id: "review",
      text: "Review your progress and plan for tomorrow",
      emoji: "📊",
      linkTo: "/dashboard",
      icon: Calendar,
      completed: false,
    },
  ]);

  // Fetch the checklist data from Supabase when the component mounts
  useEffect(() => {
    if (user && recordsEnabled) {
      fetchChecklistData();
    }
  }, [user, recordsEnabled]);

  // Save the checklist data to Supabase when the component unmounts or when window is closed
  useEffect(() => {
    // Save data when component unmounts
    return () => {
      if (user && recordsEnabled) {
        saveChecklistData();
      }
    };
  }, [user, recordsEnabled, checklistItems]);

  // Add event listener for beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user && recordsEnabled) {
        saveChecklistData();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user, recordsEnabled, checklistItems]);

  const fetchChecklistData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      const { data, error } = await supabase
        .from('daily_checklist_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        throw error;
      }
      
      if (data) {
        // Update the checklist items with the saved state
        setChecklistItems(prevItems => 
          prevItems.map(item => ({
            ...item,
            completed: data[`${item.id}_completed`] || false
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching checklist data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveChecklistData = async () => {
    if (!user || !recordsEnabled) return;
    
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      const checklistData = {
        user_id: user.id,
        date: today,
        braindump_completed: checklistItems.find(item => item.id === 'braindump')?.completed || false,
        prioritize_completed: checklistItems.find(item => item.id === 'prioritize')?.completed || false,
        complete_completed: checklistItems.find(item => item.id === 'complete')?.completed || false,
        review_completed: checklistItems.find(item => item.id === 'review')?.completed || false
      };
      
      // Check if a record already exists for today
      const { data, error: selectError } = await supabase
        .from('daily_checklist_tracking')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();
      
      if (selectError) throw selectError;
      
      if (data) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('daily_checklist_tracking')
          .update(checklistData)
          .eq('id', data.id);
        
        if (updateError) throw updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('daily_checklist_tracking')
          .insert([checklistData]);
        
        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error saving checklist data:', error);
    }
  };

  const toggleCompleted = (id: string) => {
    setChecklistItems(
      checklistItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
    
    // If database records are enabled, save immediately after toggling
    if (user && recordsEnabled) {
      saveChecklistData();
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">📋</span> Daily Process Checklist
        </CardTitle>
        <CardDescription>
          Complete these steps to stay on track with your wellness journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {checklistItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex items-start rounded-lg border p-4 ${
                item.completed ? "border-primary/20 bg-primary/5" : "border-border"
              }`}
            >
              <div className="flex h-5 w-5 items-center justify-center mr-4 mt-0.5">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => toggleCompleted(item.id)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">
                    {index + 1}. {item.text}
                  </span>
                  <span className="text-xl" role="img" aria-label="emoji">
                    {item.emoji}
                  </span>
                </div>
              </div>
              <Button asChild variant="ghost" size="sm" className="ml-auto">
                <Link to={item.linkTo} className="flex items-center gap-1">
                  <item.icon className="h-4 w-4" />
                  <span>Go</span>
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 rounded-lg bg-primary/5 p-4 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              <span className="font-medium">
                Complete your daily input below
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => document.getElementById("daily-input-tabs")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Calendar className="h-4 w-4" />
              <span>Go to inputs</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyChecklist;
