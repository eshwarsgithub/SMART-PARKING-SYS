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
      booking_events: {
        Row: {
          booking_id: string
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          new_status: string | null
          old_status: string | null
        }
        Insert: {
          booking_id: string
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          new_status?: string | null
          old_status?: string | null
        }
        Update: {
          booking_id?: string
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          new_status?: string | null
          old_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_events_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          created_at: string
          duration_minutes: number | null
          ends_at: string
          id: string
          lot_id: string
          notes: string | null
          spot_id: string
          starts_at: string
          status: string
          total_amount: number
          updated_at: string
          user_id: string | null
          vehicle_plate: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          ends_at: string
          id?: string
          lot_id: string
          notes?: string | null
          spot_id: string
          starts_at: string
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string | null
          vehicle_plate: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          ends_at?: string
          id?: string
          lot_id?: string
          notes?: string | null
          spot_id?: string
          starts_at?: string
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string | null
          vehicle_plate?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "parking_lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "parking_spots"
            referencedColumns: ["id"]
          },
        ]
      }
      parking_lots: {
        Row: {
          address: string
          available_spots: number
          close_time: string
          created_at: string
          id: string
          is_active: boolean
          lat: number
          lng: number
          name: string
          open_time: string
          total_spots: number
          updated_at: string
        }
        Insert: {
          address: string
          available_spots?: number
          close_time?: string
          created_at?: string
          id?: string
          is_active?: boolean
          lat: number
          lng: number
          name: string
          open_time?: string
          total_spots?: number
          updated_at?: string
        }
        Update: {
          address?: string
          available_spots?: number
          close_time?: string
          created_at?: string
          id?: string
          is_active?: boolean
          lat?: number
          lng?: number
          name?: string
          open_time?: string
          total_spots?: number
          updated_at?: string
        }
        Relationships: []
      }
      parking_spots: {
        Row: {
          created_at: string
          floor: number
          id: string
          lot_id: string
          spot_number: string
          spot_type: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          floor?: number
          id?: string
          lot_id: string
          spot_number: string
          spot_type?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          floor?: number
          id?: string
          lot_id?: string
          spot_number?: string
          spot_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "parking_spots_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "parking_lots"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_rules: {
        Row: {
          created_at: string
          id: string
          lot_id: string
          min_duration_minutes: number
          price_per_hour: number
          spot_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          lot_id: string
          min_duration_minutes?: number
          price_per_hour?: number
          spot_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lot_id?: string
          min_duration_minutes?: number
          price_per_hour?: number
          spot_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pricing_rules_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "parking_lots"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string
          updated_at?: string
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

type DefaultSchema = Database["public"]

export type Tables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Row"]

export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"]

export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Update"]
