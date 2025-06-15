
interface ChecklistProgressProps {
  completedCount: number;
  totalCount: number;
}

const ChecklistProgress = ({ completedCount, totalCount }: ChecklistProgressProps) => {
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="text-right">
        <div className="text-2xl font-bold">{completedCount}/{totalCount}</div>
        <div className="text-sm text-muted-foreground">{Math.round(progressPercentage)}% Complete</div>
      </div>
    </div>
  );
};

export default ChecklistProgress;
