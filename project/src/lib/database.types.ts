export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profile_content: {
        Row: {
          id: string
          full_name: string
          title: string
          description: string
          phone: string | null
          email: string | null
          location: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          title: string
          description: string
          phone?: string | null
          email?: string | null
          location?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          title?: string
          description?: string
          phone?: string | null
          email?: string | null
          location?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      experience: {
        Row: {
          id: string
          company: string
          role: string
          period: string
          location: string
          description: Json
          order_num: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company: string
          role: string
          period: string
          location: string
          description: Json
          order_num: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company?: string
          role?: string
          period?: string
          location?: string
          description?: Json
          order_num?: number
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          type: string
          description: string
          details: Json
          technologies: Json
          status: string
          order_num: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          type: string
          description: string
          details: Json
          technologies: Json
          status: string
          order_num: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          type?: string
          description?: string
          details?: Json
          technologies?: Json
          status?: string
          order_num?: number
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          category: string
          name: string
          details: string
          order_num: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category: string
          name: string
          details: string
          order_num: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?: string
          name?: string
          details?: string
          order_num?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}