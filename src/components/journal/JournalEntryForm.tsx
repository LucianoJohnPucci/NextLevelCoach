
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PenLine, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

interface JournalEntryFormProps {
  prompt: string;
  onClose: () => void;
}

const JournalEntryForm = ({ prompt, onClose }: JournalEntryFormProps) => {
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Please enter some content before saving");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to save a journal entry");
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase.from("journal_entries").insert({
        user_id: user.id,
        prompt_question: prompt,
        content: content,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast.success("Journal entry saved successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving journal entry:", error);
      toast.error("Failed to save journal entry. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="mb-4 text-lg font-medium">{prompt}</div>
        <Textarea
          placeholder="Write your thoughts here..."
          className="min-h-[200px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Entry"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JournalEntryForm;
