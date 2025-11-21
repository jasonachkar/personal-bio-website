'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Game } from '@/types';
import { GameCard } from './GameCard';
import { GameModal } from './GameModal';
import { cn } from '@/lib/cn';

interface GameHubProps {
  games: Game[];
}

const difficulties: Array<Game['difficulty']> = ['Easy', 'Medium', 'Hard', 'Expert'];

export function GameHub({ games }: GameHubProps) {
  const [activeDifficulty, setActiveDifficulty] = useState<Game['difficulty'] | 'all'>('all');
  const [selected, setSelected] = useState<Game | null>(null);

  const filteredGames = useMemo(
    () =>
      activeDifficulty === 'all'
        ? games
        : games.filter((game) => game.difficulty === activeDifficulty),
    [games, activeDifficulty]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          className={cn(
            'rounded-full border px-4 py-2 text-sm',
            activeDifficulty === 'all'
              ? 'border-primary bg-primary/15 text-primary shadow-glow'
              : 'border-border bg-background text-text-secondary hover:border-primary hover:text-primary'
          )}
          onClick={() => setActiveDifficulty('all')}
        >
          All difficulties
        </button>
        {difficulties.map((diff) => (
          <button
            key={diff}
            className={cn(
              'rounded-full border px-4 py-2 text-sm',
              activeDifficulty === diff
                ? 'border-primary bg-primary/15 text-primary shadow-glow'
                : 'border-border bg-background text-text-secondary hover:border-primary hover:text-primary'
            )}
            onClick={() => setActiveDifficulty(diff)}
          >
            {diff}
          </button>
        ))}
      </div>

      {filteredGames.length === 0 ? (
        <div className="rounded-xl border border-border bg-background-card p-10 text-center text-text-secondary">
          No games available. Add entries to the Supabase `games` table.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredGames.map((game, idx) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <GameCard game={game} onSelect={setSelected} />
            </motion.div>
          ))}
        </div>
      )}

      <GameModal game={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
