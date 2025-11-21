import { supabase } from '../supabaseClient';
import type { Game } from '@/types';

export async function getGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching games:', error);
    return [];
  }

  return data || [];
}

export async function getGameById(id: string): Promise<Game | null> {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching game:', error);
    return null;
  }

  return data;
}

export async function getGamesByDifficulty(
  difficulty: string
): Promise<Game[]> {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('difficulty', difficulty)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching games by difficulty:', error);
    return [];
  }

  return data || [];
}
