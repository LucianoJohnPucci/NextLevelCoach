
export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
  icon: string;
}

export interface DailyChecklistProps {
  recordsEnabled: boolean;
}
