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
    PostgrestVersion: "13.0.5"
  }
  fe_v4: {
    Tables: {
      apps: {
        Row: {
          app_id: string
          created_at: string
          force_update: boolean
          id: number
          latest_version: string
          maintenance: boolean
          max_version: string
          min_version: string
          web_url: string
        }
        Insert: {
          app_id: string
          created_at?: string
          force_update?: boolean
          id?: never
          latest_version: string
          maintenance?: boolean
          max_version: string
          min_version: string
          web_url: string
        }
        Update: {
          app_id?: string
          created_at?: string
          force_update?: boolean
          id?: never
          latest_version?: string
          maintenance?: boolean
          max_version?: string
          min_version?: string
          web_url?: string
        }
        Relationships: []
      }
      code_redemptions: {
        Row: {
          code: string
          code_id: number
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          code: string
          code_id: number
          created_at?: string
          id?: never
          user_id?: string
        }
        Update: {
          code?: string
          code_id?: number
          created_at?: string
          id?: never
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "code_redemptions_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "code_redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      codes: {
        Row: {
          action: string
          code: string
          created_at: string
          expires_at: string | null
          id: number
          is_active: boolean
          max_use: number
          used_count: number
          value: string
        }
        Insert: {
          action: string
          code: string
          created_at?: string
          expires_at?: string | null
          id?: never
          is_active?: boolean
          max_use?: number
          used_count?: number
          value: string
        }
        Update: {
          action?: string
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: never
          is_active?: boolean
          max_use?: number
          used_count?: number
          value?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          created_at: string
          id: number
          status: Database["fe_v4"]["Enums"]["news_status"]
          translation_record_id: number
        }
        Insert: {
          created_at?: string
          id?: never
          status?: Database["fe_v4"]["Enums"]["news_status"]
          translation_record_id: number
        }
        Update: {
          created_at?: string
          id?: never
          status?: Database["fe_v4"]["Enums"]["news_status"]
          translation_record_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "news_translation_record_id_fkey"
            columns: ["translation_record_id"]
            isOneToOne: true
            referencedRelation: "translation_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_translation_record_id_fkey"
            columns: ["translation_record_id"]
            isOneToOne: true
            referencedRelation: "v_translation_records"
            referencedColumns: ["id"]
          },
        ]
      }
      read_states: {
        Row: {
          created_at: string
          id: number
          record_id: number
          table_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: never
          record_id: number
          table_name: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: never
          record_id?: number
          table_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "read_states_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      support_center: {
        Row: {
          created_at: string
          id: number
          text: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: never
          text?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: never
          text?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_center_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      test: {
        Row: {
          created_at: string
          id: number
          translation_record_id: number
        }
        Insert: {
          created_at?: string
          id?: never
          translation_record_id: number
        }
        Update: {
          created_at?: string
          id?: never
          translation_record_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "test_translation_record_id_fkey"
            columns: ["translation_record_id"]
            isOneToOne: true
            referencedRelation: "translation_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_translation_record_id_fkey"
            columns: ["translation_record_id"]
            isOneToOne: true
            referencedRelation: "v_translation_records"
            referencedColumns: ["id"]
          },
        ]
      }
      translation_entities: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: never
          name: string
        }
        Update: {
          created_at?: string
          id?: never
          name?: string
        }
        Relationships: []
      }
      translation_fields: {
        Row: {
          created_at: string
          entity_id: number
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          entity_id: number
          id?: never
          name: string
        }
        Update: {
          created_at?: string
          entity_id?: number
          id?: never
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "translation_fields_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "translation_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      translation_records: {
        Row: {
          created_at: string
          entity_id: number
          id: number
        }
        Insert: {
          created_at?: string
          entity_id: number
          id?: never
        }
        Update: {
          created_at?: string
          entity_id?: number
          id?: never
        }
        Relationships: [
          {
            foreignKeyName: "translation_records_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "translation_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      translations: {
        Row: {
          created_at: string
          id: number
          language: Database["fe_v4"]["Enums"]["languages"]
          translation_field_id: number
          translation_record_id: number
          value: string
        }
        Insert: {
          created_at?: string
          id?: never
          language: Database["fe_v4"]["Enums"]["languages"]
          translation_field_id: number
          translation_record_id: number
          value: string
        }
        Update: {
          created_at?: string
          id?: never
          language?: Database["fe_v4"]["Enums"]["languages"]
          translation_field_id?: number
          translation_record_id?: number
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "translations_translation_field_id_fkey"
            columns: ["translation_field_id"]
            isOneToOne: false
            referencedRelation: "translation_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "translations_translation_record_id_fkey"
            columns: ["translation_record_id"]
            isOneToOne: false
            referencedRelation: "translation_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "translations_translation_record_id_fkey"
            columns: ["translation_record_id"]
            isOneToOne: false
            referencedRelation: "v_translation_records"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          app_id: string
          app_version: string | null
          created_at: string
          display_name: string | null
          email: string
          id: string
          last_ping: string
          machine_name: string | null
          machine_user_name: string | null
          region: string | null
          role: Database["fe_v4"]["Enums"]["user_roles"]
        }
        Insert: {
          app_id: string
          app_version?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          id: string
          last_ping?: string
          machine_name?: string | null
          machine_user_name?: string | null
          region?: string | null
          role?: Database["fe_v4"]["Enums"]["user_roles"]
        }
        Update: {
          app_id?: string
          app_version?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          last_ping?: string
          machine_name?: string | null
          machine_user_name?: string | null
          region?: string | null
          role?: Database["fe_v4"]["Enums"]["user_roles"]
        }
        Relationships: []
      }
    }
    Views: {
      v_news: {
        Row: {
          created_at: string | null
          id: number | null
          status: Database["fe_v4"]["Enums"]["news_status"] | null
          translation_record_id: number | null
          translations: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "news_translation_record_id_fkey"
            columns: ["translation_record_id"]
            isOneToOne: true
            referencedRelation: "translation_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_translation_record_id_fkey"
            columns: ["translation_record_id"]
            isOneToOne: true
            referencedRelation: "v_translation_records"
            referencedColumns: ["id"]
          },
        ]
      }
      v_test: {
        Row: {
          created_at: string | null
          id: number | null
          translation_record_id: number | null
          translations: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "test_translation_record_id_fkey"
            columns: ["translation_record_id"]
            isOneToOne: true
            referencedRelation: "translation_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_translation_record_id_fkey"
            columns: ["translation_record_id"]
            isOneToOne: true
            referencedRelation: "v_translation_records"
            referencedColumns: ["id"]
          },
        ]
      }
      v_translation_records: {
        Row: {
          id: number | null
          translations: Json | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_translation_record: {
        Args: { p_entity_name: string; p_translations: Json }
        Returns: number
      }
      create_user: {
        Args: {
          p_app_id: string
          p_app_version: string
          p_display_name: string
          p_email: string
          p_email_verified?: boolean
          p_machine_name: string
          p_machine_user_name: string
          p_password: string
          p_phone_verified?: boolean
          p_region: string
          p_role?: Database["fe_v4"]["Enums"]["user_roles"]
        }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      is_authenticated: { Args: never; Returns: boolean }
      is_owner: { Args: { p_user_id: string }; Returns: boolean }
      redeem_code: { Args: { p_code: string }; Returns: Json }
      rpc_response: {
        Args: {
          p_code?: string
          p_data?: Json
          p_message?: string
          p_success?: boolean
        }
        Returns: Json
      }
      update_translation_record: {
        Args: { p_translation_record_id: number; p_translations: Json }
        Returns: undefined
      }
    }
    Enums: {
      languages: "en" | "tr" | "th"
      news_status: "draft" | "published" | "archived"
      user_roles: "member" | "moderator" | "admin"
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
  fe_v4: {
    Enums: {
      languages: ["en", "tr", "th"],
      news_status: ["draft", "published", "archived"],
      user_roles: ["member", "moderator", "admin"],
    },
  },
} as const
