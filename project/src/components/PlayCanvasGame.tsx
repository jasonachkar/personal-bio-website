import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad, KeyboardIcon, Mouse } from 'lucide-react';

interface PlayCanvasGameProps {
  className?: string;
}

const PlayCanvasGame: React.FC<PlayCanvasGameProps> = ({ className }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMessage, setGameMessage] = useState('Ready to explore the cyber dungeon?');
  const [score, setScore] = useState(0);
  const [playerHealth, setPlayerHealth] = useState(100);

  // Handle message events from the PlayCanvas game
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from our PlayCanvas game domain
      // Replace 'playcanvas.com' with the actual domain where your game is hosted
      if (event.origin.includes('fieldsoffury.io')) {
        const data = event.data;
        
        if (data.type === 'GAME_EVENT') {
          switch (data.action) {
            case 'SCORE_UPDATE':
              setScore(data.value);
              break;
            case 'HEALTH_UPDATE':
              setPlayerHealth(data.value);
              break;
            case 'GAME_MESSAGE':
              setGameMessage(data.message);
              break;
            case 'LOADING_COMPLETE':
              setIsLoading(false);
              break;
            default:
              break;
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Handle iframe load event
  const handleIframeLoad = () => {
    // The iframe has loaded, but the game might still be initializing
    console.log('PlayCanvas iframe loaded');
    
    // We'll set a timeout to ensure loading state shows for at least 2 seconds
    // for a better user experience, even if the game loads quickly
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  // Start the game
  const handleStartGame = () => {
    setGameStarted(true);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      // Send a message to the PlayCanvas game to start
      iframeRef.current.contentWindow.postMessage(
        { type: 'GAME_CONTROL', action: 'START_GAME' },
        '*'
      );
    }
  };

  // Reset game state, useful if the player wants to restart
  const resetGame = () => {
    setGameStarted(false);
    setScore(0);
    setPlayerHealth(100);
    setGameMessage('Ready to explore the cyber dungeon?');
    
    if (iframeRef.current) {
      // Reload the iframe to reset the game state completely
      const src = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = src;
        }
      }, 100);
    }
  };
  
  return (
    <div className={`${className}`}>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(0,255,0,0.1)] border border-green-500/20 hover:border-green-500/40 overflow-hidden">
        {/* Game Container */}
        <div className="w-full h-[600px] relative">
          {/* The PlayCanvas iframe - hidden until game starts */}
          <iframe
            ref={iframeRef}
            src="https://fieldsoffury.io" 
            title="Cyber Dungeon Explorer"
            className={`w-full h-full border-0 ${gameStarted ? 'block' : 'hidden'}`}
            allow="autoplay; fullscreen; gamepad; microphone; camera; xr-spatial-tracking; magnetometer; accelerometer; gyroscope;"
            onLoad={handleIframeLoad}
          ></iframe>
          
          {/* Loading Overlay */}
          {isLoading && gameStarted && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-green-400 font-mono">Loading Cyber Dungeon...</p>
                <p className="mt-2 text-green-400/60 font-mono text-sm max-w-md text-center">
                  Please wait while we prepare a high-quality 3D experience for you
                </p>
              </div>
            </div>
          )}
          
          {/* Game UI Overlay - shown during gameplay */}
          {!isLoading && gameStarted && (
            <div className="absolute inset-x-0 top-0 p-3 flex justify-between items-center z-10 pointer-events-none">
              <div className="flex items-center gap-2">
                <div className="bg-black/60 px-3 py-1 rounded-lg border border-green-500/20">
                  <span className="text-green-400 font-mono text-sm">Score: {score}</span>
                </div>
              </div>
              <div className="bg-black/60 px-3 py-1 rounded-lg border border-green-500/20">
                <div className="w-24 h-3 bg-black/60 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500"
                    style={{ width: `${playerHealth}%` }}
                  ></div>
                </div>
                <span className="text-green-400 font-mono text-xs mt-1">HP: {playerHealth}/100</span>
              </div>
            </div>
          )}
          
          {/* Game Message */}
          {!isLoading && gameStarted && (
            <div className="absolute inset-x-0 bottom-0 p-3 z-10 pointer-events-none">
              <div className="bg-black/60 px-3 py-2 rounded-lg border border-green-500/20">
                <p className="text-green-400 font-mono text-sm">{gameMessage}</p>
              </div>
            </div>
          )}
          
          {/* Start Game Overlay - shown before starting the game */}
          {!gameStarted && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10">
              <h3 className="text-3xl font-bold text-green-400 font-mono mb-2">Cyber Dungeon Explorer</h3>
              <p className="text-xl bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent font-mono mb-6">
                High-Quality 3D Experience
              </p>
              <p className="text-green-400/80 font-mono text-center max-w-md mb-8 px-4">
                Navigate through a cyberpunk arena, take down enemy drones with your laser weapons, and survive as long as possible in this action-packed FPS experience.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartGame}
                className="px-6 py-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center gap-2 border border-green-500/40 shadow-[0_0_15px_rgba(0,255,0,0.1)] hover:shadow-[0_0_30px_rgba(0,255,0,0.2)] font-mono"
              >
                <Gamepad className="w-5 h-5" />
                Enter The Dungeon
              </motion.button>
              
              {/* Game Controls Guide */}
              <div className="mt-8 grid grid-cols-2 gap-4 px-4">
                <div className="bg-black/60 p-3 rounded-lg border border-green-500/20 flex items-center gap-2">
                  <KeyboardIcon className="w-5 h-5 text-green-500" />
                  <span className="text-green-400/80 font-mono text-sm">WASD to move</span>
                </div>
                <div className="bg-black/60 p-3 rounded-lg border border-green-500/20 flex items-center gap-2">
                  <Mouse className="w-5 h-5 text-green-500" />
                  <span className="text-green-400/80 font-mono text-sm">Mouse to aim</span>
                </div>
                <div className="bg-black/60 p-3 rounded-lg border border-green-500/20 flex items-center gap-2">
                  <Mouse className="w-5 h-5 text-green-500" />
                  <span className="text-green-400/80 font-mono text-sm">Left click to shoot</span>
                </div>
                <div className="bg-black/60 p-3 rounded-lg border border-green-500/20 flex items-center gap-2">
                  <KeyboardIcon className="w-5 h-5 text-green-500" />
                  <span className="text-green-400/80 font-mono text-sm">Spacebar to jump</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayCanvasGame; 