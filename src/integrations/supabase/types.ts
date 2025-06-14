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
      analytics_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json
          revenue: number | null
          service_type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json
          revenue?: number | null
          service_type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json
          revenue?: number | null
          service_type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      api_credentials: {
        Row: {
          additional_config: Json | null
          api_key_encrypted: string | null
          api_secret_encrypted: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          service_name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          additional_config?: Json | null
          api_key_encrypted?: string | null
          api_secret_encrypted?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          service_name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          additional_config?: Json | null
          api_key_encrypted?: string | null
          api_secret_encrypted?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          service_name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          api_key: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          key_name: string
          last_used_at: string | null
          permissions: Json
          rate_limit: number
          user_id: string
        }
        Insert: {
          api_key: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_name: string
          last_used_at?: string | null
          permissions?: Json
          rate_limit?: number
          user_id: string
        }
        Update: {
          api_key?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_name?: string
          last_used_at?: string | null
          permissions?: Json
          rate_limit?: number
          user_id?: string
        }
        Relationships: []
      }
      api_usage: {
        Row: {
          api_key_id: string
          created_at: string
          endpoint: string
          id: string
          method: string
          response_time_ms: number | null
          status_code: number
        }
        Insert: {
          api_key_id: string
          created_at?: string
          endpoint: string
          id?: string
          method: string
          response_time_ms?: number | null
          status_code: number
        }
        Update: {
          api_key_id?: string
          created_at?: string
          endpoint?: string
          id?: string
          method?: string
          response_time_ms?: number | null
          status_code?: number
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
          session_id: string | null
          severity: string | null
          status: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          session_id?: string | null
          severity?: string | null
          status?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          session_id?: string | null
          severity?: string | null
          status?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          content: string
          cost: number | null
          created_at: string | null
          delivered_count: number | null
          failed_count: number | null
          id: string
          metadata: Json | null
          name: string
          recipient_count: number | null
          scheduled_at: string | null
          sent_at: string | null
          sent_count: number | null
          status: string | null
          subject: string | null
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          cost?: number | null
          created_at?: string | null
          delivered_count?: number | null
          failed_count?: number | null
          id?: string
          metadata?: Json | null
          name: string
          recipient_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          sent_count?: number | null
          status?: string | null
          subject?: string | null
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          cost?: number | null
          created_at?: string | null
          delivered_count?: number | null
          failed_count?: number | null
          id?: string
          metadata?: Json | null
          name?: string
          recipient_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          sent_count?: number | null
          status?: string | null
          subject?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          created_at: string | null
          custom_fields: Json | null
          email: string | null
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          phone: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          custom_fields?: Json | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          custom_fields?: Json | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          reference_id: string | null
          transaction_type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          transaction_type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          transaction_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      mspace_pesa_integrations: {
        Row: {
          callback_response_type: string | null
          callback_url: string
          created_at: string | null
          current_balance: number | null
          id: string
          last_balance_update: string | null
          paybill_number: string
          status: string | null
          subscription_id: string | null
          till_number: string | null
        }
        Insert: {
          callback_response_type?: string | null
          callback_url: string
          created_at?: string | null
          current_balance?: number | null
          id?: string
          last_balance_update?: string | null
          paybill_number: string
          status?: string | null
          subscription_id?: string | null
          till_number?: string | null
        }
        Update: {
          callback_response_type?: string | null
          callback_url?: string
          created_at?: string | null
          current_balance?: number | null
          id?: string
          last_balance_update?: string | null
          paybill_number?: string
          status?: string | null
          subscription_id?: string | null
          till_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mspace_pesa_integrations_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_service_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      mspace_users: {
        Row: {
          balance: number | null
          client_name: string
          created_date: string | null
          email: string | null
          fetched_at: string | null
          id: string
          last_login: string | null
          mspace_client_id: string
          phone: string | null
          status: string | null
          updated_at: string | null
          user_type: string | null
          username: string | null
        }
        Insert: {
          balance?: number | null
          client_name: string
          created_date?: string | null
          email?: string | null
          fetched_at?: string | null
          id?: string
          last_login?: string | null
          mspace_client_id: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_type?: string | null
          username?: string | null
        }
        Update: {
          balance?: number | null
          client_name?: string
          created_date?: string | null
          email?: string | null
          fetched_at?: string | null
          id?: string
          last_login?: string | null
          mspace_client_id?: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_type?: string | null
          username?: string | null
        }
        Relationships: []
      }
      mspace_ussd_applications: {
        Row: {
          callback_url: string
          created_at: string | null
          id: string
          menu_structure: Json
          monthly_fee: number | null
          mspace_application_id: string | null
          service_code: string
          setup_fee: number | null
          status: string | null
          subscription_id: string | null
        }
        Insert: {
          callback_url: string
          created_at?: string | null
          id?: string
          menu_structure: Json
          monthly_fee?: number | null
          mspace_application_id?: string | null
          service_code: string
          setup_fee?: number | null
          status?: string | null
          subscription_id?: string | null
        }
        Update: {
          callback_url?: string
          created_at?: string | null
          id?: string
          menu_structure?: Json
          monthly_fee?: number | null
          mspace_application_id?: string | null
          service_code?: string
          setup_fee?: number | null
          status?: string | null
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mspace_ussd_applications_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_service_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          failed_login_attempts: number | null
          first_name: string | null
          id: string
          last_name: string | null
          last_password_change: string | null
          locked_until: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          failed_login_attempts?: number | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          last_password_change?: string | null
          locked_until?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          failed_login_attempts?: number | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          last_password_change?: string | null
          locked_until?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      reward_campaigns: {
        Row: {
          amount: number
          budget: number
          created_at: string
          criteria: Json
          id: string
          name: string
          reward_type: string
          spent: number
          status: string
          successful_distributions: number
          total_recipients: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          budget: number
          created_at?: string
          criteria?: Json
          id?: string
          name: string
          reward_type: string
          spent?: number
          status?: string
          successful_distributions?: number
          total_recipients?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          budget?: number
          created_at?: string
          criteria?: Json
          id?: string
          name?: string
          reward_type?: string
          spent?: number
          status?: string
          successful_distributions?: number
          total_recipients?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reward_distributions: {
        Row: {
          amount: number
          campaign_id: string
          created_at: string
          distributed_at: string | null
          error_message: string | null
          id: string
          provider_reference: string | null
          recipient_phone: string
          reward_type: string
          status: string
        }
        Insert: {
          amount: number
          campaign_id: string
          created_at?: string
          distributed_at?: string | null
          error_message?: string | null
          id?: string
          provider_reference?: string | null
          recipient_phone: string
          reward_type: string
          status?: string
        }
        Update: {
          amount?: number
          campaign_id?: string
          created_at?: string
          distributed_at?: string | null
          error_message?: string | null
          id?: string
          provider_reference?: string | null
          recipient_phone?: string
          reward_type?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_distributions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "reward_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_system_role: boolean | null
          name: string
          permissions: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_system_role?: boolean | null
          name: string
          permissions?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_system_role?: boolean | null
          name?: string
          permissions?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string | null
          details: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      service_desk_subscriptions: {
        Row: {
          created_at: string | null
          current_users: number | null
          id: string
          max_users: number | null
          monthly_fee_per_user: number | null
          status: string | null
          subscription_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_users?: number | null
          id?: string
          max_users?: number | null
          monthly_fee_per_user?: number | null
          status?: string | null
          subscription_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_users?: number | null
          id?: string
          max_users?: number | null
          monthly_fee_per_user?: number | null
          status?: string | null
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_desk_subscriptions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_service_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      service_desk_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string
          created_by: string
          customer_email: string | null
          customer_phone: string | null
          description: string
          id: string
          priority: string
          resolved_at: string | null
          sla_due_at: string | null
          status: string
          subscription_id: string
          ticket_number: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          created_by: string
          customer_email?: string | null
          customer_phone?: string | null
          description: string
          id?: string
          priority?: string
          resolved_at?: string | null
          sla_due_at?: string | null
          status?: string
          subscription_id: string
          ticket_number: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string
          customer_email?: string | null
          customer_phone?: string | null
          description?: string
          id?: string
          priority?: string
          resolved_at?: string | null
          sla_due_at?: string | null
          status?: string
          subscription_id?: string
          ticket_number?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_desk_tickets_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "service_desk_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          base_price: number | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          is_premium: boolean | null
          name: string
          pricing_model: string | null
          route: string | null
          setup_fee: number | null
        }
        Insert: {
          base_price?: number | null
          description?: string | null
          icon?: string | null
          id: string
          is_active?: boolean | null
          is_premium?: boolean | null
          name: string
          pricing_model?: string | null
          route?: string | null
          setup_fee?: number | null
        }
        Update: {
          base_price?: number | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          name?: string
          pricing_model?: string | null
          route?: string | null
          setup_fee?: number | null
        }
        Relationships: []
      }
      services_catalog: {
        Row: {
          configuration_schema: Json | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_premium: boolean | null
          monthly_fee: number | null
          provider: string | null
          service_name: string
          service_type: string
          setup_fee: number | null
          transaction_fee_amount: number | null
          transaction_fee_type: string | null
        }
        Insert: {
          configuration_schema?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          monthly_fee?: number | null
          provider?: string | null
          service_name: string
          service_type: string
          setup_fee?: number | null
          transaction_fee_amount?: number | null
          transaction_fee_type?: string | null
        }
        Update: {
          configuration_schema?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          monthly_fee?: number | null
          provider?: string | null
          service_name?: string
          service_type?: string
          setup_fee?: number | null
          transaction_fee_amount?: number | null
          transaction_fee_type?: string | null
        }
        Relationships: []
      }
      short_code_subscriptions: {
        Row: {
          activated_at: string | null
          code: string
          created_at: string | null
          id: string
          monthly_fee: number | null
          network: string
          setup_fee: number | null
          status: string | null
          subscription_id: string | null
          type: string | null
        }
        Insert: {
          activated_at?: string | null
          code: string
          created_at?: string | null
          id?: string
          monthly_fee?: number | null
          network: string
          setup_fee?: number | null
          status?: string | null
          subscription_id?: string | null
          type?: string | null
        }
        Update: {
          activated_at?: string | null
          code?: string
          created_at?: string | null
          id?: string
          monthly_fee?: number | null
          network?: string
          setup_fee?: number | null
          status?: string | null
          subscription_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "short_code_subscriptions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_service_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_survey_subscriptions: {
        Row: {
          created_at: string | null
          current_responses: number | null
          id: string
          monthly_fee: number | null
          response_limit: number | null
          setup_fee: number | null
          status: string | null
          subscription_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_responses?: number | null
          id?: string
          monthly_fee?: number | null
          response_limit?: number | null
          setup_fee?: number | null
          status?: string | null
          subscription_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_responses?: number | null
          id?: string
          monthly_fee?: number | null
          response_limit?: number | null
          setup_fee?: number | null
          status?: string | null
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sms_survey_subscriptions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_service_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_responses: {
        Row: {
          completed: boolean
          completed_at: string | null
          id: string
          ip_address: unknown | null
          respondent_phone: string
          responses: Json
          started_at: string
          survey_id: string
          user_agent: string | null
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          ip_address?: unknown | null
          respondent_phone: string
          responses?: Json
          started_at?: string
          survey_id: string
          user_agent?: string | null
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          ip_address?: unknown | null
          respondent_phone?: string
          responses?: Json
          started_at?: string
          survey_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      surveys: {
        Row: {
          created_at: string
          description: string | null
          distribution_channels: Json | null
          expires_at: string | null
          id: string
          published_at: string | null
          question_flow: Json
          status: string
          target_audience: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          distribution_channels?: Json | null
          expires_at?: string | null
          id?: string
          published_at?: string | null
          question_flow?: Json
          status?: string
          target_audience?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          distribution_channels?: Json | null
          expires_at?: string | null
          id?: string
          published_at?: string | null
          question_flow?: Json
          status?: string
          target_audience?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      system_audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ticket_activities: {
        Row: {
          activity_type: string
          content: string | null
          created_at: string
          id: string
          metadata: Json | null
          ticket_id: string
          user_id: string
        }
        Insert: {
          activity_type: string
          content?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          ticket_id: string
          user_id: string
        }
        Update: {
          activity_type?: string
          content?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_activities_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "service_desk_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credits: {
        Row: {
          created_at: string | null
          credits_purchased: number | null
          credits_remaining: number | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          credits_purchased?: number | null
          credits_remaining?: number | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          credits_purchased?: number | null
          credits_remaining?: number | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role_id: string | null
          user_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role_id?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_service_subscriptions: {
        Row: {
          activated_at: string | null
          configuration: Json | null
          created_at: string | null
          expires_at: string | null
          id: string
          monthly_billing_active: boolean | null
          service_id: string | null
          setup_fee_paid: boolean | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          activated_at?: string | null
          configuration?: Json | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          monthly_billing_active?: boolean | null
          service_id?: string | null
          setup_fee_paid?: boolean | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          activated_at?: string | null
          configuration?: Json | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          monthly_billing_active?: boolean | null
          service_id?: string | null
          setup_fee_paid?: boolean | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_service_subscriptions_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      user_services: {
        Row: {
          activated_at: string | null
          id: string
          is_enabled: boolean | null
          service_id: string | null
          subscription_tier: string | null
          user_id: string | null
        }
        Insert: {
          activated_at?: string | null
          id: string
          is_enabled?: boolean | null
          service_id?: string | null
          subscription_tier?: string | null
          user_id?: string | null
        }
        Update: {
          activated_at?: string | null
          id?: string
          is_enabled?: boolean | null
          service_id?: string | null
          subscription_tier?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_services_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_types: {
        Row: {
          created_at: string | null
          id: string
          source: string
          updated_at: string | null
          user_id: string | null
          user_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          source: string
          updated_at?: string | null
          user_id?: string | null
          user_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          source?: string
          updated_at?: string | null
          user_id?: string | null
          user_type?: string
        }
        Relationships: []
      }
      ussd_sessions: {
        Row: {
          application_id: string | null
          created_at: string | null
          current_node_id: string
          id: string
          input_path: string[] | null
          navigation_path: string[] | null
          phone_number: string
          session_id: string
          updated_at: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          current_node_id: string
          id?: string
          input_path?: string[] | null
          navigation_path?: string[] | null
          phone_number: string
          session_id: string
          updated_at?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          current_node_id?: string
          id?: string
          input_path?: string[] | null
          navigation_path?: string[] | null
          phone_number?: string
          session_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ussd_sessions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "mspace_ussd_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          content: string
          created_at: string
          delivered_at: string | null
          failed_reason: string | null
          id: string
          message_type: string
          read_at: string | null
          recipient_phone: string
          sent_at: string | null
          status: string
          subscription_id: string | null
          template_components: Json | null
          template_language: string | null
          template_name: string | null
          updated_at: string
          whatsapp_message_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          delivered_at?: string | null
          failed_reason?: string | null
          id?: string
          message_type?: string
          read_at?: string | null
          recipient_phone: string
          sent_at?: string | null
          status?: string
          subscription_id?: string | null
          template_components?: Json | null
          template_language?: string | null
          template_name?: string | null
          updated_at?: string
          whatsapp_message_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          delivered_at?: string | null
          failed_reason?: string | null
          id?: string
          message_type?: string
          read_at?: string | null
          recipient_phone?: string
          sent_at?: string | null
          status?: string
          subscription_id?: string | null
          template_components?: Json | null
          template_language?: string | null
          template_name?: string | null
          updated_at?: string
          whatsapp_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_subscriptions: {
        Row: {
          access_token_encrypted: string
          business_account_id: string
          created_at: string | null
          current_messages: number | null
          id: string
          message_limit: number | null
          phone_number_id: string
          status: string | null
          subscription_id: string | null
          verify_token: string
          webhook_url: string
        }
        Insert: {
          access_token_encrypted: string
          business_account_id: string
          created_at?: string | null
          current_messages?: number | null
          id?: string
          message_limit?: number | null
          phone_number_id: string
          status?: string | null
          subscription_id?: string | null
          verify_token: string
          webhook_url: string
        }
        Update: {
          access_token_encrypted?: string
          business_account_id?: string
          created_at?: string | null
          current_messages?: number | null
          id?: string
          message_limit?: number | null
          phone_number_id?: string
          status?: string | null
          subscription_id?: string | null
          verify_token?: string
          webhook_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_subscriptions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_service_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_templates: {
        Row: {
          body_text: string
          buttons: Json | null
          category: string
          created_at: string
          footer_text: string | null
          header_text: string | null
          header_type: string | null
          id: string
          language: string
          name: string
          status: string
          subscription_id: string | null
          updated_at: string
          variables: Json | null
          whatsapp_template_id: string | null
        }
        Insert: {
          body_text: string
          buttons?: Json | null
          category?: string
          created_at?: string
          footer_text?: string | null
          header_text?: string | null
          header_type?: string | null
          id?: string
          language?: string
          name: string
          status?: string
          subscription_id?: string | null
          updated_at?: string
          variables?: Json | null
          whatsapp_template_id?: string | null
        }
        Update: {
          body_text?: string
          buttons?: Json | null
          category?: string
          created_at?: string
          footer_text?: string | null
          header_text?: string | null
          header_type?: string | null
          id?: string
          language?: string
          name?: string
          status?: string
          subscription_id?: string | null
          updated_at?: string
          variables?: Json | null
          whatsapp_template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_templates_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_ticket_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      log_analytics_event: {
        Args: {
          p_event_type: string
          p_service_type?: string
          p_metadata?: Json
          p_revenue?: number
        }
        Returns: string
      }
      log_audit_event: {
        Args: {
          p_action: string
          p_table_name?: string
          p_record_id?: string
          p_old_data?: Json
          p_new_data?: Json
        }
        Returns: string
      }
      log_security_event: {
        Args: { p_event_type: string; p_severity?: string; p_details?: Json }
        Returns: string
      }
      sync_existing_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          synced_count: number
          error_count: number
        }[]
      }
    }
    Enums: {
      user_role: "super_admin" | "admin" | "manager" | "user"
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
    Enums: {
      user_role: ["super_admin", "admin", "manager", "user"],
    },
  },
} as const
