import { supabase } from '../supabaseClient';
import type { Experience } from '@/types';

export async function getExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }

  return data || [];
}

export async function getExperienceById(id: string): Promise<Experience | null> {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching experience:', error);
    return null;
  }

  return data;
}
