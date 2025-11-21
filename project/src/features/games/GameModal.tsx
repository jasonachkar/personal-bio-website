'use client';

import { X } from 'lucide-react';
import type { Game } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface GameModalProps {
  game: Game | null;
  onClose: () => void;
}

export function GameModal({ game, onClose }: GameModalProps) {
  return (
    <AnimatePresence>
      {game && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 12, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 26 }}
            className="relative w-[95%] max-w-5xl overflow-hidden rounded-2xl border border-border bg-background-card shadow-card"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary">{game.difficulty}</p>
                <h3 className="text-lg font-semibold text-text-primary">{game.title}</h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-full border border-border bg-background p-2 text-text-secondary transition hover:border-primary hover:text-primary"
                aria-label="Close game modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="bg-black">
              <iframe
                src={game.playcanvas_url}
                title={game.title}
                className="h-[520px] w-full"
                allow="fullscreen; cross-origin-isolated"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
