// Core entity types matching Supabase schema

export interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string;
  tech_stack: string[];
  created_at?: string;
}

export interface Project {
  id: string;
  name: string;
  short_description: string;
  long_description: string;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  thumbnail_url: string | null;
  category: 'cybersecurity' | 'software' | 'game' | 'other';
  featured?: boolean;
  created_at?: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  playcanvas_url: string;
  thumbnail_url: string | null;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  tags: string[];
  created_at?: string;
}

export type LinkType =
  | 'github'
  | 'linkedin'
  | 'email'
  | 'resume_download'
  | 'resume_preview'
  | 'twitter'
  | 'discord';

export interface Link {
  id: string;
  type: LinkType;
  url: string;
  label: string;
  icon_name: string;
  order?: number;
}

export interface ProfileData {
  id: string;
  name: string;
  tagline: string;
  bio: string;
  avatar_url?: string;
}

// UI-specific types

export interface SkillCategory {
  name: string;
  skills: string[];
  icon?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
