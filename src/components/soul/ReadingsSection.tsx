
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReadingItem from "./ReadingItem";
import { Book } from "lucide-react";

interface Reading {
  title: string;
  author: string;
  duration: string;
}

interface ReadingsSectionProps {
  readings: Reading[];
}

const ReadingsSection = ({ readings }: ReadingsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-5 w-5" />
          Philosophical Readings
        </CardTitle>
        <CardDescription>
          Explore stoic texts and philosophical wisdom.
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
              index={index}
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
