
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReadingItem from "./ReadingItem";
import { Book, Plus } from "lucide-react";
import { useSoulMetrics } from "@/services/soulMetricsService";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

interface Reading {
  title: string;
  author: string;
  duration: string;
  minutes: number;
}

interface ReadingsSectionProps {
  readings: Reading[];
}

const ReadingsSection = ({ readings }: ReadingsSectionProps) => {
  const { user } = useAuth();
  const { reflectionMinutes, updateMetrics } = useSoulMetrics();
  
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
        <div className="space-y-4">
          {readings.map((reading, index) => (
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
