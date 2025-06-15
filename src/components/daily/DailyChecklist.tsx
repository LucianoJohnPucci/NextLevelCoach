
import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DailyChecklistDialog from "./DailyChecklistDialog";
import ChecklistProgress from "./ChecklistProgress";
import ChecklistItem from "./ChecklistItem";
import { useDailyChecklist } from "./useDailyChecklist";
import { DailyChecklistProps } from "./types";

const DailyChecklist = ({ recordsEnabled }: DailyChecklistProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { items, toggleItem, addNewItem } = useDailyChecklist(recordsEnabled);

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

  return (
    <>
      <CardContent className="space-y-4">
        <ChecklistProgress completedCount={completedCount} totalCount={totalCount} />
        
        {items.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            onToggle={toggleItem}
          />
        ))}

        <div className="pt-4 border-t">
          <Button 
            variant="outline" 
            className="w-full gap-2" 
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Go to inputs
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Add new habits to your daily routine. Daily check-ins with modifications allow new habits to be BORN! 🌱
          </p>
        </div>
      </CardContent>

      <DailyChecklistDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAddItem={addNewItem}
      />
    </>
  );
};

export default DailyChecklist;
