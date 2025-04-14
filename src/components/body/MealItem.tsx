
import { motion } from "framer-motion";

export interface MealItemProps {
  title: string;
  description: string;
  time: string;
  calories: number;
  index: number;
}

export const MealItem = ({ 
  title, 
  description, 
  time,
  calories,
  index
}: MealItemProps) => {
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
      <div className="text-right">
        <span className="text-sm font-medium">{calories}</span>
        <span className="text-xs text-muted-foreground"> cal</span>
      </div>
    </motion.div>
  );
};

export default MealItem;
