// Path: src\types\supabase.ts
export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          category: string;
          created_at: string | null;
          description: string;
          id: number;
          image_url: string;
          name: string;
          price: string;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          description: string;
          id?: number;
          image_url: string;
          name: string;
          price: string;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          description?: string;
          id?: number;
          image_url?: string;
          name?: string;
          price?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: number;
          user_id: string;
          total_amount: number;
          status: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          total_amount: number;
          status: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          total_amount?: number;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        // Add the profiles table here
        Row: {
          id: string;
          full_name: string | null;
          username: string | null;
          website: string | null;
          avatar_url: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          username?: string | null;
          website?: string | null;
          avatar_url?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          username?: string | null;
          website?: string | null;
          avatar_url?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: JSON;
          extensions?: JSON;
        };
        Returns: JSON;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
