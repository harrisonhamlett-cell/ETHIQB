import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          user_type: 'company' | 'advisor' | 'admin';
          company_relationship: string | null;
          invite_status: 'pending' | 'accepted';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          user_type: 'company' | 'advisor' | 'admin';
          company_relationship?: string | null;
          invite_status?: 'pending' | 'accepted';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          user_type?: 'company' | 'advisor' | 'admin';
          company_relationship?: string | null;
          invite_status?: 'pending' | 'accepted';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
