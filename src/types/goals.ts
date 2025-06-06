
export interface Goal {
  id: string;
  title: string;
  progress: number;
  added: Date;
  start_date?: Date;
  milestone_date?: Date;
  final_date?: Date;
  why?: string;
}
