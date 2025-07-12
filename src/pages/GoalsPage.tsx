import { useState } from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DailyGoalsList from '@/components/goals/DailyGoalsList';
import DailyGoalDialog from '@/components/goals/DailyGoalDialog';
import TaskKanbanBoard from '@/components/tasks/TaskKanbanBoard';
import TaskForm from '@/components/tasks/TaskForm';
import NotesSection from '@/components/notes/NotesSection';
import { useDailyGoals } from '@/components/goals/useDailyGoals';
import { useTasks } from '@/components/tasks/useTasks';

const GoalsPage = () => {
  const [openGoalDialog, setOpenGoalDialog] = useState(false);
  const [openTaskForm, setOpenTaskForm] = useState(false);

  // new-goal fields
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] =
    useState<'mind' | 'body' | 'soul'>('mind');
  const [newStart, setNewStart] = useState('');
  const [newDuration, setNewDuration] = useState(60);

  const {
    goals,
    isLoading: goalsLoading,
    addGoal,
    removeGoal,
    toggleGoalCompletion,
    updateGoal,
  } = useDailyGoals();

  const { tasks, addTask, deleteTask, updateTaskStatus } = useTasks();

  const handleAddGoal = async () => {
    const ok = await addGoal(newTitle, newCategory, newStart, newDuration);
    if (ok) {
      setNewTitle('');
      setNewCategory('mind');
      setNewStart('');
      setNewDuration(60);
      setOpenGoalDialog(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Goals & Tasks</h1>
        <p className="text-muted-foreground">
          Set your major goals and break them down into actionable tasks.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <CardTitle>Major Goals & Tasks</CardTitle>
          </div>
          <CardDescription>
            Your macro goals with actionable sub-tasks
          </CardDescription>
        </CardHeader>

        <Tabs defaultValue="goals" className="p-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="goals">Today's Top 3 Goals</TabsTrigger>
            <TabsTrigger value="tasks">Task Management</TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="mt-6">
            <DailyGoalsList
              goals={goals}
              onAddGoal={() => setOpenGoalDialog(true)}
              onRemoveGoal={removeGoal}
              onToggleCompletion={toggleGoalCompletion}
              onUpdateGoal={updateGoal}
            />
          </TabsContent>

          <TabsContent value="tasks" className="mt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Task Board</h3>
                <Button
                  onClick={() => setOpenTaskForm(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  New Task
                </Button>
              </div>
              <TaskKanbanBoard
                tasks={tasks}
                onDelete={deleteTask}
                onStatusChange={updateTaskStatus}
              />
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <NotesSection />

      <DailyGoalDialog
        open={openGoalDialog}
        onOpenChange={setOpenGoalDialog}
        goalTitle={newTitle}
        setGoalTitle={setNewTitle}
        goalCategory={newCategory}
        setGoalCategory={setNewCategory}
        startTime={newStart}
        setStartTime={setNewStart}
        duration={newDuration}
        setDuration={setNewDuration}
        onAddGoal={handleAddGoal}
        isLoading={goalsLoading}
      />

      <TaskForm
        open={openTaskForm}
        onOpenChange={setOpenTaskForm}
        onSubmit={addTask}
      />
    </div>
  );
};

export default GoalsPage;