
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChecklistItem as ChecklistItemType } from "./types";
import { getIcon, getCategoryColor } from "./checklistUtils";

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: (id: string) => void;
}

const ChecklistItem = ({ item, onToggle }: ChecklistItemProps) => {
  const IconComponent = getIcon(item.icon);

  return (
    <div
      className={`flex items-start space-x-3 rounded-lg border p-4 transition-all duration-200 ${
        item.completed 
          ? 'bg-green-50 border-green-200 opacity-75' 
          : 'bg-background hover:bg-muted/50'
      }`}
    >
      <Checkbox
        id={item.id}
        checked={item.completed}
        onCheckedChange={() => onToggle(item.id)}
        className="mt-1"
      />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-full ${getCategoryColor(item.category)} bg-opacity-20`}>
            <IconComponent className="h-4 w-4" />
          </div>
          <label
            htmlFor={item.id}
            className={`font-medium cursor-pointer ${
              item.completed ? 'line-through text-muted-foreground' : ''
            }`}
          >
            {item.title}
          </label>
          {item.category !== "general" && (
            <Badge variant="secondary" className={`text-xs ${getCategoryColor(item.category)}`}>
              {item.category}
            </Badge>
          )}
        </div>
        <p className={`text-sm ${item.completed ? 'text-muted-foreground line-through' : 'text-muted-foreground'}`}>
          {item.description}
        </p>
      </div>
    </div>
  );
};

export default ChecklistItem;
