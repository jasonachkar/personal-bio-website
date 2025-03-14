import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Lock, Unlock, RefreshCw, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HackingGame: React.FC = () => {
  const { t } = useTranslation();
  const [code, setCode] = useState<string[]>([]);
  const [userGuess, setUserGuess] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const maxAttempts = 4;
  const codeLength = 4;

  useEffect(() => {
    generateNewCode();
  }, []);

  const generateNewCode = () => {
    const chars = '0123456789ABCDEF';
    const newCode = Array(codeLength).fill('').map(() => 
      chars[Math.floor(Math.random() * chars.length)]
    );
    setCode(newCode);
    setUserGuess(Array(codeLength).fill(''));
    setFeedback([]);
    setIsLocked(true);
    setAttempts(0);
    setGameWon(false);
    setGameOver(false);
    setShowInstructions(true);
  };

  const handleInput = (index: number, value: string) => {
    if (gameWon || gameOver) return;
    
    const newGuess = [...userGuess];
    newGuess[index] = value.toUpperCase();
    setUserGuess(newGuess);

    // Auto-focus next input
    const inputs = document.querySelectorAll<HTMLInputElement>('.code-input');
    if (value && index < codeLength - 1) {
      inputs[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !userGuess[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      const inputs = document.querySelectorAll<HTMLInputElement>('.code-input');
      inputs[index - 1]?.focus();
    }
  };

  const checkGuess = () => {
    if (userGuess.includes('')) return;

    const newFeedback = userGuess.map((guess, index) => {
      if (guess === code[index]) return '🟢';
      if (code.includes(guess)) return '🟡';
      return '⚫';
    });

    setFeedback([...feedback, newFeedback.join('')]);
    setAttempts(prev => prev + 1);

    if (userGuess.every((guess, index) => guess === code[index])) {
      setGameWon(true);
      setIsLocked(false);
    } else if (attempts + 1 >= maxAttempts) {
      setGameOver(true);
    } else {
      setUserGuess(Array(codeLength).fill(''));
      // Focus first input after clearing
      setTimeout(() => {
        const inputs = document.querySelectorAll<HTMLInputElement>('.code-input');
        inputs[0]?.focus();
      }, 0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="bg-black/40 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(0,255,0,0.1)] border border-green-500/20 hover:border-green-500/40 p-6 w-full max-w-md relative overflow-hidden"
    >
      {/* Game Over Overlay */}
      {gameOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-500 mb-2 font-mono">SYSTEM BREACH FAILED</h3>
            <p className="text-green-400/70 mb-4 font-mono">Security protocols activated. Access denied.</p>
            <p className="text-green-400/70 mb-6 font-mono">The code was: {code.join('')}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateNewCode}
              className="px-6 py-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors font-mono border border-green-500/40"
            >
              Retry
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-green-400 font-mono flex items-center justify-center gap-2">
          {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          {t('hackingGame.title', 'Hack the Code')}
        </h3>
        {showInstructions && (
          <motion.p 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-sm text-green-400/70 font-mono mt-2"
          >
            {t('hackingGame.instructions', 'Guess the 4-digit hex code. 🟢=correct position, 🟡=wrong position, ⚫=not in code')}
          </motion.p>
        )}
      </div>

      <div className="bg-black/60 p-4 rounded-lg mb-4 border border-green-500/20">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Terminal className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-sm font-medium text-green-400/80 font-mono">
              Attempts: {attempts}/{maxAttempts}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateNewCode}
            className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {userGuess.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInput(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="code-input w-12 h-12 bg-black/40 border border-green-500/20 rounded-lg text-center text-green-400 font-mono text-xl focus:outline-none focus:border-green-500/40 focus:ring-1 focus:ring-green-500/40"
              disabled={gameWon || gameOver}
              aria-label={`Code digit ${index + 1}`}
              placeholder="_"
              title={`Enter digit ${index + 1} of the code`}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={checkGuess}
          disabled={userGuess.includes('') || gameWon || gameOver}
          className="w-full py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono"
        >
          {t('hackingGame.submit', 'Submit Guess')}
        </motion.button>
      </div>

      <div className="space-y-2 h-32 overflow-y-auto scrollbar-hide">
        {feedback.map((attempt, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-green-400/70 font-mono text-sm"
          >
            {`Attempt ${index + 1}: ${attempt}`}
          </motion.div>
        ))}
        {gameWon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-green-400 font-mono text-sm font-bold"
          >
            {t('hackingGame.success', 'Access Granted! System compromised!')}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default HackingGame; 