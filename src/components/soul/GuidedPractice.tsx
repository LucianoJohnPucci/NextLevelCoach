
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface GuidedPracticeItemProps {
  title: string;
  duration: string;
}

const GuidedPracticeItem = ({
  title,
  duration
}: GuidedPracticeItemProps) => {
  return (
    <div className="flex justify-between rounded-lg border bg-card p-4 shadow-sm">
      <div className="space-y-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{duration}</p>
      </div>
      <Button size="icon">
        <Play className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default GuidedPracticeItem;
