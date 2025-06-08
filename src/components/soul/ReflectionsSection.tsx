
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Save, Heart, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

const ReflectionsSection = () => {
  const { user } = useAuth();
  const [gratitude, setGratitude] = useState("");
  const [challenges, setChallenges] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchReflections();
    }
  }, [user]);

  const fetchReflections = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_entries')
        .select('gratitude, challenges')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setGratitude(data.gratitude || '');
        setChallenges(data.challenges || '');
      }
    } catch (error) {
      console.error('Error fetching reflections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveReflections = async () => {
    if (!user) {
      toast.error('Authentication required', {
        description: 'Please log in to save your reflections.'
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const entryData = {
        user_id: user.id,
        date: today,
        gratitude,
        challenges,
        updated_at: new Date().toISOString()
      };
      
      // Try to update first (in case entry already exists)
      const { data: updateData, error: updateError } = await supabase
        .from('daily_entries')
        .update({ gratitude, challenges, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('date', today);
      
      // If no rows were affected by update, insert a new entry
      if (updateError || (updateData === null)) {
        const { error: insertError } = await supabase
          .from('daily_entries')
          .insert([{
            ...entryData,
            mood: 5, // Default values for required fields
            energy: 5,
            emotions: []
          }]);
        
        if (insertError) throw insertError;
      }
      
      toast.success("Reflections saved successfully", {
        description: "Your daily reflections have been recorded.",
      });
    } catch (error) {
      console.error('Error saving reflections:', error);
      toast.error('Failed to save reflections', {
        description: 'There was a problem saving your reflections.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-primary/10 rounded mb-2"></div>
          <div className="h-4 bg-primary/5 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-40 bg-primary/5 rounded"></div>
            <div className="h-40 bg-primary/5 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Daily Reflections</h2>
        <p className="text-muted-foreground">
          Take a moment to reflect on your day with gratitude and acknowledge any challenges.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Gratitude
            </CardTitle>
            <CardDescription>
              What are you grateful for today?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="I'm grateful for..."
              className="min-h-[120px] resize-none"
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Challenges
            </CardTitle>
            <CardDescription>
              What challenges did you face today?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Today I found it difficult to..."
              className="min-h-[120px] resize-none"
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            onClick={handleSaveReflections} 
            size="lg" 
            className="gap-2"
            disabled={isSaving || !user}
          >
            {isSaving ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Reflections
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReflectionsSection;
