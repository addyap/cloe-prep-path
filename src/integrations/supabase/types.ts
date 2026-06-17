export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      attempts: {
        Row: {
          cefr_level: Database["public"]["Enums"]["cefr_level"]
          created_at: string
          id: string
          is_correct: boolean | null
          question_id: string
          score: number | null
          skill: Database["public"]["Enums"]["skill_type"]
          user_answer: string | null
          user_id: string
        }
        Insert: {
          cefr_level: Database["public"]["Enums"]["cefr_level"]
          created_at?: string
          id?: string
          is_correct?: boolean | null
          question_id: string
          score?: number | null
          skill: Database["public"]["Enums"]["skill_type"]
          user_answer?: string | null
          user_id: string
        }
        Update: {
          cefr_level?: Database["public"]["Enums"]["cefr_level"]
          created_at?: string
          id?: string
          is_correct?: boolean | null
          question_id?: string
          score?: number | null
          skill?: Database["public"]["Enums"]["skill_type"]
          user_answer?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      passages: {
        Row: {
          body: string
          cefr_level: Database["public"]["Enums"]["cefr_level"]
          context_tag: Database["public"]["Enums"]["context_tag"]
          created_at: string
          id: string
          skill: Database["public"]["Enums"]["skill_type"]
          title: string
        }
        Insert: {
          body: string
          cefr_level: Database["public"]["Enums"]["cefr_level"]
          context_tag?: Database["public"]["Enums"]["context_tag"]
          created_at?: string
          id?: string
          skill?: Database["public"]["Enums"]["skill_type"]
          title: string
        }
        Update: {
          body?: string
          cefr_level?: Database["public"]["Enums"]["cefr_level"]
          context_tag?: Database["public"]["Enums"]["context_tag"]
          created_at?: string
          id?: string
          skill?: Database["public"]["Enums"]["skill_type"]
          title?: string
        }
        Relationships: []
      }
      practice_sessions: {
        Row: {
          completed_at: string | null
          id: string
          mode: Database["public"]["Enums"]["session_mode"]
          skill: Database["public"]["Enums"]["skill_type"] | null
          started_at: string
          summary: Json | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          mode: Database["public"]["Enums"]["session_mode"]
          skill?: Database["public"]["Enums"]["skill_type"] | null
          started_at?: string
          summary?: Json | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          mode?: Database["public"]["Enums"]["session_mode"]
          skill?: Database["public"]["Enums"]["skill_type"] | null
          started_at?: string
          summary?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          current_estimated_level:
            | Database["public"]["Enums"]["cefr_level"]
            | null
          full_name: string | null
          id: string
          target_cefr_level: Database["public"]["Enums"]["cefr_level"] | null
        }
        Insert: {
          created_at?: string
          current_estimated_level?:
            | Database["public"]["Enums"]["cefr_level"]
            | null
          full_name?: string | null
          id: string
          target_cefr_level?: Database["public"]["Enums"]["cefr_level"] | null
        }
        Update: {
          created_at?: string
          current_estimated_level?:
            | Database["public"]["Enums"]["cefr_level"]
            | null
          full_name?: string | null
          id?: string
          target_cefr_level?: Database["public"]["Enums"]["cefr_level"] | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          audio_url: string | null
          cefr_level: Database["public"]["Enums"]["cefr_level"]
          context_tag: Database["public"]["Enums"]["context_tag"]
          correct_answer: string | null
          created_at: string
          explanation: string | null
          id: string
          options: Json | null
          passage_id: string | null
          prompt_text: string
          skill: Database["public"]["Enums"]["skill_type"]
          type: Database["public"]["Enums"]["question_type"]
        }
        Insert: {
          audio_url?: string | null
          cefr_level: Database["public"]["Enums"]["cefr_level"]
          context_tag?: Database["public"]["Enums"]["context_tag"]
          correct_answer?: string | null
          created_at?: string
          explanation?: string | null
          id?: string
          options?: Json | null
          passage_id?: string | null
          prompt_text: string
          skill: Database["public"]["Enums"]["skill_type"]
          type: Database["public"]["Enums"]["question_type"]
        }
        Update: {
          audio_url?: string | null
          cefr_level?: Database["public"]["Enums"]["cefr_level"]
          context_tag?: Database["public"]["Enums"]["context_tag"]
          correct_answer?: string | null
          created_at?: string
          explanation?: string | null
          id?: string
          options?: Json | null
          passage_id?: string | null
          prompt_text?: string
          skill?: Database["public"]["Enums"]["skill_type"]
          type?: Database["public"]["Enums"]["question_type"]
        }
        Relationships: [
          {
            foreignKeyName: "questions_passage_id_fkey"
            columns: ["passage_id"]
            isOneToOne: false
            referencedRelation: "passages"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      cefr_level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
      context_tag:
        | "email"
        | "meeting"
        | "call"
        | "negotiation"
        | "customer_service"
        | "general"
      question_type: "mcq" | "gap_fill" | "open_text" | "prompt"
      session_mode: "practice" | "mock" | "skill_drill"
      skill_type:
        | "listening"
        | "reading"
        | "grammar_vocab"
        | "writing"
        | "speaking"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      cefr_level: ["A1", "A2", "B1", "B2", "C1", "C2"],
      context_tag: [
        "email",
        "meeting",
        "call",
        "negotiation",
        "customer_service",
        "general",
      ],
      question_type: ["mcq", "gap_fill", "open_text", "prompt"],
      session_mode: ["practice", "mock", "skill_drill"],
      skill_type: [
        "listening",
        "reading",
        "grammar_vocab",
        "writing",
        "speaking",
      ],
    },
  },
} as const
