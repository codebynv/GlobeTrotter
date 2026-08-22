export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          email: string | null;
          language_preference: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          language_preference?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          language_preference?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      cities: {
        Row: {
          id: string;
          name: string;
          country: string;
          region: string | null;
          description: string | null;
          image_url: string | null;
          cost_index: number;
          popularity_score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          country: string;
          region?: string | null;
          description?: string | null;
          image_url?: string | null;
          cost_index?: number;
          popularity_score?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          country?: string;
          region?: string | null;
          description?: string | null;
          image_url?: string | null;
          cost_index?: number;
          popularity_score?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      trips: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          start_date: string;
          end_date: string;
          cover_image_url: string | null;
          budget: number;
          currency: string;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          start_date: string;
          end_date: string;
          cover_image_url?: string | null;
          budget?: number;
          currency?: string;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          start_date?: string;
          end_date?: string;
          cover_image_url?: string | null;
          budget?: number;
          currency?: string;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'trips_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      trip_stops: {
        Row: {
          id: string;
          trip_id: string;
          city_id: string;
          start_date: string;
          end_date: string;
          stop_order: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          city_id: string;
          start_date: string;
          end_date: string;
          stop_order: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          city_id?: string;
          start_date?: string;
          end_date?: string;
          stop_order?: number;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'trip_stops_trip_id_fkey';
            columns: ['trip_id'];
            referencedRelation: 'trips';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'trip_stops_city_id_fkey';
            columns: ['city_id'];
            referencedRelation: 'cities';
            referencedColumns: ['id'];
          }
        ];
      };
      activities: {
        Row: {
          id: string;
          city_id: string;
          name: string;
          description: string | null;
          category: string;
          estimated_cost: number;
          currency: string;
          duration_minutes: number | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          city_id: string;
          name: string;
          description?: string | null;
          category: string;
          estimated_cost?: number;
          currency?: string;
          duration_minutes?: number | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          city_id?: string;
          name?: string;
          description?: string | null;
          category?: string;
          estimated_cost?: number;
          currency?: string;
          duration_minutes?: number | null;
          image_url?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'activities_city_id_fkey';
            columns: ['city_id'];
            referencedRelation: 'cities';
            referencedColumns: ['id'];
          }
        ];
      };
      trip_activities: {
        Row: {
          id: string;
          trip_stop_id: string;
          activity_id: string | null;
          activity_date: string | null;
          start_time: string | null;
          end_time: string | null;
          activity_order: number;
          notes: string | null;
          actual_cost: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          trip_stop_id: string;
          activity_id?: string | null;
          activity_date?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          activity_order?: number;
          notes?: string | null;
          actual_cost?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          trip_stop_id?: string;
          activity_id?: string | null;
          activity_date?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          activity_order?: number;
          notes?: string | null;
          actual_cost?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'trip_activities_trip_stop_id_fkey';
            columns: ['trip_stop_id'];
            referencedRelation: 'trip_stops';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'trip_activities_activity_id_fkey';
            columns: ['activity_id'];
            referencedRelation: 'activities';
            referencedColumns: ['id'];
          }
        ];
      };
      expenses: {
        Row: {
          id: string;
          trip_id: string;
          category: string;
          amount: number;
          currency: string;
          description: string | null;
          expense_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          category: string;
          amount: number;
          currency?: string;
          description?: string | null;
          expense_date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          category?: string;
          amount?: number;
          currency?: string;
          description?: string | null;
          expense_date?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'expenses_trip_id_fkey';
            columns: ['trip_id'];
            referencedRelation: 'trips';
            referencedColumns: ['id'];
          }
        ];
      };
      trip_shares: {
        Row: {
          id: string;
          trip_id: string;
          share_token: string;
          is_active: boolean;
          created_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          trip_id: string;
          share_token?: string;
          is_active?: boolean;
          created_at?: string;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          trip_id?: string;
          share_token?: string;
          is_active?: boolean;
          created_at?: string;
          expires_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'trip_shares_trip_id_fkey';
            columns: ['trip_id'];
            referencedRelation: 'trips';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
