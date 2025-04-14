
import { motion } from "framer-motion";
import { Flag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

export interface WorkoutItemProps {
  title: string;
  category: string;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  favorite: boolean;
  index: number;
  onAdd: () => void;
  onToggleFavorite: () => void;
}

export const WorkoutItem = ({
  title,
  category,
  duration,
  difficulty,
  favorite,
  index,
  onAdd,
  onToggleFavorite
}: WorkoutItemProps) => {
  const getMinutes = () => {
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 0;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="flex justify-between rounded-lg border bg-card p-4 shadow-sm"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{title}</h3>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
            {duration}
          </span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <span>{category}</span>
          <span className="mx-2">•</span>
          <span className={`
            ${difficulty === "Easy" ? "text-green-500" : 
              difficulty === "Medium" ? "text-yellow-500" : 
              "text-red-500"}
          `}>
            {difficulty}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Toggle 
          pressed={favorite} 
          onPressedChange={onToggleFavorite}
          size="sm"
          className="data-[state=on]:text-amber-500"
        >
          <Flag className={`h-4 w-4 ${favorite ? 'fill-amber-500' : ''}`} />
        </Toggle>
        <Button size="default" className="flex items-center gap-2" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>
    </motion.div>
  );
};

export default WorkoutItem;
