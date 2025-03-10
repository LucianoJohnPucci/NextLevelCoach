
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Target, CheckCircle, Plus } from "lucide-react";

const GoalsPage = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Goals & Habits</h1>
        <p className="text-muted-foreground">
          Set meaningful goals and build lasting positive habits.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle>Active Goals</CardTitle>
            </div>
            <CardDescription>Your current goals and their progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Read 12 books this year</div>
                  <div className="text-sm text-muted-foreground">3/12</div>
                </div>
                <Slider defaultValue={[25]} max={100} step={1} className="cursor-default" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Practice meditation daily</div>
                  <div className="text-sm text-muted-foreground">15 day streak</div>
                </div>
                <Slider defaultValue={[75]} max={100} step={1} className="cursor-default" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Exercise 3 times weekly</div>
                  <div className="text-sm text-muted-foreground">2/3 this week</div>
                </div>
                <Slider defaultValue={[66]} max={100} step={1} className="cursor-default" />
              </div>
            </div>
            
            <Button className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add New Goal
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <CardTitle>Habits</CardTitle>
            </div>
            <CardDescription>Daily and weekly habits to build</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="font-medium">Morning meditation</div>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  D
                </div>
              </div>
              
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="font-medium">Journal writing</div>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  D
                </div>
              </div>
              
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="font-medium">Yoga session</div>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  W
                </div>
              </div>
              
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="font-medium">Reading time</div>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  D
                </div>
              </div>
            </div>
            
            <Button className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add New Habit
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoalsPage;
