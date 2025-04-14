
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReadingItem from "./ReadingItem";
import { Book, Plus } from "lucide-react";
import { useSoulMetrics } from "@/services/soulMetricsService";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { useState } from "react";

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
  const { reflectionMinutes, updateMetrics } = useSoulMetrics();
  const [filter, setFilter] = useState<string>("all");
  
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
  
  const filteredReadings = filter === "all" 
    ? readings 
    : readings.filter(reading => reading.isFavorite);
  
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
        <div className="mb-4">
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
        </div>
        <div className="space-y-4">
          {filteredReadings.map((reading, index) => (
            <ReadingItem 
              key={index}
              title={reading.title}
              author={reading.author}
              duration={reading.duration}
              minutes={reading.minutes}
              index={index}
              onAdd={() => handleAddReading(reading)}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Browse Library
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReadingsSection;
