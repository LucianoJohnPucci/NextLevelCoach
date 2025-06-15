export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      body_goals: {
        Row: {
          created_at: string
          exercise_progress: number
          hydration_progress: number
          id: string
          nutrition_progress: number
          sleep_progress: number
          strength_progress: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          exercise_progress?: number
          hydration_progress?: number
          id?: string
          nutrition_progress?: number
          sleep_progress?: number
          strength_progress?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          exercise_progress?: number
          hydration_progress?: number
          id?: string
          nutrition_progress?: number
          sleep_progress?: number
          strength_progress?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      body_metrics: {
        Row: {
          body_goals: string | null
          calories_burned: number
          created_at: string
          date: string
          height: number | null
          id: string
          streak_days: number
          updated_at: string
          user_id: string
          weight: number | null
          workout_minutes: number
        }
        Insert: {
          body_goals?: string | null
          calories_burned?: number
          created_at?: string
          date?: string
          height?: number | null
          id?: string
          streak_days?: number
          updated_at?: string
          user_id: string
          weight?: number | null
          workout_minutes?: number
        }
        Update: {
          body_goals?: string | null
          calories_burned?: number
          created_at?: string
          date?: string
          height?: number | null
          id?: string
          streak_days?: number
          updated_at?: string
          user_id?: string
          weight?: number | null
          workout_minutes?: number
        }
        Relationships: []
      }
      community_events: {
        Row: {
          created_at: string
          event_date: string
          id: string
          is_open: boolean
          location: string
          notes: string | null
          participants: number
          ticket_cost: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_date: string
          id?: string
          is_open?: boolean
          location: string
          notes?: string | null
          participants?: number
          ticket_cost?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_date?: string
          id?: string
          is_open?: boolean
          location?: string
          notes?: string | null
          participants?: number
          ticket_cost?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_checklist_tracking: {
        Row: {
          braindump_completed: boolean
          complete_completed: boolean
          created_at: string
          date: string
          id: string
          prioritize_completed: boolean
          review_completed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          braindump_completed?: boolean
          complete_completed?: boolean
          created_at?: string
          date?: string
          id?: string
          prioritize_completed?: boolean
          review_completed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          braindump_completed?: boolean
          complete_completed?: boolean
          created_at?: string
          date?: string
          id?: string
          prioritize_completed?: boolean
          review_completed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_entries: {
        Row: {
          accomplishments: string | null
          challenges: string | null
          created_at: string
          date: string
          emotions: string[] | null
          energy: number
          gratitude: string | null
          id: string
          mood: number
          updated_at: string
          user_id: string
        }
        Insert: {
          accomplishments?: string | null
          challenges?: string | null
          created_at?: string
          date?: string
          emotions?: string[] | null
          energy: number
          gratitude?: string | null
          id?: string
          mood: number
          updated_at?: string
          user_id: string
        }
        Update: {
          accomplishments?: string | null
          challenges?: string | null
          created_at?: string
          date?: string
          emotions?: string[] | null
          energy?: number
          gratitude?: string | null
          id?: string
          mood?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_goals: {
        Row: {
          category: string
          completed: boolean
          created_at: string
          date: string
          duration: number
          id: string
          start_time: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          completed?: boolean
          created_at?: string
          date?: string
          duration?: number
          id?: string
          start_time?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          completed?: boolean
          created_at?: string
          date?: string
          duration?: number
          id?: string
          start_time?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string | null
          final_date: string | null
          id: string
          milestone_date: string | null
          progress: number | null
          start_date: string | null
          title: string
          user_id: string
          why: string | null
        }
        Insert: {
          created_at?: string | null
          final_date?: string | null
          id?: string
          milestone_date?: string | null
          progress?: number | null
          start_date?: string | null
          title: string
          user_id: string
          why?: string | null
        }
        Update: {
          created_at?: string | null
          final_date?: string | null
          id?: string
          milestone_date?: string | null
          progress?: number | null
          start_date?: string | null
          title?: string
          user_id?: string
          why?: string | null
        }
        Relationships: []
      }
      habit_tracking: {
        Row: {
          avoided_old_habit: boolean | null
          completed: boolean
          created_at: string
          date: string
          habit_id: string
          id: string
          notes: string | null
          practiced_new_habit: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avoided_old_habit?: boolean | null
          completed?: boolean
          created_at?: string
          date?: string
          habit_id: string
          id?: string
          notes?: string | null
          practiced_new_habit?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avoided_old_habit?: boolean | null
          completed?: boolean
          created_at?: string
          date?: string
          habit_id?: string
          id?: string
          notes?: string | null
          practiced_new_habit?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_tracking_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          created_at: string
          frequency: string
          id: string
          new_habit: string | null
          old_habit: string | null
          rating: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          frequency?: string
          id?: string
          new_habit?: string | null
          old_habit?: string | null
          rating?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          frequency?: string
          id?: string
          new_habit?: string | null
          old_habit?: string | null
          rating?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string | null
          created_at: string
          id: number
          prompt_question: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          prompt_question?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          prompt_question?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      meditation_sessions: {
        Row: {
          benefits: string
          created_at: string
          description: string
          duration: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          benefits: string
          created_at?: string
          description: string
          duration: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          benefits?: string
          created_at?: string
          description?: string
          duration?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      mind_goals: {
        Row: {
          created_at: string
          focus_progress: number
          id: string
          learning_progress: number
          meditation_progress: number
          mindfulness_progress: number
          reading_progress: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          focus_progress?: number
          id?: string
          learning_progress?: number
          meditation_progress?: number
          mindfulness_progress?: number
          reading_progress?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          focus_progress?: number
          id?: string
          learning_progress?: number
          meditation_progress?: number
          mindfulness_progress?: number
          reading_progress?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mind_metrics: {
        Row: {
          created_at: string
          date: string
          focus_score: number
          id: string
          journal_count: number
          learn_count: number
          meditation_minutes: number
          mind_goals: string | null
          read_count: number
          streak_days: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          focus_score?: number
          id?: string
          journal_count?: number
          learn_count?: number
          meditation_minutes?: number
          mind_goals?: string | null
          read_count?: number
          streak_days?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          focus_score?: number
          id?: string
          journal_count?: number
          learn_count?: number
          meditation_minutes?: number
          mind_goals?: string | null
          read_count?: number
          streak_days?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_answers: {
        Row: {
          answer_1: string | null
          answer_10: string | null
          answer_2: string | null
          answer_3: string | null
          answer_4: string | null
          answer_5: string | null
          answer_6: string | null
          answer_7: string | null
          answer_8: string | null
          answer_9: string | null
          id: string
          last_updated: string
          question_1: string | null
          question_10: string | null
          question_2: string | null
          question_3: string | null
          question_4: string | null
          question_5: string | null
          question_6: string | null
          question_7: string | null
          question_8: string | null
          question_9: string | null
          signup_date: string
          user_id: string
        }
        Insert: {
          answer_1?: string | null
          answer_10?: string | null
          answer_2?: string | null
          answer_3?: string | null
          answer_4?: string | null
          answer_5?: string | null
          answer_6?: string | null
          answer_7?: string | null
          answer_8?: string | null
          answer_9?: string | null
          id?: string
          last_updated?: string
          question_1?: string | null
          question_10?: string | null
          question_2?: string | null
          question_3?: string | null
          question_4?: string | null
          question_5?: string | null
          question_6?: string | null
          question_7?: string | null
          question_8?: string | null
          question_9?: string | null
          signup_date?: string
          user_id: string
        }
        Update: {
          answer_1?: string | null
          answer_10?: string | null
          answer_2?: string | null
          answer_3?: string | null
          answer_4?: string | null
          answer_5?: string | null
          answer_6?: string | null
          answer_7?: string | null
          answer_8?: string | null
          answer_9?: string | null
          id?: string
          last_updated?: string
          question_1?: string | null
          question_10?: string | null
          question_2?: string | null
          question_3?: string | null
          question_4?: string | null
          question_5?: string | null
          question_6?: string | null
          question_7?: string | null
          question_8?: string | null
          question_9?: string | null
          signup_date?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          body_exercise_minutes_goal: number | null
          body_weight_goal: number | null
          created_at: string
          email: string | null
          f_name: string | null
          full_name: string | null
          id: string
          mind_focus_goal: number | null
          mind_meditation_goal: number | null
          notify_by_email: boolean | null
          notify_by_sms: boolean | null
          sms: string | null
          soul_gratitude_frequency: string | null
          soul_reflection_goal: number | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          body_exercise_minutes_goal?: number | null
          body_weight_goal?: number | null
          created_at?: string
          email?: string | null
          f_name?: string | null
          full_name?: string | null
          id: string
          mind_focus_goal?: number | null
          mind_meditation_goal?: number | null
          notify_by_email?: boolean | null
          notify_by_sms?: boolean | null
          sms?: string | null
          soul_gratitude_frequency?: string | null
          soul_reflection_goal?: number | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          body_exercise_minutes_goal?: number | null
          body_weight_goal?: number | null
          created_at?: string
          email?: string | null
          f_name?: string | null
          full_name?: string | null
          id?: string
          mind_focus_goal?: number | null
          mind_meditation_goal?: number | null
          notify_by_email?: boolean | null
          notify_by_sms?: boolean | null
          sms?: string | null
          soul_gratitude_frequency?: string | null
          soul_reflection_goal?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      soul_goals: {
        Row: {
          connection_progress: number
          created_at: string
          creativity_progress: number
          gratitude_progress: number
          id: string
          purpose_progress: number
          reflection_progress: number
          updated_at: string
          user_id: string
        }
        Insert: {
          connection_progress?: number
          created_at?: string
          creativity_progress?: number
          gratitude_progress?: number
          id?: string
          purpose_progress?: number
          reflection_progress?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          connection_progress?: number
          created_at?: string
          creativity_progress?: number
          gratitude_progress?: number
          id?: string
          purpose_progress?: number
          reflection_progress?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      soul_metrics: {
        Row: {
          connections_attended: number
          created_at: string
          date: string
          gratitude_streak_days: number
          id: string
          reflection_minutes: number
          updated_at: string
          user_id: string
        }
        Insert: {
          connections_attended?: number
          created_at?: string
          date?: string
          gratitude_streak_days?: number
          id?: string
          reflection_minutes?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          connections_attended?: number
          created_at?: string
          date?: string
          gratitude_streak_days?: number
          id?: string
          reflection_minutes?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      Stoic_Blogs: {
        Row: {
          content: string | null
          created_at: string
          embedding: string | null
          id: number
          metadata: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: string | null
        }
        Relationships: []
      }
      user_meditation_preferences: {
        Row: {
          created_at: string
          id: string
          is_enabled: boolean
          session_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          session_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          session_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_meditation_preferences_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "meditation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tasks: {
        Row: {
          completed: boolean
          created_at: string
          due_date: string | null
          id: string
          importance_level: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          due_date?: string | null
          id?: string
          importance_level: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          due_date?: string | null
          id?: string
          importance_level?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users_notes: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_habit: {
        Args: {
          p_title: string
          p_user_id: string
          p_old_habit?: string
          p_new_habit?: string
          p_frequency?: string
          p_rating?: number
        }
        Returns: undefined
      }
      delete_habit: {
        Args: { p_id: string }
        Returns: undefined
      }
      get_habit_streak_history: {
        Args: { p_habit_id: string; p_days?: number }
        Returns: {
          date: string
          completed: boolean
          avoided_old_habit: boolean
          practiced_new_habit: boolean
          notes: string
        }[]
      }
      get_habit_tracking_with_streaks: {
        Args: Record<PropertyKey, never>
        Returns: {
          habit_id: string
          habit_title: string
          habit_frequency: string
          habit_old_habit: string
          habit_new_habit: string
          habit_rating: number
          current_streak: number
          total_completions: number
          completion_rate: number
          last_completed_date: string
          today_completed: boolean
          today_avoided_old_habit: boolean
          today_practiced_new_habit: boolean
        }[]
      }
      get_habits: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          title: string
          old_habit: string
          new_habit: string
          frequency: string
          rating: number
          created_at: string
          user_id: string
        }[]
      }
      track_habit_progress: {
        Args: {
          p_habit_id: string
          p_date?: string
          p_completed?: boolean
          p_avoided_old_habit?: boolean
          p_practiced_new_habit?: boolean
          p_notes?: string
        }
        Returns: undefined
      }
      update_habit: {
        Args: {
          p_id: string
          p_title?: string
          p_frequency?: string
          p_old_habit?: string
          p_new_habit?: string
          p_rating?: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
