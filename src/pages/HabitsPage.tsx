import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Habit {
  achieved?: boolean;
  selectedCat?: "body" | "mind" | "soul";
  id: string;
  title: string;
  importance: "low" | "medium" | "high";
  block: 2 | 6 | 12 | 18;
  frequency: "daily" | "weekly";
  days: number[]; // 0=Sun
  creationDate: string;
  streak: number;
  minutes: {
    body: number;
    mind: number;
    soul: number;
  };
}

const defaultMinutes = { body: 0, mind: 0, soul: 0 };

const HabitsPage = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [achievements, setAchievements] = useState<Habit[]>([]);
  const [title, setTitle] = useState("");
  const [importance, setImportance] = useState<"low" | "medium" | "high">("medium");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [days, setDays] = useState<number[]>([]);
  const [category, setCategory] = useState<"body" | "mind" | "soul">("body");
  const [entryValues, setEntryValues] = useState<Record<string, number>>({});
  const [block, setBlock] = useState<2 | 6 | 12 | 18>(2);

  const addHabit = () => {
    if (!title.trim()) return;
    const newHabit: Habit = {
      id: Date.now().toString(),
      title: title.trim(),
      importance,
      block,
      frequency,
      days,
      creationDate: new Date().toISOString(),
      streak: 0,
      selectedCat: category,
      minutes: { ...defaultMinutes },
    };
    setHabits((prev) => [...prev, newHabit]);
    setTitle("");
    setImportance("medium");
    setFrequency("daily");
    setDays([]);
    setBlock(2);
  };

  const updateMinutes = (id: string, key: "body" | "mind" | "soul", value: number) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, minutes: { ...h.minutes, [key]: value } } : h
      )
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Habits</h1>

      {/* New Habit Form */}
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Create a New Habit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Habit title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex gap-4">
            <Select value={importance} onValueChange={(v) => setImportance(v as any)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Importance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>

            {/* Category */}
            <Select value={category} onValueChange={(v) => setCategory(v as any)}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Cat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="body">Body</SelectItem>
                <SelectItem value="mind">Mind</SelectItem>
                <SelectItem value="soul">Soul</SelectItem>
              </SelectContent>
            </Select>

            <Select value={String(block)} onValueChange={(v) => setBlock(Number(v) as any)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Block" />
              </SelectTrigger>
              <SelectContent>
                {[2, 6, 12, 18].map((b) => (
                  <SelectItem key={b} value={String(b)}>{`${b} Hours`}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={frequency} onValueChange={(v) => setFrequency(v as any)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={addHabit}>Add Habit</Button>
        </CardContent>
      </Card>

      {/* Habit Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => {
          const practiced = Object.values(habit.minutes).reduce((a, b) => a + b, 0);
          const remaining = Math.max(0, habit.block * 60 - practiced);
          return (
            <Card
              key={habit.id}
              className={`relative transition-colors ${remaining === 0 ? "bg-blue-600 text-white" : ""}`}
            >
              <CardHeader>
                <CardTitle className="flex justify-between">
                  {habit.title}
                  <span className="text-sm capitalize text-muted-foreground">
                    {habit.importance}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Metrics */}
                <div className="space-y-1">
                  {[
                    { label: "Target", value: habit.block * 60 },
                    { label: "Practiced", value: practiced },
                    { label: "Remaining", value: remaining },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between text-lg font-medium">
                      <span>{row.label}</span>
                      <span className="rounded-md bg-secondary px-2 py-0.5 font-semibold tabular-nums">
                        {row.value}m
                      </span>
                    </div>
                  ))}
                </div>

                {remaining === 0 && !habit.achieved && (
                  <div className="mt-2 flex items-center gap-4">
                    <span className="text-lg font-semibold">Success, Congrats!!</span>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setHabits((prev) =>
                          prev.map((h) => (h.id === habit.id ? { ...h, achieved: true } : h))
                        );
                        setAchievements((prev) => [...prev, { ...habit, achieved: true }]);
                      }}
                    >
                      Save Achievement
                    </Button>
                  </div>
                )}

                {/* Minute log slider */}
                {remaining > 0 && (
                  <div className="flex items-center gap-4 pt-2">
                    <Slider
                      className="flex-1"
                      max={remaining}
                      value={[entryValues[habit.id] ?? 0]}
                      step={1}
                      onValueChange={(v) =>
                        setEntryValues((prev) => ({ ...prev, [habit.id]: v[0] }))
                      }
                    />
                    <span className="w-14 text-sm text-right">
                      {entryValues[habit.id] ?? 0}m
                    </span>
                    <Button
                      size="sm"
                      onClick={() => {
                        const val = entryValues[habit.id] ?? 0;
                        if (val <= 0) return;
                        const cat = habit.selectedCat || "body";
                        setHabits((prev) =>
                          prev.map((h) =>
                            h.id === habit.id
                              ? { ...h, minutes: { ...h.minutes, [cat]: h.minutes[cat] + val } }
                              : h
                          )
                        );
                        setEntryValues((prev) => ({ ...prev, [habit.id]: 0 }));
                      }}
                    >
                      + Add
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default HabitsPage;
