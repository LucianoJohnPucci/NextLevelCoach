import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Moon, Sun, Clock, Heart, Brain, Zap } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useSleepTracking } from "@/hooks/useSleepTracking";

const SleepTracker = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [bedtime, setBedtime] = useState("22:00");
  const [wakeUpTime, setWakeUpTime] = useState("06:00");
  const [sleepQuality, setSleepQuality] = useState("good");
  const [notes, setNotes] = useState("");
  const [isNightMode, setIsNightMode] = useState(false);
  const { user } = useAuth();
  const { sleepData, addSleepEntry, updateSleepEntry, deleteSleepEntry, isLoading, error } = useSleepTracking();

  useEffect(() => {
    if (sleepData && date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      const entryForDate = sleepData.find(entry => format(new Date(entry.date), "yyyy-MM-dd") === formattedDate);

      if (entryForDate) {
        setBedtime(entryForDate.bedtime);
        setWakeUpTime(entryForDate.wake_up_time);
        setSleepQuality(entryForDate.sleep_quality);
        setNotes(entryForDate.notes || "");
      } else {
        // Reset form if no entry for the selected date
        setBedtime("22:00");
        setWakeUpTime("06:00");
        setSleepQuality("good");
        setNotes("");
      }
    }
  }, [sleepData, date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      console.error("Date is required");
      return;
    }

    const formattedDate = format(date, "yyyy-MM-dd");

    const newEntry = {
      date: formattedDate,
      bedtime,
      wake_up_time: wakeUpTime,
      sleep_quality: sleepQuality,
      notes,
    };

    if (sleepData && sleepData.some(entry => format(new Date(entry.date), "yyyy-MM-dd") === formattedDate)) {
      // Update existing entry
      const existingEntry = sleepData.find(entry => format(new Date(entry.date), "yyyy-MM-dd") === formattedDate);
      if (existingEntry) {
        await updateSleepEntry(existingEntry.id, newEntry);
      }
    } else {
      // Add new entry
      await addSleepEntry(newEntry);
    }
  };

  const handleDelete = async () => {
    if (!date) {
      console.error("Date is required");
      return;
    }

    const formattedDate = format(date, "yyyy-MM-dd");
    const existingEntry = sleepData && sleepData.find(entry => format(new Date(entry.date), "yyyy-MM-dd") === formattedDate);

    if (existingEntry) {
      await deleteSleepEntry(existingEntry.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Sleep Tracker
          </CardTitle>
          <CardDescription>
            Log your sleep schedule and quality to track your sleep patterns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) =>
                      date > new Date() || date < new Date("2023-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="bedtime">Bedtime</Label>
              <Input
                type="time"
                id="bedtime"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="wakeUpTime">Wake-up Time</Label>
              <Input
                type="time"
                id="wakeUpTime"
                value={wakeUpTime}
                onChange={(e) => setWakeUpTime(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="sleepQuality">Sleep Quality</Label>
              <Select value={sleepQuality} onValueChange={setSleepQuality}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any notes about your sleep?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <Button type="submit">Save</Button>
              <Button type="button" variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SleepTracker;
