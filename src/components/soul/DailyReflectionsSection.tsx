
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Plus, Star, Clock, User } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ReflectionForm from "./reflection-form/ReflectionForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";

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
      // Use type assertion to bypass TypeScript checking for the table name
      const { data, error } = await (supabase
        .from("daily_reflections" as any)
        .select("*")
        .order("created_at", { ascending: false }) as any);
      
      if (error) throw error;
      
      // Use type assertion to inform TypeScript that data is an array of Reflection
      setReflections(data as Reflection[] || []);
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
      // Use type assertion for the table name
      const { data, error } = await (supabase
        .from("daily_reflections" as any)
        .insert([
          {
            ...newReflection,
            user_id: user.id
          }
        ])
        .select() as any);

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
      return (
        <div className="flex justify-center py-8">
          <div className="animate-pulse flex flex-col space-y-4 w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-primary/5 rounded-lg"></div>
            ))}
          </div>
        </div>
      );
    }

    if (reflections.length === 0) {
      return (
        <div className="text-center py-12 bg-primary/5 rounded-lg">
          <Book className="h-12 w-12 mx-auto text-primary/60 mb-4" />
          <h3 className="text-lg font-medium mb-2">No reflections found</h3>
          <p className="text-muted-foreground mb-4">Be the first to add a reflection to our community library</p>
          <Button 
            onClick={() => setDialogOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Your First Reflection
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {reflections.map((reflection, index) => (
          <ReflectionCard
            key={reflection.id}
            reflection={reflection}
            index={index}
          />
        ))}
      </div>
    );
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
        <div className="flex items-center gap-4 mb-6">
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
        {renderReflections()}
      </CardContent>
    </Card>
  );
};

interface ReflectionCardProps {
  reflection: Reflection;
  index: number;
}

const ReflectionCard = ({ reflection, index }: ReflectionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="border rounded-lg p-4 hover:bg-primary/5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
          <h3 className="font-medium text-lg">{reflection.title}</h3>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{reflection.community_rating || 0}/5</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            <span>{reflection.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{reflection.minutes} min read</span>
          </div>
        </div>
        
        {reflection.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {reflection.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default DailyReflectionsSection;
