
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, PenTool, Smile, Frown, Meh } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";

const EmotionButton = ({ 
  icon: Icon, 
  label, 
  selected, 
  onClick 
}: { 
  icon: React.ElementType;
  label: string; 
  selected: boolean; 
  onClick: () => void; 
}) => (
  <Button 
    type="button" 
    variant={selected ? "default" : "outline"} 
    className={`flex h-full min-h-[80px] w-full flex-col gap-2 transition-all ${selected ? 'scale-105' : ''}`}
    onClick={onClick}
  >
    <Icon className={`h-6 w-6 ${selected ? 'animate-scale-in' : ''}`} />
    <span className="text-sm">{label}</span>
  </Button>
);

const MindPage = () => {
  const { user } = useAuth();
  const [readCount, setReadCount] = useState(0);
  const [learnCount, setLearnCount] = useState(0);
  const [journalCount, setJournalCount] = useState(0);
  
  // Mood and emotions state
  const [mood, setMood] = useState<number[]>([5]);
  const [energy, setEnergy] = useState<number[]>([5]);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const emotions = [
    { icon: Smile, label: "Happy" },
    { icon: Meh, label: "Content" },
    { icon: Frown, label: "Sad" },
    { icon: Smile, label: "Excited" },
    { icon: Meh, label: "Neutral" },
    { icon: Frown, label: "Anxious" },
  ];

  useEffect(() => {
    if (user) {
      fetchTodayEntry();
    }
  }, [user]);

  const fetchTodayEntry = async () => {
    if (!user) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_entries')
        .select('mood, energy, emotions')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setMood([data.mood]);
        setEnergy([data.energy]);
        setSelectedEmotions(data.emotions || []);
      }
    } catch (error) {
      console.error('Error fetching daily entry:', error);
    }
  };

  const toggleEmotion = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter(e => e !== emotion));
    } else {
      setSelectedEmotions([...selectedEmotions, emotion]);
    }
  };

  const handleSaveMoodData = async () => {
    if (!user) {
      toast.error('Authentication required', {
        description: 'Please log in to save your mood data.'
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const entryData = {
        user_id: user.id,
        date: today,
        mood: mood[0],
        energy: energy[0],
        emotions: selectedEmotions,
        updated_at: new Date().toISOString()
      };
      
      // Try to update first (in case entry already exists)
      const { data: updateData, error: updateError } = await supabase
        .from('daily_entries')
        .update(entryData)
        .eq('user_id', user.id)
        .eq('date', today);
      
      // If no rows were affected by update, insert a new entry
      if (updateError || (updateData === null)) {
        const { error: insertError } = await supabase
          .from('daily_entries')
          .insert([{
            ...entryData,
            gratitude: '',
            challenges: ''
          }]);
        
        if (insertError) throw insertError;
      }
      
      toast.success("Mood and energy saved successfully", {
        description: "Your daily mood tracking has been recorded.",
      });
    } catch (error) {
      console.error('Error saving mood data:', error);
      toast.error('Failed to save mood data', {
        description: 'There was a problem saving your mood and energy data.'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleReadClick = () => {
    const newCount = readCount + 1;
    setReadCount(newCount);
    if (user) {
      toast.success("Reading session recorded!");
    } else {
      toast.error("Please log in to save your progress");
    }
  };
  
  const handleLearnClick = () => {
    const newCount = learnCount + 1;
    setLearnCount(newCount);
    if (user) {
      toast.success("Learning session recorded!");
    } else {
      toast.error("Please log in to save your progress");
    }
  };
  
  const handleJournalClick = () => {
    const newCount = journalCount + 1;
    setJournalCount(newCount);
    if (user) {
      toast.success("Journal entry recorded!");
    } else {
      toast.error("Please log in to save your progress");
    }
  };
  
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
          Daily check-ins for mental growth and learning.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow" onClick={handleReadClick}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-fit rounded-lg bg-blue-100 p-3 text-blue-600">
                <BookOpen className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Read</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {readCount}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Reading sessions today
              </p>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReadClick();
                }}
              >
                + Add Reading
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow" onClick={handleLearnClick}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-fit rounded-lg bg-green-100 p-3 text-green-600">
                <GraduationCap className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Learned</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {learnCount}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Learning sessions today
              </p>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLearnClick();
                }}
              >
                + Add Learning
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow" onClick={handleJournalClick}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-fit rounded-lg bg-purple-100 p-3 text-purple-600">
                <PenTool className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Journal</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {journalCount}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Journal entries today
              </p>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleJournalClick();
                }}
              >
                + Add Entry
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <motion.div
        className="max-w-2xl mx-auto text-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="rounded-lg bg-primary/5 p-6">
          <h3 className="text-lg font-semibold mb-2">Today's Mind Progress</h3>
          <p className="text-muted-foreground">
            Keep nurturing your mental growth through daily reading, learning, and journaling.
          </p>
        </div>
      </motion.div>

      {/* Mood & Energy Section */}
      <motion.div
        className="max-w-4xl mx-auto mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="space-y-2 mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Daily Mood & Energy</h2>
          <p className="text-muted-foreground">
            Track your mental state and energy levels throughout the day.
          </p>
        </div>

        <Tabs defaultValue="mood" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mood" className="px-2 py-2 text-sm">Mood & Energy</TabsTrigger>
            <TabsTrigger value="emotions" className="px-2 py-2 text-sm">Emotions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mood" className="mt-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 md:grid-cols-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Mood</CardTitle>
                  <CardDescription>
                    How are you feeling today overall?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Slider
                      value={mood}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={setMood}
                      className="py-4"
                    />
                    <div className="flex justify-between text-sm">
                      <span>Low</span>
                      <span className="font-medium">{mood[0]}/10</span>
                      <span>High</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Energy</CardTitle>
                  <CardDescription>
                    What's your energy level right now?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Slider
                      value={energy}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={setEnergy}
                      className="py-4"
                    />
                    <div className="flex justify-between text-sm">
                      <span>Low</span>
                      <span className="font-medium">{energy[0]}/10</span>
                      <span>High</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="emotions" className="mt-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Emotions</CardTitle>
                  <CardDescription>
                    Select the emotions you've experienced today.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
                    {emotions.map((emotion, index) => (
                      <EmotionButton 
                        key={index}
                        icon={emotion.icon} 
                        label={emotion.label} 
                        selected={selectedEmotions.includes(emotion.label)} 
                        onClick={() => toggleEmotion(emotion.label)} 
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button 
            onClick={handleSaveMoodData} 
            size="lg" 
            className="gap-2"
            disabled={isSaving || !user}
          >
            {isSaving ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Mood Data
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default MindPage;
