
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Plus } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ReadingItem from "./ReadingItem";
import ReflectionForm from "./reflection-form/ReflectionForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface Reflection {
  id: string;
  title: string;
  author: string;
  description: string;
  minutes: number;
  community_rating: number;
}

const DailyReflectionsSection = () => {
  const { user } = useAuth();
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchReflections();
  }, []);

  const fetchReflections = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("daily_reflections")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      setReflections(data || []);
    } catch (error) {
      console.error("Error fetching reflections:", error);
      toast.error("Failed to load reflections");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddReflection = async (newReflection: Omit<Reflection, 'id' | 'community_rating'>) => {
    if (!user) {
      toast.error("Please log in to add reflections");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("daily_reflections")
        .insert([
          {
            ...newReflection,
            user_id: user.id
          }
        ])
        .select();

      if (error) throw error;
      
      toast.success("Reflection added successfully");
      setDialogOpen(false);
      fetchReflections();
    } catch (error) {
      console.error("Error adding reflection:", error);
      toast.error("Failed to add reflection");
    }
  };

  const renderReflections = () => {
    if (isLoading) {
      return <div className="text-center py-4">Loading reflections...</div>;
    }

    if (reflections.length === 0) {
      return <div className="text-center py-4">No reflections found. Be the first to add one!</div>;
    }

    return reflections.map((reflection, index) => (
      <ReadingItem
        key={reflection.id}
        title={reflection.title}
        author={reflection.author}
        duration={`${reflection.minutes} min`}
        minutes={reflection.minutes}
        index={index}
        onAdd={() => {}}
      />
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-5 w-5" />
          Community Reflections Library
        </CardTitle>
        <CardDescription>
          Browse reflections contributed by the community or add your own.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="ml-auto gap-2">
                <Plus className="h-4 w-4" />
                Add Reflection
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <ReflectionForm onSubmit={handleAddReflection} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-4">
          {renderReflections()}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyReflectionsSection;
