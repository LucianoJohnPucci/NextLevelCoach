
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Bookmark } from "lucide-react";
import { useState } from "react";

interface ReadingItemProps { 
  title: string;
  author: string;
  duration: string;
  minutes: number;
  index: number;
  isFavorite?: boolean;
  onAdd: () => void;
  onToggleFavorite?: (isFavorite: boolean) => void;
}

const ReadingItem = ({ 
  title, 
  author, 
  duration,
  minutes,
  index,
  isFavorite: initialIsFavorite = false,
  onAdd,
  onToggleFavorite
}: ReadingItemProps) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const handleToggleFavorite = () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    onToggleFavorite?.(newFavoriteStatus);
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
        <p className="text-sm text-muted-foreground">By {author}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          onClick={onAdd} 
          variant="outline" 
          size="sm" 
          className="gap-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Add {minutes}m
        </Button>
        <Button 
          size="icon" 
          variant="ghost"
          onClick={handleToggleFavorite}
        >
          {isFavorite ? (
            <Bookmark className="h-4 w-4 fill-primary text-primary" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </Button>
        <Button size="icon" variant="ghost">
          <BookOpen className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default ReadingItem;
