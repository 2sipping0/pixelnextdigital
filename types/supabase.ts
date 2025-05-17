export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: number
          created_at: string
          order_id: string
          business_name: string
          email: string
          phone: string
          website_details: string
          selected_plan: string
          payment_method: string
          order_date: string
          total_amount: string
          status: string
        }
        Insert: {
          id?: number
          created_at?: string
          order_id: string
          business_name: string
          email: string
          phone: string
          website_details: string
          selected_plan: string
          payment_method: string
          order_date: string
          total_amount: string
          status: string
        }
        Update: {
          id?: number
          created_at?: string
          order_id?: string
          business_name?: string
          email?: string
          phone?: string
          website_details?: string
          selected_plan?: string
          payment_method?: string
          order_date?: string
          total_amount?: string
          status?: string
        }
      }
      social_media: {
        Row: {
          id: number
          created_at: string
          order_id: number
          facebook: string
          instagram: string
          twitter: string
        }
        Insert: {
          id?: number
          created_at?: string
          order_id: number
          facebook: string
          instagram: string
          twitter: string
        }
        Update: {
          id?: number
          created_at?: string
          order_id?: number
          facebook?: string
          instagram?: string
          twitter?: string
        }
      }
      payments: {
        Row: {
          id: number
          created_at: string
          order_id: string
          payment_method: string
          payment_id: string
          amount: string
          currency: string
          status: string
          metadata: Json
        }
        Insert: {
          id?: number
          created_at?: string
          order_id: string
          payment_method: string
          payment_id: string
          amount: string
          currency: string
          status: string
          metadata: Json
        }
        Update: {
          id?: number
          created_at?: string
          order_id?: string
          payment_method?: string
          payment_id?: string
          amount?: string
          currency?: string
          status?: string
          metadata?: Json
        }
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
  }
}
