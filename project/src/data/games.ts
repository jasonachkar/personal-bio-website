import type { Game } from './types';

export const games: Game[] = [
  {
    id: 'neon-strike',
    title: 'Neon Strike Ops',
    description:
      'Sprint through a synth city, breach terminals, and dodge countermeasures. Built with PlayCanvas and tuned for mobile.',
    url: 'https://playcanv.as/p/your-game-1',
    thumbnail: '/thumbnails/neon-strike.jpg',
    difficulty: 'Intermediate',
    tags: ['PlayCanvas', 'Runner', 'Input tuning'],
  },
  {
    id: 'grid-siege',
    title: 'Grid Siege',
    description:
      'Tower defense prototype with EMP towers and wave briefings. React Three Fiber UI overlays on top of PlayCanvas renderer.',
    url: 'https://playcanv.as/p/your-game-2',
    thumbnail: '/thumbnails/grid-siege.jpg',
    difficulty: 'Advanced',
    tags: ['Tower defense', 'WebGL', 'R3F UI'],
  },
  {
    id: 'att&ck-sim',
    title: 'ATT&CK Simulator',
    description:
      'Mini-sim where players chain exploits to pivot across nodes. Features terminal overlays and a replay camera.',
    url: 'https://playcanv.as/p/your-game-3',
    thumbnail: '/thumbnails/attack-sim.jpg',
    difficulty: 'Beginner',
    tags: ['Simulation', 'Cyber puzzles', 'PlayCanvas'],
  },
];
