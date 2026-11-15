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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      bundles: {
        Row: {
          badge: string | null
          compare_at_price: number | null
          created_at: string
          free_delivery: boolean
          id: string
          is_active: boolean
          name: string
          pieces: number
          price: number
          sort_order: number
          tagline: string | null
          updated_at: string
        }
        Insert: {
          badge?: string | null
          compare_at_price?: number | null
          created_at?: string
          free_delivery?: boolean
          id?: string
          is_active?: boolean
          name: string
          pieces: number
          price: number
          sort_order?: number
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          badge?: string | null
          compare_at_price?: number | null
          created_at?: string
          free_delivery?: boolean
          id?: string
          is_active?: boolean
          name?: string
          pieces?: number
          price?: number
          sort_order?: number
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      order_events: {
        Row: {
          created_at: string
          id: string
          note: string | null
          order_id: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          order_id: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          order_id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          admin_note: string | null
          bundle_id: string | null
          bundle_name: string
          bundle_pieces: number
          city: string
          created_at: string
          customer_name: string
          delivery_fee: number
          easypaisa_sender_number: string | null
          easypaisa_txn_id: string | null
          email: string | null
          id: string
          notes: string | null
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_proof_path: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          phone: string
          quantity: number
          status: Database["public"]["Enums"]["order_status"]
          stock_restored: boolean
          subtotal: number
          total: number
          total_pieces: number
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          address: string
          admin_note?: string | null
          bundle_id?: string | null
          bundle_name: string
          bundle_pieces: number
          city: string
          created_at?: string
          customer_name: string
          delivery_fee?: number
          easypaisa_sender_number?: string | null
          easypaisa_txn_id?: string | null
          email?: string | null
          id?: string
          notes?: string | null
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_proof_path?: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          phone: string
          quantity: number
          status?: Database["public"]["Enums"]["order_status"]
          stock_restored?: boolean
          subtotal: number
          total: number
          total_pieces: number
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          admin_note?: string | null
          bundle_id?: string | null
          bundle_name?: string
          bundle_pieces?: number
          city?: string
          created_at?: string
          customer_name?: string
          delivery_fee?: number
          easypaisa_sender_number?: string | null
          easypaisa_txn_id?: string | null
          email?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_proof_path?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone?: string
          quantity?: number
          status?: Database["public"]["Enums"]["order_status"]
          stock_restored?: boolean
          subtotal?: number
          total?: number
          total_pieces?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
        ]
      }
      store_settings: {
        Row: {
          cod_delivery_fee: number
          delivery_fee: number
          easypaisa_account_name: string
          easypaisa_delivery_fee: number
          easypaisa_number: string
          id: number
          low_stock_threshold: number
          stock_count: number
          support_whatsapp: string
          updated_at: string
        }
        Insert: {
          cod_delivery_fee?: number
          delivery_fee?: number
          easypaisa_account_name?: string
          easypaisa_delivery_fee?: number
          easypaisa_number?: string
          id?: number
          low_stock_threshold?: number
          stock_count?: number
          support_whatsapp?: string
          updated_at?: string
        }
        Update: {
          cod_delivery_fee?: number
          delivery_fee?: number
          easypaisa_account_name?: string
          easypaisa_delivery_fee?: number
          easypaisa_number?: string
          id?: number
          low_stock_threshold?: number
          stock_count?: number
          support_whatsapp?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      place_order: {
        Args: {
          _address: string
          _bundle_id: string
          _city: string
          _customer_name: string
          _email: string
          _notes: string
          _payment_method: Database["public"]["Enums"]["payment_method"]
          _phone: string
          _proof_path: string
          _quantity: number
          _sender_number: string
          _txn_id: string
        }
        Returns: {
          order_number: string
          total: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
      order_status:
        | "pending"
        | "confirmed"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
      payment_method: "cod" | "easypaisa"
      payment_status:
        | "not_required"
        | "pending_verification"
        | "verified"
        | "rejected"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "user"],
      order_status: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      payment_method: ["cod", "easypaisa"],
      payment_status: [
        "not_required",
        "pending_verification",
        "verified",
        "rejected",
      ],
    },
  },
} as const
