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
      goals: {
        Row: {
          created_at: string | null
          id: string
          progress: number | null
          start_date: string | null
          title: string
          user_id: string
          why: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          progress?: number | null
          start_date?: string | null
          title: string
          user_id: string
          why?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          progress?: number | null
          start_date?: string | null
          title?: string
          user_id?: string
          why?: string | null
        }
        Relationships: []
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
      mind_metrics: {
        Row: {
          created_at: string
          date: string
          focus_score: number
          id: string
          meditation_minutes: number
          mind_goals: string | null
          streak_days: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          focus_score?: number
          id?: string
          meditation_minutes?: number
          mind_goals?: string | null
          streak_days?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          focus_score?: number
          id?: string
          meditation_minutes?: number
          mind_goals?: string | null
          streak_days?: number
          updated_at?: string
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
          sms?: string | null
          soul_gratitude_frequency?: string | null
          soul_reflection_goal?: number | null
          updated_at?: string
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
