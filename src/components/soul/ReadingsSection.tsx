import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReadingItem from "./ReadingItem";
import { Book } from "lucide-react";
import { useSoulMetrics } from "@/services/soulMetricsService";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface Reading {
  title: string;
  author: string;
  duration: string;
  minutes: number;
  isFavorite?: boolean;
}

interface ReadingsSectionProps {
  readings: Reading[];
}

const ReadingsSection = ({ readings }: ReadingsSectionProps) => {
  const { user } = useAuth();
  const { reflectionMinutes, updateMetrics, todayMetrics } = useSoulMetrics();
  const [filter, setFilter] = useState<string>("all");
  const [readingsState, setReadingsState] = useState(readings);
  
  useEffect(() => {
    if (todayMetrics) {
      console.log("Updated reflection minutes:", todayMetrics.reflection_minutes);
    }
  }, [todayMetrics]);
  
  const handleAddReading = (reading: Reading) => {
    if (!user) {
      toast.error("Please log in to track your reflection time");
      return;
    }
    
    const minutes = reading.minutes;
    const newTotal = reflectionMinutes + minutes;
    
    updateMetrics({ reflection_minutes: newTotal });
    toast.success(`Added ${minutes} minutes of reflection from "${reading.title}"`);
  };
  
  const handleToggleFavorite = (index: number, isFavorite: boolean) => {
    const updatedReadings = [...readingsState];
    updatedReadings[index] = { ...updatedReadings[index], isFavorite };
    setReadingsState(updatedReadings);
  };
  
  const filteredReadings = filter === "all" 
    ? readingsState 
    : readingsState.filter(reading => reading.isFavorite);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-5 w-5" />
          Daily Reflections Favourites
        </CardTitle>
        <CardDescription>
          Select your favorite philosophical readings to track your daily reflections.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Select 
            defaultValue="all" 
            onValueChange={(value) => setFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reflections</SelectItem>
              <SelectItem value="favorites">Favourites</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            className="ml-auto"
          >
            Browse Library
          </Button>
        </div>
        <div className="space-y-4">
          {filteredReadings.map((reading, index) => (
            <ReadingItem 
              key={index}
              {...reading}
              index={index}
              onAdd={() => handleAddReading(reading)}
              onToggleFavorite={(isFavorite) => handleToggleFavorite(index, isFavorite)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadingsSection;
