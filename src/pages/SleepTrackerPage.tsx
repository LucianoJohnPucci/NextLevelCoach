import SleepTracker from "@/components/notes/SleepTracker";

const SleepTrackerPage = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Sleep Tracker</h1>
        <p className="text-muted-foreground">
          Track and analyze your sleep patterns for optimal recovery and performance.
        </p>
      </div>

      <SleepTracker />
    </div>
  );
};

export default SleepTrackerPage;
