
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Brain, BookOpen, PenLine, Timer, Play, Bookmark, ArrowRight, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import JournalEntryForm from "@/components/journal/JournalEntryForm";
import JournalEntryList from "@/components/journal/JournalEntryList";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  action, 
  delay 
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType; 
  action: string | React.ReactNode; 
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="h-full">
        <CardHeader>
          <div className="mb-2 rounded-lg bg-primary/10 p-2 w-fit text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" className="w-full">
            {typeof action === 'string' ? (
              <>
                {action} <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              action
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const MeditationSession = ({ 
  title, 
  duration, 
  description,
  index
}: { 
  title: string; 
  duration: string; 
  description: string;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="flex justify-between rounded-lg border bg-card p-4 shadow-sm"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{title}</h3>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
            {duration}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost">
          <Bookmark className="h-4 w-4" />
        </Button>
        <Button size="icon">
          <Play className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

const JournalPrompt = ({ 
  prompt, 
  index 
}: { 
  prompt: string; 
  index: number;
}) => {
  const [isWriting, setIsWriting] = useState(false);
  const [showEntries, setShowEntries] = useState(false);
  const { user } = useAuth();

  const handleWriteClick = () => {
    if (!user) {
      toast.error("You must be logged in to write a journal entry", {
        description: "Please sign in to save your journal entries."
      });
      return;
    }
    setIsWriting(true);
    setShowEntries(false);
  };

  const handleViewEntriesClick = () => {
    if (!user) {
      toast.error("You must be logged in to view your journal entries", {
        description: "Please sign in to view your saved entries."
      });
      return;
    }
    setShowEntries(true);
    setIsWriting(false);
  };

  const handleClose = () => {
    setIsWriting(false);
    setShowEntries(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="rounded-lg border bg-card p-4 shadow-sm"
    >
      {!isWriting && !showEntries ? (
        <div className="flex items-start justify-between">
          <p className="text-sm">{prompt}</p>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="ghost" 
              className="mt-1"
              onClick={handleViewEntriesClick}
            >
              <BookOpen className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="mt-1"
              onClick={handleWriteClick}
            >
              <PenLine className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : isWriting ? (
        <JournalEntryForm prompt={prompt} onClose={handleClose} />
      ) : showEntries ? (
        <div>
          <div className="mb-4 flex justify-between">
            <h3 className="text-lg font-medium">Journal Entries</h3>
            <Button size="sm" variant="ghost" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <JournalEntryList prompt={prompt} />
        </div>
      ) : null}
    </motion.div>
  );
};

const MindPage = () => {
  const meditations = [
    {
      title: "Morning Mindfulness",
      duration: "10 min",
      description: "Start your day with clarity and focus."
    },
    {
      title: "Stress Relief",
      duration: "15 min",
      description: "Release tension and find calm."
    },
    {
      title: "Before Sleep",
      duration: "20 min",
      description: "Prepare your mind for restful sleep."
    },
    {
      title: "Quick Reset",
      duration: "5 min",
      description: "Regain focus during a busy day."
    }
  ];
  
  const journalPrompts = [
    "What are three things you're grateful for today?",
    "Describe a challenge you're facing and how you might approach it with wisdom.",
    "What brought you joy today, and why?",
    "Reflect on a recent interaction that affected you. What did you learn?",
    "What are you looking forward to, and how can you prepare for it?"
  ];
  
  return (
    <div className="space-y-6">
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Mind</h1>
        <p className="text-muted-foreground">
          Tools and exercises to nurture your mental wellbeing.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <FeatureCard
          title="Meditation"
          description="Guided sessions to help you find focus and calm."
          icon={Brain}
          action="Explore Sessions"
          delay={0.1}
        />
        <FeatureCard
          title="Journaling"
          description="Reflect on your thoughts with guided prompts."
          icon={PenLine}
          action={
            <Link to="/wisdom" className="w-full">
              Start Writing <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          }
          delay={0.2}
        />
        <FeatureCard
          title="Reading"
          description="Stoic texts and philosophical insights."
          icon={BookOpen}
          action="Browse Library"
          delay={0.3}
        />
      </div>
      
      <Tabs defaultValue="meditation" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="meditation">
            <Brain className="mr-2 h-4 w-4" />
            Meditation
          </TabsTrigger>
          <TabsTrigger value="journal">
            <PenLine className="mr-2 h-4 w-4" />
            Journal Prompts
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="meditation" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Meditation Sessions
              </CardTitle>
              <CardDescription>
                Guided practices to improve focus and reduce stress.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meditations.map((meditation, index) => (
                  <MeditationSession 
                    key={index}
                    title={meditation.title}
                    duration={meditation.duration}
                    description={meditation.description}
                    index={index}
                  />
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Sessions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="journal" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenLine className="h-5 w-5" />
                Journal Prompts
              </CardTitle>
              <CardDescription>
                Thoughtful questions to inspire reflection and growth.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {journalPrompts.map((prompt, index) => (
                  <JournalPrompt 
                    key={index}
                    prompt={prompt}
                    index={index}
                  />
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                See More Prompts
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quote of the Day</CardTitle>
            <CardDescription>
              A thought to ponder and apply to your life.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-primary/5 p-6 text-center">
              <p className="mb-4 text-lg italic">
                "The mind that is anxious about future events is miserable."
              </p>
              <p className="font-medium">— Seneca</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MindPage;
