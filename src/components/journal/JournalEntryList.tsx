
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

interface JournalEntry {
  id: number;
  prompt_question: string;
  content: string;
  created_at: string;
}

const JournalEntryList = ({ prompt }: { prompt: string }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEntries = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("journal_entries")
          .select("id, prompt_question, content, created_at")
          .eq("user_id", user.id)
          .eq("prompt_question", prompt)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setEntries(data || []);
      } catch (error) {
        console.error("Error fetching journal entries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [prompt, user]);

  if (loading) {
    return <div className="text-center text-muted-foreground">Loading entries...</div>;
  }

  if (entries.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No entries yet. Start journaling to see your responses here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Your previous entries for this prompt:</h3>
      {entries.map((entry) => (
        <Card key={entry.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              {format(new Date(entry.created_at), "MMMM d, yyyy 'at' h:mm a")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{entry.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default JournalEntryList;
