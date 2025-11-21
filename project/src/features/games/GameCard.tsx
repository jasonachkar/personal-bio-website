'use client';

import { motion } from 'framer-motion';
import type { Game } from '@/types';
import Badge from '@/components/ui/Badge';

interface GameCardProps {
  game: Game;
  onSelect: (game: Game) => void;
}

export function GameCard({ game, onSelect }: GameCardProps) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onSelect(game)}
      className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-background-card text-left shadow-card transition hover:border-primary hover:shadow-card-hover"
    >
      <div className="relative aspect-video overflow-hidden">
        {game.thumbnail_url ? (
          <img
            src={game.thumbnail_url}
            alt={game.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/15 via-primary-purple/15 to-background-elevated text-text-secondary">
            No thumbnail
          </div>
        )}
        <div className="absolute left-3 top-3 rounded-full bg-background/80 px-3 py-1 text-xs text-primary backdrop-blur">
          {game.difficulty}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-text-primary">{game.title}</h3>
        </div>
        <p className="text-sm text-text-secondary">{game.description}</p>
        <div className="flex flex-wrap gap-2">
          {game.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} label={tag} />
          ))}
        </div>
      </div>
    </motion.button>
  );
}
