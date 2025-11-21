import { supabase } from '../supabaseClient';
import type { Link, LinkType } from '@/types';

export async function getLinks(): Promise<Link[]> {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching links:', error);
    return [];
  }

  return data || [];
}

export async function getLinksByType(type: LinkType): Promise<Link[]> {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('type', type)
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching links by type:', error);
    return [];
  }

  return data || [];
}

export async function getSocialLinks(): Promise<Link[]> {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .in('type', ['github', 'linkedin', 'twitter', 'discord'])
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching social links:', error);
    return [];
  }

  return data || [];
}

export async function getResumeLinks(): Promise<Link[]> {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .in('type', ['resume_download', 'resume_preview'])
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching resume links:', error);
    return [];
  }

  return data || [];
}
