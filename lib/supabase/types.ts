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
      admin_settings: {
        Row: {
          base_currency: string
          cch_service_fee_usd: number
          clearing_usd: number
          company_name: string
          currencies: Json
          export_license_usd: number
          guangzhou_address: string | null
          id: string
          lagos_address: string | null
          legal_name: string
          operations_email: string | null
          rates_updated_at: string
          shipping_usd: number
          source_to_order_sla_hours: number
          timezone: string
          updated_at: string
          wait_response_timeout_hours: number
          whatsapp_operations_number: string | null
        }
        Insert: {
          base_currency?: string
          cch_service_fee_usd?: number
          clearing_usd?: number
          company_name: string
          currencies?: Json
          export_license_usd?: number
          guangzhou_address?: string | null
          id?: string
          lagos_address?: string | null
          legal_name: string
          operations_email?: string | null
          rates_updated_at?: string
          shipping_usd?: number
          source_to_order_sla_hours?: number
          timezone?: string
          updated_at?: string
          wait_response_timeout_hours?: number
          whatsapp_operations_number?: string | null
        }
        Update: {
          base_currency?: string
          cch_service_fee_usd?: number
          clearing_usd?: number
          company_name?: string
          currencies?: Json
          export_license_usd?: number
          guangzhou_address?: string | null
          id?: string
          lagos_address?: string | null
          legal_name?: string
          operations_email?: string | null
          rates_updated_at?: string
          shipping_usd?: number
          source_to_order_sla_hours?: number
          timezone?: string
          updated_at?: string
          wait_response_timeout_hours?: number
          whatsapp_operations_number?: string | null
        }
        Relationships: []
      }
      brands_sourced: {
        Row: {
          active: boolean
          country: string | null
          created_at: string
          id: string
          logo_url: string | null
          name: string
          order_index: number
        }
        Insert: {
          active?: boolean
          country?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          order_index?: number
        }
        Update: {
          active?: boolean
          country?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          order_index?: number
        }
        Relationships: []
      }
      consultation_requests: {
        Row: {
          buyer_type: string | null
          country: string
          created_at: string
          email: string
          id: string
          ip_address: unknown
          name: string
          notes: string | null
          notification_status: Json
          preferred_time: string | null
          status: string
          topics: string[]
          whatsapp: string
        }
        Insert: {
          buyer_type?: string | null
          country: string
          created_at?: string
          email: string
          id?: string
          ip_address?: unknown
          name: string
          notes?: string | null
          notification_status?: Json
          preferred_time?: string | null
          status?: string
          topics?: string[]
          whatsapp: string
        }
        Update: {
          buyer_type?: string | null
          country?: string
          created_at?: string
          email?: string
          id?: string
          ip_address?: unknown
          name?: string
          notes?: string | null
          notification_status?: Json
          preferred_time?: string | null
          status?: string
          topics?: string[]
          whatsapp?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          battery_health_pct: number | null
          body_type: string | null
          brand: string
          car_code: string | null
          condition: string
          created_at: string
          factory_warranty_months: number | null
          gallery_image_urls: string[]
          hero_image_url: string | null
          id: string
          included_paperwork: string[]
          internal_notes: string | null
          internal_status: string
          mileage_km: number | null
          model: string
          owner_count: number | null
          price_usd_fob: number
          range_km: number | null
          slug: string
          sold_date: string | null
          source_data: Json | null
          source_url: string | null
          spec_sheet_pdf_url: string | null
          status: string
          updated_at: string
          walkaround_video_url: string | null
          week_added: string | null
          year: number
        }
        Insert: {
          battery_health_pct?: number | null
          body_type?: string | null
          brand: string
          car_code?: string | null
          condition: string
          created_at?: string
          factory_warranty_months?: number | null
          gallery_image_urls?: string[]
          hero_image_url?: string | null
          id?: string
          included_paperwork?: string[]
          internal_notes?: string | null
          internal_status?: string
          mileage_km?: number | null
          model: string
          owner_count?: number | null
          price_usd_fob: number
          range_km?: number | null
          slug: string
          sold_date?: string | null
          source_data?: Json | null
          source_url?: string | null
          spec_sheet_pdf_url?: string | null
          status?: string
          updated_at?: string
          walkaround_video_url?: string | null
          week_added?: string | null
          year: number
        }
        Update: {
          battery_health_pct?: number | null
          body_type?: string | null
          brand?: string
          car_code?: string | null
          condition?: string
          created_at?: string
          factory_warranty_months?: number | null
          gallery_image_urls?: string[]
          hero_image_url?: string | null
          id?: string
          included_paperwork?: string[]
          internal_notes?: string | null
          internal_status?: string
          mileage_km?: number | null
          model?: string
          owner_count?: number | null
          price_usd_fob?: number
          range_km?: number | null
          slug?: string
          sold_date?: string | null
          source_data?: Json | null
          source_url?: string | null
          spec_sheet_pdf_url?: string | null
          status?: string
          updated_at?: string
          walkaround_video_url?: string | null
          week_added?: string | null
          year?: number
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount_usd: number
          car_code: string | null
          car_description: string | null
          client_email: string | null
          client_name: string
          created_at: string
          due_at: string | null
          exchange_rate_ngn: number | null
          id: string
          inventory_id: string | null
          invoice_number: string
          issued_at: string
          kind: string
          lead_id: string | null
          notes: string | null
          paid_at: string | null
          parent_invoice_id: string | null
          payment_method: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount_usd: number
          car_code?: string | null
          car_description?: string | null
          client_email?: string | null
          client_name: string
          created_at?: string
          due_at?: string | null
          exchange_rate_ngn?: number | null
          id?: string
          inventory_id?: string | null
          invoice_number: string
          issued_at?: string
          kind?: string
          lead_id?: string | null
          notes?: string | null
          paid_at?: string | null
          parent_invoice_id?: string | null
          payment_method?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount_usd?: number
          car_code?: string | null
          car_description?: string | null
          client_email?: string | null
          client_name?: string
          created_at?: string
          due_at?: string | null
          exchange_rate_ngn?: number | null
          id?: string
          inventory_id?: string | null
          invoice_number?: string
          issued_at?: string
          kind?: string
          lead_id?: string | null
          notes?: string | null
          paid_at?: string | null
          parent_invoice_id?: string | null
          payment_method?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      market_intel_posts: {
        Row: {
          author: string | null
          body_markdown: string
          category: string | null
          cover_image_url: string | null
          created_at: string
          id: string
          preview: string
          published_at: string | null
          read_time_minutes: number | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          body_markdown: string
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          id?: string
          preview: string
          published_at?: string | null
          read_time_minutes?: number | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          body_markdown?: string
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          id?: string
          preview?: string
          published_at?: string | null
          read_time_minutes?: number | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          assigned_to: string | null
          auto_reply_sent_at: string | null
          body_type_preferences: string[]
          budget_max_usd: number | null
          budget_min_usd: number | null
          cch_car_code: string | null
          closed_lost_reason: string | null
          closed_won_inventory_id: string | null
          condition_preference: string | null
          created_at: string
          destination_city: string | null
          destination_country: string | null
          email: string
          id: string
          ip_address: unknown
          name: string
          notes: string | null
          notification_status: Json
          preferred_brand: string | null
          preferred_model: string | null
          reference_image_path: string | null
          screenshot_urls: string[]
          source_deadline: string | null
          status: string
          timeline: string | null
          track: string
          turnstile_verified: boolean
          use_cases: string[]
          wait_response: string
          wait_response_at: string | null
          whatsapp: string
        }
        Insert: {
          assigned_to?: string | null
          auto_reply_sent_at?: string | null
          body_type_preferences?: string[]
          budget_max_usd?: number | null
          budget_min_usd?: number | null
          cch_car_code?: string | null
          closed_lost_reason?: string | null
          closed_won_inventory_id?: string | null
          condition_preference?: string | null
          created_at?: string
          destination_city?: string | null
          destination_country?: string | null
          email: string
          id?: string
          ip_address?: unknown
          name: string
          notes?: string | null
          notification_status?: Json
          preferred_brand?: string | null
          preferred_model?: string | null
          reference_image_path?: string | null
          screenshot_urls?: string[]
          source_deadline?: string | null
          status?: string
          timeline?: string | null
          track?: string
          turnstile_verified?: boolean
          use_cases?: string[]
          wait_response?: string
          wait_response_at?: string | null
          whatsapp: string
        }
        Update: {
          assigned_to?: string | null
          auto_reply_sent_at?: string | null
          body_type_preferences?: string[]
          budget_max_usd?: number | null
          budget_min_usd?: number | null
          cch_car_code?: string | null
          closed_lost_reason?: string | null
          closed_won_inventory_id?: string | null
          condition_preference?: string | null
          created_at?: string
          destination_city?: string | null
          destination_country?: string | null
          email?: string
          id?: string
          ip_address?: unknown
          name?: string
          notes?: string | null
          notification_status?: Json
          preferred_brand?: string | null
          preferred_model?: string | null
          reference_image_path?: string | null
          screenshot_urls?: string[]
          source_deadline?: string | null
          status?: string
          timeline?: string | null
          track?: string
          turnstile_verified?: boolean
          use_cases?: string[]
          wait_response?: string
          wait_response_at?: string | null
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_requests_closed_won_inventory_id_fkey"
            columns: ["closed_won_inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          base_price_usd: number
          car_code: string | null
          car_condition: string
          car_name: string
          car_year: number
          clearing_usd: number | null
          created_at: string
          exchange_rate_ngn: number | null
          id: string
          inventory_id: string | null
          lead_id: string | null
          pdf_url: string | null
          personal_note: string | null
          photo_urls: string[]
          purchase_tax_usd: number
          sent_at: string
          sent_by: string | null
          sent_via: string
          service_fee_usd: number
          shipping_usd: number | null
          status: string
          total_usd: number
          updated_at: string
          valid_until: string
        }
        Insert: {
          base_price_usd: number
          car_code?: string | null
          car_condition: string
          car_name: string
          car_year: number
          clearing_usd?: number | null
          created_at?: string
          exchange_rate_ngn?: number | null
          id?: string
          inventory_id?: string | null
          lead_id?: string | null
          pdf_url?: string | null
          personal_note?: string | null
          photo_urls?: string[]
          purchase_tax_usd?: number
          sent_at?: string
          sent_by?: string | null
          sent_via: string
          service_fee_usd?: number
          shipping_usd?: number | null
          status?: string
          total_usd: number
          updated_at?: string
          valid_until: string
        }
        Update: {
          base_price_usd?: number
          car_code?: string | null
          car_condition?: string
          car_name?: string
          car_year?: number
          clearing_usd?: number | null
          created_at?: string
          exchange_rate_ngn?: number | null
          id?: string
          inventory_id?: string | null
          lead_id?: string | null
          pdf_url?: string | null
          personal_note?: string | null
          photo_urls?: string[]
          purchase_tax_usd?: number
          sent_at?: string
          sent_by?: string | null
          sent_via?: string
          service_fee_usd?: number
          shipping_usd?: number | null
          status?: string
          total_usd?: number
          updated_at?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          bio_long: string | null
          bio_short: string | null
          created_at: string
          displayed_on_homepage: boolean
          id: string
          name: string
          order_index: number
          photo_url: string | null
          role: string
        }
        Insert: {
          bio_long?: string | null
          bio_short?: string | null
          created_at?: string
          displayed_on_homepage?: boolean
          id?: string
          name: string
          order_index?: number
          photo_url?: string | null
          role: string
        }
        Update: {
          bio_long?: string | null
          bio_short?: string | null
          created_at?: string
          displayed_on_homepage?: boolean
          id?: string
          name?: string
          order_index?: number
          photo_url?: string | null
          role?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          client_city: string | null
          client_company: string | null
          client_country: string | null
          client_name: string
          client_title: string | null
          created_at: string
          displayed_on_homepage: boolean
          id: string
          order_index: number
          photo_url: string | null
          quote: string
          vehicle_purchased: string | null
        }
        Insert: {
          client_city?: string | null
          client_company?: string | null
          client_country?: string | null
          client_name: string
          client_title?: string | null
          created_at?: string
          displayed_on_homepage?: boolean
          id?: string
          order_index?: number
          photo_url?: string | null
          quote: string
          vehicle_purchased?: string | null
        }
        Update: {
          client_city?: string | null
          client_company?: string | null
          client_country?: string | null
          client_name?: string
          client_title?: string | null
          created_at?: string
          displayed_on_homepage?: boolean
          id?: string
          order_index?: number
          photo_url?: string | null
          quote?: string
          vehicle_purchased?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
