
import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface MealItemProps {
  title: string;
  description: string;
  time: string;
  calories: number;
  index: number;
  onAddCalories?: (calories: number) => void;
}

export const MealItem = ({ 
  title, 
  description, 
  time,
  calories,
  index,
  onAddCalories
}: MealItemProps) => {
  const [added, setAdded] = useState(false);

  const handleAddCalories = () => {
    if (onAddCalories && !added) {
      onAddCalories(calories);
      setAdded(true);
    }
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
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {time}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col items-end justify-between">
        <div className="text-right">
          <span className="text-sm font-medium">{calories}</span>
          <span className="text-xs text-muted-foreground"> cal</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1 mt-1" 
          onClick={handleAddCalories}
          disabled={added}
        >
          {added ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {added ? "Added" : "Track"}
        </Button>
      </div>
    </motion.div>
  );
};

export default MealItem;
