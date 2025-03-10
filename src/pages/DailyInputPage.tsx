
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Check, Save, Smile, Frown, Meh } from "lucide-react";

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

const DailyInputPage = () => {
  const [mood, setMood] = useState<number[]>([5]);
  const [energy, setEnergy] = useState<number[]>([5]);
  const [accomplishments, setAccomplishments] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [challenges, setChallenges] = useState("");
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  
  const toggleEmotion = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter(e => e !== emotion));
    } else {
      setSelectedEmotions([...selectedEmotions, emotion]);
    }
  };
  
  const handleSubmit = () => {
    console.log({
      date: new Date().toISOString(),
      mood: mood[0],
      energy: energy[0],
      emotions: selectedEmotions,
      accomplishments,
      gratitude,
      challenges
    });
    
    toast.success("Daily input saved successfully", {
      description: "Your daily reflection has been recorded.",
      icon: <Check className="h-4 w-4" />,
    });
  };
  
  const emotions = [
    { icon: Smile, label: "Happy" },
    { icon: Meh, label: "Content" },
    { icon: Frown, label: "Sad" },
    { icon: Smile, label: "Excited" },
    { icon: Meh, label: "Neutral" },
    { icon: Frown, label: "Anxious" },
  ];
  
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
      
      <Tabs defaultValue="mood" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mood">Mood & Energy</TabsTrigger>
          <TabsTrigger value="emotions">Emotions</TabsTrigger>
          <TabsTrigger value="accomplishments">Accomplishments</TabsTrigger>
          <TabsTrigger value="reflections">Reflections</TabsTrigger>
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
        
        <TabsContent value="accomplishments" className="mt-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Accomplishments</CardTitle>
                <CardDescription>
                  What did you accomplish today, big or small?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Today I..."
                  className="min-h-[200px] resize-none"
                  value={accomplishments}
                  onChange={(e) => setAccomplishments(e.target.value)}
                />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="reflections" className="mt-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Gratitude</CardTitle>
                <CardDescription>
                  What are you grateful for today?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="I'm grateful for..."
                  className="min-h-[120px] resize-none"
                  value={gratitude}
                  onChange={(e) => setGratitude(e.target.value)}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Challenges</CardTitle>
                <CardDescription>
                  What challenges did you face today?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Today I found it difficult to..."
                  className="min-h-[120px] resize-none"
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleSubmit} size="lg" className="gap-2">
          <Save className="h-4 w-4" />
          Save Today's Entry
        </Button>
      </div>
    </div>
  );
};

export default DailyInputPage;
