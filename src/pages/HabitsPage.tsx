import React, { useState, useEffect } from "react";
import "../styles/habitsDashboard.css";

type Distribution = {
  body: number;
  mind: number;
  soul: number;
};

interface Habit {
  id: string;
  name: string;
  icon: string;
  type: "old" | "new";
  timeBlock: string;
  distribution: Distribution;
}

const TIME_BLOCK_OPTIONS = ["2 Hours", "6 Hours", "12 Hours", "18 Hours"] as const;

const Gauge = ({ progress, color, label }: { progress: number; color: string; label: string }) => (
  <div className="gauge">
    <div
      className="gauge-circle"
      style={{
        // @ts-ignore – css var
        "--progress": progress,
        "--progress-color": color,
      } as React.CSSProperties}
    >
      <div className="gauge-text">
        <div className="gauge-value" style={{ color }}>
          {progress}%
        </div>
        <div className="gauge-label">{label}</div>
      </div>
    </div>
  </div>
);

const HabitCard = ({ habit, onChange }: { habit: Habit; onChange: (h: Habit) => void }) => {
  const selectTimeBlock = (tb: string) => onChange({ ...habit, timeBlock: tb });
  const adjustDistribution = (field: keyof Distribution, val: number) => {
    const dist = { ...habit.distribution, [field]: val } as Distribution;
    const total = dist.body + dist.mind + dist.soul;
    if (total > 100) dist[field] = val - (total - 100);
    onChange({ ...habit, distribution: dist });
  };

  return (
    <div className="habit-card">
      <div className="habit-header">
        <span className={habit-type }> 
          {habit.type === "old" ? "Old Habit" : "New Habit"}
        </span>
        <span>{habit.icon}</span>
      </div>
      <div className="habit-name">{habit.name}</div>
      <div className="time-blocks">
        {TIME_BLOCK_OPTIONS.map((opt) => (
          <div
            key={opt}
            className={"time-block " + (habit.timeBlock === opt ? "selected" : "")}
            onClick={() => selectTimeBlock(opt)}
          >
            {opt}
          </div>
        ))}
      </div>
      <div className="habit-distribution">
        <div className="distribution-label">Time Distribution</div>
        {(["body", "mind", "soul"] as const).map((field) => (
          <div className="slider-container" key={field}>
            <span className={slider-label }>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
            <input
              type="range"
              className="slider"
              min={0}
              max={100}
              value={habit.distribution[field]}
              onChange={(e) => adjustDistribution(field, parseInt(e.target.value, 10))}
            />
            <span className="percentage">{habit.distribution[field]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface SectionProps {
  title: string;
  badgeText: string;
  badgeClass: string;
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}

const SectionPanel = ({ title, badgeText, badgeClass, habits, setHabits }: SectionProps) => {
  const addHabit = () => {
    setHabits((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "New Habit Name",
        icon: "?",
        type: "new",
        timeBlock: TIME_BLOCK_OPTIONS[0],
        distribution: { body: 33, mind: 33, soul: 34 },
      },
    ]);
  };

  const updateHabit = (updated: Habit) => {
    setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
  };

  const active = habits.length;
  const oldCount = habits.filter((h) => h.type === "old").length;
  const newCount = habits.filter((h) => h.type === "new").length;

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <span className={requency-badge }>{badgeText}</span>
      </div>
      <div className="stats-bar">
        <div className="stat-item"><div className="stat-value">{active}</div><div className="stat-label">Active</div></div>
        <div className="stat-item"><div className="stat-value">{oldCount}</div><div className="stat-label">Old Habits</div></div>
        <div className="stat-item"><div className="stat-value">{newCount}</div><div className="stat-label">New Habits</div></div>
      </div>
      <div className="gauge-container">
        <Gauge progress={75} color="#ff6b6b" label="Completion" />
        <Gauge progress={60} color="#4ecdc4" label="Progress" />
      </div>
      <div className="habits-grid">
        {habits.map((h) => (
          <HabitCard key={h.id} habit={h} onChange={updateHabit} />
        ))}
      </div>
      <button className="add-habit-btn" onClick={addHabit}>+ Add New {title.split(" ")[0]} Habit</button>
    </div>
  );
};

const HabitsPage: React.FC = () => {
  const [dailyHabits, setDailyHabits] = useState<Habit[]>([]);
  const [weeklyHabits, setWeeklyHabits] = useState<Habit[]>([]);

  const saveData = () => {
    console.log("Saving habit data", { dailyHabits, weeklyHabits });
  };
  const publish = () => {
    console.log("Publishing habits & activating notifications...", { dailyHabits, weeklyHabits });
  };

  useEffect(() => {
    document.body.classList.add("habits-dashboard");
    return () => document.body.classList.remove("habits-dashboard");
  }, []);

  return (
    <>
      <div className="dashboard">
        <SectionPanel title="Daily Habits" badgeText="Once a Day" badgeClass="daily" habits={dailyHabits} setHabits={setDailyHabits} />
        <SectionPanel title="Weekly Habits" badgeText="Once a Week" badgeClass="weekly" habits={weeklyHabits} setHabits={setWeeklyHabits} />
      </div>
      <div className="control-buttons">
        <button className="btn btn-save" onClick={saveData}>?? Save Data</button>
        <button className="btn btn-publish" onClick={publish}>?? Publish & Activate</button>
      </div>
    </>
  );
};

export default HabitsPage;
