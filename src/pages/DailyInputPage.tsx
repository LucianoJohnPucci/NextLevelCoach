
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import { format, startOfToday, subDays, addDays } from "date-fns";
import { Button } from "@/components/ui/button";

const DailyInputPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isToday, setIsToday] = useState(true);
  
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
