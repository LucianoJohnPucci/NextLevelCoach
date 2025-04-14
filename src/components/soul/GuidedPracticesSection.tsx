
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GuidedPracticeItem from "./GuidedPractice";
import { Music } from "lucide-react";

const GuidedPracticesSection = () => {
  const practices = [
    {
      title: "Gratitude Meditation",
      duration: "10 minutes"
    },
    {
      title: "Inner Peace",
      duration: "15 minutes"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Guided Practices
        </CardTitle>
        <CardDescription>
          Soul-nourishing audio guides.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {practices.map((practice, index) => (
          <GuidedPracticeItem
            key={index}
            title={practice.title}
            duration={practice.duration}
          />
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          See All Guides
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GuidedPracticesSection;
