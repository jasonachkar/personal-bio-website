import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const isTypingRef = useRef(false);
  
  const lines = [
    "Initializing secure core...",
    "Booting encrypted environment...",
    "Establishing encrypted connection...",
    "Loading advanced security protocols...",
    "Deploying firewall defenses...",
    "Activating intrusion detection systems...",
    "Calibrating threat sensors...",
    "Running vulnerability scans...",
    "Encrypting data streams...",
    "Accessing threat intelligence network...",
    "Locking down perimeter...",
    "System integrity check complete...",
    "Welcome to the hacker dungeon..."
  ];

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

  // Typing effect
  useEffect(() => {
    if (isTypingRef.current) return; // Prevent multiple runs
    isTypingRef.current = true;

    const timeoutIds: NodeJS.Timeout[] = [];
    let isMounted = true;

    const typeNextLine = (index: number) => {
      if (!isMounted) return;
      
      if (index < lines.length) {
        const timeout = setTimeout(() => {
          if (!isMounted) return;
          setDisplayedLines(prev => [...prev, lines[index]]);
          
          if (index + 1 < lines.length) {
            typeNextLine(index + 1);
          } else {
            // When all lines are typed, wait a bit and trigger onComplete
            const finalTimeout = setTimeout(() => {
              if (isMounted) {
                onComplete();
              }
            }, 1000);
            timeoutIds.push(finalTimeout);
          }
        }, 150);
        timeoutIds.push(timeout);
      }
    };

    // Start the typing animation
    typeNextLine(0);

    // Cleanup function
    return () => {
      isMounted = false;
      timeoutIds.forEach(id => clearTimeout(id));
      isTypingRef.current = false;
    };
  }, []); // Remove lines from dependencies

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden"
    >
      {/* Matrix canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-15"
      />

      {/* Terminal window */}
      <div className="relative max-w-2xl w-full mx-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-black/90 backdrop-blur-sm rounded-lg border border-green-500/20 shadow-[0_0_50px_rgba(0,255,0,0.15)] overflow-hidden"
        >
          {/* Terminal header */}
          <div className="bg-black/60 px-4 py-2 flex items-center border-b border-green-500/20">
            <Terminal className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-green-500 font-mono text-sm">Secure Terminal</span>
          </div>

          {/* Terminal content */}
          <div className="p-4 font-mono text-sm h-[400px] overflow-auto">
            <pre className="text-green-500 whitespace-pre-wrap">
              {displayedLines.map((line, index) => (
                <React.Fragment key={index}>
                  {`> ${line}\n`}
                </React.Fragment>
              ))}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 0.7 }}
                className="inline-block ml-1 w-2 h-4 bg-green-500"
              />
            </pre>
          </div>
        </motion.div>
      </div>

      {/* CSS for glitch effect */}
      <style>
        {`
         @keyframes textGlitch {
           0% { text-shadow: 2px 2px #0f0, -2px -2px #0f0; }
           25% { text-shadow: -2px 2px #0f0, 2px -2px #0f0; }
           50% { text-shadow: 2px -2px #0f0, -2px 2px #0f0; }
           75% { text-shadow: -2px -2px #0f0, 2px 2px #0f0; }
           100% { text-shadow: 2px 2px #0f0, -2px -2px #0f0; }
         }
        `}
      </style>
    </motion.div>
  );
};

export default SplashScreen; 