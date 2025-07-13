import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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
  archived?: boolean;
  minutes: {
    body: number;
    mind: number;
    soul: number;
  };
}

const defaultMinutes = { body: 0, mind: 0, soul: 0 };

const HabitsPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [achievements, setAchievements] = useState<Habit[]>([]);
  const [title, setTitle] = useState("");
  const [importance, setImportance] = useState<"low" | "medium" | "high">("medium");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [days, setDays] = useState<number[]>([]);
  const [category, setCategory] = useState<"body" | "mind" | "soul">("body");
  const [entryValues, setEntryValues] = useState<Record<string, number>>({});
  const [block, setBlock] = useState<2 | 6 | 12 | 18>(2);
  const [view, setView] = useState<'active' | 'archived' | 'all'>('active');

  const addHabit = async () => {
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    const newHabit = {
      title: title.trim(),
      importance,
      block,
      frequency,
      days,
      selected_cat: category,
      minutes: { body: 0, mind: 0, soul: 0 },
      streak: 0,
      achieved: false
    };
    const { error: insertError, data } = await supabase.from('habits').insert([newHabit]);
    if (insertError) {
      setError('Failed to add habit: ' + insertError.message);
    } else {
      fetchHabits();
      setTitle("");
      setImportance("medium");
      setFrequency("daily");
      setDays([]);
      setBlock(2);
    }
    setLoading(false);
  };

  const fetchHabits = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase.from('habits').select('*').order('creation_date', { ascending: false });
    if (fetchError) {
      setError('Failed to fetch habits: ' + fetchError.message);
    } else {
      setHabits(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHabits();
    // eslint-disable-next-line
  }, []);

  // Mark habit as achieved in Supabase and update UI
  const handleSaveAchievement = async (habit: Habit) => {
    setLoading(true);
    const { error: updErr } = await supabase
      .from('habits')
      .update({ achieved: true, archived: true })
      .eq('id', habit.id);
    if (updErr) {
      setError('Failed to save achievement: ' + (updErr?.message || JSON.stringify(updErr)));
      setLoading(false);
      return;
    }
    setHabits((prev) => prev.map((h) => (h.id === habit.id ? { ...h, achieved: true, archived: true } : h)));
    setAchievements((prev) => [...prev, { ...habit, achieved: true, archived: true }]);
    setLoading(false);
  };

  // Insert a log entry into habit_entries table and update UI
    const handleDeleteHabit = async (habitId: string) => {
    setLoading(true);
    const { error: delErr } = await supabase.from('habits').delete().eq('id', habitId);
    if (delErr) {
      setError('Failed to delete habit: ' + (delErr?.message || JSON.stringify(delErr)));
      setLoading(false);
      return;
    }
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    setLoading(false);
  };

  const handleAddMinutes = async (habit: Habit, val: number) => {
    if (val <= 0) return;
    setLoading(true);
    const { error: insertErr } = await supabase
      .from('habit_entries')
      .insert({ habit_id: habit.id, minutes: val });
    if (insertErr) {
      setError('Failed to log minutes: ' + (insertErr?.message || JSON.stringify(insertErr)));
      setLoading(false);
      return;
    }
    // Optimistic UI update while we wait for backend aggregation
    const cat = habit.selectedCat || 'body';
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habit.id
          ? { ...h, minutes: { ...h.minutes, [cat]: h.minutes[cat] + val } }
          : h
      )
    );
    setEntryValues((prev) => ({ ...prev, [habit.id]: 0 }));
    setLoading(false);
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

          <Button onClick={addHabit} disabled={loading}>
  {loading ? 'Adding...' : 'Add Habit'}
</Button>
{error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="flex gap-4 items-center">
        <span className="text-sm">Show:</span>
        <Select value={view} onValueChange={(v) => setView(v as any)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Habit Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {habits
          .filter((h) =>
            view === 'all' ? true : view === 'archived' ? h.archived : !h.archived
          )
          .map((habit) => {
          const practiced = Object.values(habit.minutes).reduce((a, b) => a + b, 0);
          const remaining = Math.max(0, habit.block * 60 - practiced);
          return (
            <Card
              key={habit.id}
              className={`relative transition-colors ${remaining === 0 ? "bg-blue-600 text-white" : ""}`}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <div>
                    <div>{habit.title}</div>
                    <div className="mt-0.5 flex gap-2 text-xs text-muted-foreground capitalize">
                      <span>{habit.selectedCat}</span>
                      <span>{habit.frequency}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 self-start">
                    <span className="text-sm capitalize text-muted-foreground">
                      {habit.importance}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteHabit(habit.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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

                {remaining === 0 && !habit.achieved && !habit.archived && (
                  <div className="mt-2 flex items-center gap-4">
                    <span className="text-lg font-semibold">Success, Congrats!!</span>
                    <Button
                       size="sm"
                       variant="outline"
                       onClick={() => handleSaveAchievement(habit)}
                    >
                      Save Achievement
                    </Button>
                  </div>
                )}

                {/* Completed info for archived habits */}
                {habit.archived && (
                  <div className="pt-2 text-sm text-muted-foreground">Completed</div>
                )}

                {/* Minute log slider */}
                {remaining > 0 && !habit.archived && (
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
                      onClick={() => handleAddMinutes(habit, entryValues[habit.id] ?? 0)}
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
