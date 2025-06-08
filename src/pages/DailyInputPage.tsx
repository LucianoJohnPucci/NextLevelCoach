import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Check, Save, Calendar, ArrowLeft, ArrowRight, Database } from "lucide-react";
import { format, parseISO, startOfToday, subDays, addDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import DailyChecklist from "@/components/daily/DailyChecklist";
import { Label } from "@/components/ui/label";

const DailyInputPage = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isToday, setIsToday] = useState(true);
  const [recordsEnabled, setRecordsEnabled] = useState(true);
  
  useEffect(() => {
    checkIfToday();
  }, [selectedDate]);
  
  const checkIfToday = () => {
    const today = startOfToday();
    setIsToday(
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
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
      
      {/* Daily Checklist Component */}
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
    </div>
  );
};

export default DailyInputPage;
