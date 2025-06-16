
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bed, Moon, Clock, Brain } from "lucide-react";
import { toast } from "sonner";
import { useSleepTracking } from "@/hooks/useSleepTracking";
import { useAuth } from "@/components/AuthProvider";

const SleepTracker = () => {
  const [bedTime, setBedTime] = useState("");
  const [sleepDuration, setSleepDuration] = useState([7.5]);
  const [sleepQuality, setSleepQuality] = useState([3]);
  const [interrupted, setInterrupted] = useState(false);
  const [interruptionCause, setInterruptionCause] = useState("");
  const [dreamRecall, setDreamRecall] = useState(false);
  const [dreamNotes, setDreamNotes] = useState("");
  const [sleepOnsetTime, setSleepOnsetTime] = useState("");
  const [wakeFeelings, setWakeFeelings] = useState([3]);
  const [additionalNotes, setAdditionalNotes] = useState("");

  const { addSleepEntry } = useSleepTracking();
  const { user } = useAuth();

  const sleepQualityEmojis = ["😴", "💤", "🥱", "😐", "😵"];
  const sleepQualityLabels = ["Poor", "Below Average", "Average", "Good", "Excellent"];
  
  const wakeFeelingsEmojis = ["😣", "😞", "😐", "🙂", "😃"];
  const wakeFeelingsLabels = ["Terrible", "Poor", "Okay", "Good", "Excellent"];

  const interruptionCauses = [
    "Bathroom", "Noise", "Anxiety", "Pain/Discomfort", "Hot/Cold", 
    "Partner/Pet", "Dreams/Nightmares", "Technology", "Other"
  ];

  const handleSaveSleepEntry = async () => {
    if (!user) {
      toast.error("Please sign in to save sleep entries");
      return;
    }

    const sleepEntry = {
      date: new Date().toISOString().split('T')[0], // Today's date
      bedtime: bedTime || undefined,
      sleep_duration: sleepDuration[0],
      sleep_quality: sleepQuality[0],
      interrupted,
      interruption_cause: interrupted ? interruptionCause : undefined,
      dream_recall: dreamRecall,
      dream_notes: dreamRecall ? dreamNotes : undefined,
      sleep_onset_time: sleepOnsetTime || undefined,
      wake_feelings: wakeFeelings[0],
      additional_notes: additionalNotes || undefined
    };

    const success = await addSleepEntry(sleepEntry);
    
    if (success) {
      toast.success("Sleep entry saved successfully!", {
        description: `Logged ${sleepDuration[0]} hours of ${sleepQualityLabels[sleepQuality[0] - 1].toLowerCase()} sleep`,
        icon: <Moon className="h-4 w-4" />,
      });
      resetForm();
    } else {
      toast.error("Failed to save sleep entry. Please try again.");
    }
  };

  const resetForm = () => {
    setBedTime("");
    setSleepDuration([7.5]);
    setSleepQuality([3]);
    setInterrupted(false);
    setInterruptionCause("");
    setDreamRecall(false);
    setDreamNotes("");
    setSleepOnsetTime("");
    setWakeFeelings([3]);
    setAdditionalNotes("");
  };

  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bed className="h-5 w-5 text-primary" />
          Sleep Tracker
        </CardTitle>
        <CardDescription>
          Track your sleep patterns and quality for better rest insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bedtime Only */}
        <div className="space-y-2">
          <Label htmlFor="bedTime" className="flex items-center gap-2">
            <Moon className="h-4 w-4" /> Bedtime
          </Label>
          <Input
            id="bedTime"
            type="time"
            value={bedTime}
            onChange={(e) => setBedTime(e.target.value)}
          />
        </div>

        {/* Sleep Duration */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> Sleep Duration: {sleepDuration[0]} hours
          </Label>
          <Slider
            value={sleepDuration}
            onValueChange={setSleepDuration}
            max={12}
            min={2}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>2h</span>
            <span>7h</span>
            <span>12h</span>
          </div>
        </div>

        {/* Sleep Quality */}
        <div className="space-y-3">
          <Label>Sleep Quality</Label>
          <div className="flex items-center justify-center space-x-2 p-4 bg-muted/20 rounded-lg">
            {sleepQualityEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => setSleepQuality([index + 1])}
                className={`text-3xl p-2 rounded-full transition-all ${
                  sleepQuality[0] === index + 1 
                    ? 'bg-primary/20 scale-110 shadow-lg' 
                    : 'hover:bg-muted/40 hover:scale-105'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="text-center">
            <Badge variant="secondary">
              {sleepQualityLabels[sleepQuality[0] - 1]}
            </Badge>
          </div>
        </div>

        {/* Sleep Interruptions */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="interrupted"
              checked={interrupted}
              onCheckedChange={setInterrupted}
            />
            <Label htmlFor="interrupted">Sleep was interrupted</Label>
          </div>
          
          {interrupted && (
            <div className="space-y-2">
              <Label>What caused the interruption?</Label>
              <Select value={interruptionCause} onValueChange={setInterruptionCause}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a cause" />
                </SelectTrigger>
                <SelectContent>
                  {interruptionCauses.map((cause) => (
                    <SelectItem key={cause} value={cause.toLowerCase()}>
                      {cause}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Dream Recall */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="dreamRecall"
              checked={dreamRecall}
              onCheckedChange={setDreamRecall}
            />
            <Label htmlFor="dreamRecall" className="flex items-center gap-2">
              <Brain className="h-4 w-4" /> I remember my dreams
            </Label>
          </div>
          
          {dreamRecall && (
            <div className="space-y-2">
              <Label>Dream Notes</Label>
              <Textarea
                value={dreamNotes}
                onChange={(e) => setDreamNotes(e.target.value)}
                placeholder="Describe what you remember about your dreams..."
                className="min-h-[80px]"
              />
            </div>
          )}
        </div>

        {/* Sleep Onset Time */}
        <div className="space-y-2">
          <Label>How long did it take to fall asleep?</Label>
          <Select value={sleepOnsetTime} onValueChange={setSleepOnsetTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select time to fall asleep" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<10">Less than 10 minutes</SelectItem>
              <SelectItem value="10-30">10-30 minutes</SelectItem>
              <SelectItem value="30-60">30-60 minutes</SelectItem>
              <SelectItem value=">60">More than 60 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Wake Feelings */}
        <div className="space-y-3">
          <Label>How did you feel when you woke up?</Label>
          <div className="flex items-center justify-center space-x-2 p-4 bg-muted/20 rounded-lg">
            {wakeFeelingsEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => setWakeFeelings([index + 1])}
                className={`text-3xl p-2 rounded-full transition-all ${
                  wakeFeelings[0] === index + 1 
                    ? 'bg-primary/20 scale-110 shadow-lg' 
                    : 'hover:bg-muted/40 hover:scale-105'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="text-center">
            <Badge variant="secondary">
              {wakeFeelingsLabels[wakeFeelings[0] - 1]}
            </Badge>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="space-y-2">
          <Label>Additional Notes (Optional)</Label>
          <Textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Any other observations about your sleep..."
            className="min-h-[80px]"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button onClick={handleSaveSleepEntry} className="w-full md:w-auto">
            <Bed className="mr-2 h-4 w-4" />
            Save Sleep Entry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepTracker;
