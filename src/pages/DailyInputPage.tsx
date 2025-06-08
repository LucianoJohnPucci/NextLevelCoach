import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Check, Save, Smile, Frown, Meh, Calendar, ArrowLeft, ArrowRight, Database } from "lucide-react";
import { format, parseISO, startOfToday, subDays, addDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import DailyChecklist from "@/components/daily/DailyChecklist";
import { Label } from "@/components/ui/label";

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

interface DailyEntry {
  id: string;
  date: string;
  mood: number;
  energy: number;
  emotions: string[];
  gratitude: string | null;
  challenges: string | null;
}

const defaultEntry = {
  mood: [5],
  energy: [5],
  emotions: [] as string[],
  gratitude: "",
  challenges: ""
};

const DailyInputPage = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isToday, setIsToday] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [recordsEnabled, setRecordsEnabled] = useState(true);
  
  const [mood, setMood] = useState<number[]>([5]);
  const [energy, setEnergy] = useState<number[]>([5]);
  const [gratitude, setGratitude] = useState("");
  const [challenges, setChallenges] = useState("");
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  
  useEffect(() => {
    checkIfToday();
  }, [selectedDate]);
  
  useEffect(() => {
    if (user) {
      fetchEntryForDate();
    }
  }, [selectedDate, user]);
  
  const checkIfToday = () => {
    const today = startOfToday();
    setIsToday(
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };
  
  const fetchEntryForDate = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const dateString = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      
      const { data, error } = await supabase
        .from('daily_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', dateString)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        // Entry exists for this date
        setMood([data.mood]);
        setEnergy([data.energy]);
        setSelectedEmotions(data.emotions || []);
        setGratitude(data.gratitude || '');
        setChallenges(data.challenges || '');
      } else {
        // No entry for this date, reset to defaults
        resetForm();
      }
    } catch (error) {
      console.error('Error fetching daily entry:', error);
      toast.error('Failed to load entry', {
        description: 'There was a problem loading your entry for this date.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setMood(defaultEntry.mood);
    setEnergy(defaultEntry.energy);
    setSelectedEmotions(defaultEntry.emotions);
    setGratitude(defaultEntry.gratitude);
    setChallenges(defaultEntry.challenges);
  };
  
  const navigateDate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedDate(prevDate => subDays(prevDate, 1));
    } else {
      const tomorrow = addDays(new Date(), 1);
      const today = new Date();
      
      // Don't allow navigation to future dates
      if (selectedDate.getDate() === today.getDate() &&
          selectedDate.getMonth() === today.getMonth() &&
          selectedDate.getFullYear() === today.getFullYear()) {
        return;
      }
      
      setSelectedDate(prevDate => addDays(prevDate, 1));
    }
  };
  
  const toggleEmotion = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter(e => e !== emotion));
    } else {
      setSelectedEmotions([...selectedEmotions, emotion]);
    }
  };
  
  const handleSubmit = async () => {
    if (!user) {
      toast.error('Authentication required', {
        description: 'Please log in to save your entry.'
      });
      return;
    }
    
    if (!recordsEnabled) {
      toast('Records keeping is disabled', {
        description: 'Enable database records to save your entries.',
        icon: <Database className="h-4 w-4" />,
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const dateString = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      
      const entryData = {
        user_id: user.id,
        date: dateString,
        mood: mood[0],
        energy: energy[0],
        emotions: selectedEmotions,
        gratitude,
        challenges,
        updated_at: new Date().toISOString()
      };
      
      // Try to update first (in case entry already exists)
      const { data: updateData, error: updateError } = await supabase
        .from('daily_entries')
        .update(entryData)
        .eq('user_id', user.id)
        .eq('date', dateString);
      
      // If no rows were affected by update, insert a new entry
      if (updateError || (updateData === null)) {
        const { error: insertError } = await supabase
          .from('daily_entries')
          .insert([entryData]);
        
        if (insertError) throw insertError;
      }
      
      toast.success("Daily input saved successfully", {
        description: "Your daily reflection has been recorded.",
        icon: <Check className="h-4 w-4" />,
      });
    } catch (error) {
      console.error('Error saving daily entry:', error);
      toast.error('Failed to save entry', {
        description: 'There was a problem saving your entry.'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const emotions = [
    { icon: Smile, label: "Happy" },
    { icon: Meh, label: "Content" },
    { icon: Frown, label: "Sad" },
    { icon: Smile, label: "Excited" },
    { icon: Meh, label: "Neutral" },
    { icon: Frown, label: "Anxious" },
  ];

  const handleRecordsToggle = (enabled: boolean) => {
    setRecordsEnabled(enabled);
    toast(enabled ? 'Database records enabled' : 'Database records disabled', {
      description: enabled ? 'Your entries will be saved to the database.' : 'Your entries will not be saved to the database.',
      icon: <Database className="h-4 w-4" />,
    });
  };
  
  return (
    <div className="space-y-6">
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Daily Input</h1>
        <p className="text-muted-foreground">
          Track your well-being and reflect on your day.
        </p>
      </motion.div>
      
      {/* Records Keeping Toggle */}
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
      
      {/* New Daily Checklist Component */}
      <DailyChecklist recordsEnabled={recordsEnabled} />
      
      <div className="flex items-center justify-between border-b pb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateDate('prev')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">
            {format(selectedDate, "MMMM d, yyyy")}
            {isToday && " (Today)"}
          </span>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateDate('next')}
          disabled={isToday}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center text-muted-foreground">Loading entry data...</div>
        </div>
      ) : (
        <>
          <Tabs defaultValue="mood" className="w-full" id="daily-input-tabs">
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
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit} 
              size="lg" 
              className="gap-2"
              disabled={isSaving || !user || !recordsEnabled}
            >
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Entry
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default DailyInputPage;
