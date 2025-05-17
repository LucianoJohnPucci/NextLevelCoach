
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Calendar, MessageSquare, ListCheck, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ChecklistItem {
  id: string;
  text: string;
  emoji: string;
  linkTo: string;
  icon: React.ElementType;
  completed: boolean;
}

const DailyChecklist = () => {
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

  const toggleCompleted = (id: string) => {
    setChecklistItems(
      checklistItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
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
