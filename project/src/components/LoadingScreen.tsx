import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Matrix rain effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = '0123456789ABCDEF';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-[#0a0a0a] z-[100] flex items-center justify-center overflow-hidden"
    >
      {/* Matrix canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-15"
      />

      {/* Loading indicator */}
      <div className="relative z-10">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-black/40 backdrop-blur-sm rounded-xl border border-green-500/20 shadow-[0_0_50px_rgba(0,255,0,0.15)] p-8 flex flex-col items-center"
        >
          <Terminal className="w-8 h-8 text-green-500 mb-4 animate-pulse" />
          <div className="h-2 w-32 bg-green-500/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500/50 via-green-500 to-green-500/50"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: "linear",
              }}
            />
          </div>
          <p className="text-green-400 font-mono mt-4 text-sm">Loading secure environment...</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen; 