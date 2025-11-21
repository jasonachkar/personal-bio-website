import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { games } from '../../data/games';
import Section from '../layout/Section';
import SectionHeader from '../ui/SectionHeader';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Button } from '../ui/Button';
import SeverityPill from '../ui/SeverityPill';

const difficultySeverity: Record<'Beginner' | 'Intermediate' | 'Advanced', 'low' | 'medium' | 'high'> = {
  Beginner: 'low',
  Intermediate: 'medium',
  Advanced: 'high',
};

const GameHub = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const active = games.find((g) => g.id === selectedGame);

  return (
    <Section id="games">
      <SectionHeader
        eyebrow="Cyber Arcade"
        title="PlayCanvas-powered cyber game hub."
        subtitle="Pick a build, launch the embedded session, and jump into a neon cyber range."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {games.map((game) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="flex h-full flex-col gap-3">
              <div
                className="relative h-40 overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-accent/10 to-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(124,255,228,0.1), rgba(161,102,255,0.1)), url(${game.thumbnail})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute left-3 top-3">
                  <SeverityPill severity={difficultySeverity[game.difficulty]} />
                </div>
              </div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary">{game.difficulty}</p>
                  <h3 className="text-lg text-white">{game.title}</h3>
                </div>
              </div>
              <p className="text-sm text-slate-300">{game.description}</p>
              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag) => (
                  <Badge key={tag} label={tag} />
                ))}
              </div>
              <Button variant="primary" onClick={() => setSelectedGame(game.id)}>
                Launch build
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.96, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 12, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-surface p-4 shadow-card"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary">{active.difficulty}</p>
                  <h3 className="text-lg text-white">{active.title}</h3>
                </div>
                <Button variant="ghost" onClick={() => setSelectedGame(null)}>
                  Close
                </Button>
              </div>
              <div className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-black">
                <iframe
                  title={active.title}
                  src={active.url}
                  className="h-[480px] w-full"
                  allow="fullscreen; cross-origin-isolated"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};

export default GameHub;
