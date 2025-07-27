import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Gamepad, ArrowLeftRight, Target, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import HackingGame from './HackingGame';
import PlayCanvasGame from './PlayCanvasGame';

interface HeroGameProps {
  className?: string;
}



// Create a new VengeFPS component that will house the Venge.io-like game
const VengeFPS: React.FC = () => {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle iframe load event
  const handleIframeLoad = () => {
    console.log('3D FPS iframe loaded');
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="w-full">
      <div className="bg-black/40 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(0,255,0,0.1)] border border-green-500/20 hover:border-green-500/40 overflow-hidden">
        {/* Game Container */}
        <div className="w-full h-[600px] relative">
          {/* The PlayCanvas iframe - using a more reliable HTTPS game */}
          <iframe
            ref={iframeRef}
            src="https://playcanv.as/p/BAuoCOx6/"
            title="Robo Storm"
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; gamepad; microphone; camera; xr-spatial-tracking; magnetometer; accelerometer; gyroscope;"
            onLoad={handleIframeLoad}
          ></iframe>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-green-400 font-mono">Loading 3D FPS Game...</p>
                <p className="mt-2 text-green-400/60 font-mono text-sm max-w-md text-center">
                  Please wait while we prepare this immersive 3D first-person shooter
                </p>
              </div>
            </div>
          )}

          {/* Controls Guide - only visible when loading */}
          {isLoading && (
            <div className="absolute inset-x-0 bottom-6 p-3 z-10">
              <div className="grid grid-cols-2 gap-4 px-4 max-w-md mx-auto">
                <div className="bg-black/60 p-3 rounded-lg border border-green-500/20 flex items-center gap-2">
                  <span className="text-green-400/80 font-mono text-sm">WASD - Movement</span>
                </div>
                <div className="bg-black/60 p-3 rounded-lg border border-green-500/20 flex items-center gap-2">
                  <span className="text-green-400/80 font-mono text-sm">Mouse - Aim</span>
                </div>
                <div className="bg-black/60 p-3 rounded-lg border border-green-500/20 flex items-center gap-2">
                  <span className="text-green-400/80 font-mono text-sm">Left Click - Shoot</span>
                </div>
                <div className="bg-black/60 p-3 rounded-lg border border-green-500/20 flex items-center gap-2">
                  <span className="text-green-400/80 font-mono text-sm">Space - Jump</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
// Create a new WebVRLab component
const WebVRLab: React.FC = () => {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle iframe load event
  const handleIframeLoad = () => {
    console.log('Web VR Lab iframe loaded');
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="w-full">
      <div className="bg-black/40 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(0,255,0,0.1)] border border-green-500/20 hover:border-green-500/40 overflow-hidden">
        {/* Game Container */}
        <div className="w-full h-[600px] relative">
          {/* The PlayCanvas iframe - Web VR Lab */}
          <iframe
            ref={iframeRef}
            src="https://playcanv.as/p/sAsiDvtC/"
            title="Web VR Lab"
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; gamepad; microphone; camera; xr-spatial-tracking; magnetometer; accelerometer; gyroscope;"
            onLoad={handleIframeLoad}
          ></iframe>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-green-400 font-mono">Loading Web VR Lab...</p>
                <p className="mt-2 text-green-400/60 font-mono text-sm max-w-md text-center">
                  Please wait while we prepare this immersive virtual reality experience
                </p>
              </div>
            </div>
          )}

          {/* Controls Guide - only visible when loading */}
          {isLoading && (
            <div className="absolute inset-x-0 bottom-6 p-3 z-10">
              <div className="grid grid-cols-2 gap-4 px-4 max-w-md mx-auto">
                <div className="bg-black/60 p-3 rounded-lg border border-green-500/20 flex items-center gap-2">
                  <span className="text-green-400/80 font-mono text-sm">Mouse - Look Around</span>
                </div>
                <div className="bg-black/60 p-3 rounded-lg border border-green-500/20 flex items-center gap-2">
                  <span className="text-green-400/80 font-mono text-sm">WASD - Move</span>
                </div>
                <div className="bg-black/60 p-3 rounded-lg border border-green-500/20 flex items-center gap-2">
                  <span className="text-green-400/80 font-mono text-sm">Space - Jump</span>
                </div>
                <div className="bg-black/60 p-3 rounded-lg border border-green-500/20 flex items-center gap-2">
                  <span className="text-green-400/80 font-mono text-sm">VR - Compatible</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
// Create a new component specifically for the Flappy Bird game
const FlappyBirdGame: React.FC = () => {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle iframe load event
  const handleIframeLoad = () => {
    console.log('Flappy Bird iframe loaded');
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="w-full">
      <div className="bg-black/40 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(0,255,0,0.1)] border border-green-500/20 hover:border-green-500/40 overflow-hidden">
        {/* Game Container */}
        <div className="w-full h-[600px] relative">
          {/* The PlayCanvas iframe - using a different URL for Flappy Bird */}
          <iframe
            ref={iframeRef}
            src="https://playcanv.as/p/2OlkUaxF/"
            title="Flappy Bird"
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; gamepad; microphone; camera; xr-spatial-tracking; magnetometer; accelerometer; gyroscope;"
            onLoad={handleIframeLoad}
          ></iframe>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-green-400 font-mono">Loading Flappy Bird...</p>
                <p className="mt-2 text-green-400/60 font-mono text-sm max-w-md text-center">
                  Please wait while we prepare this retro Flappy Bird challenge for you.
                </p>
              </div>
            </div>
          )}

          {/* Controls Guide - only visible when loading */}
          {isLoading && (
            <div className="absolute inset-x-0 bottom-6 p-3 z-10">
              <div className="grid grid-cols-2 gap-4 px-4 max-w-md mx-auto">
                <div className="bg-black/60 p-3 rounded-lg border border-green-500/20 flex items-center gap-2">
                  <span className="text-green-400/80 font-mono text-sm">Tap - Flap</span>
                </div>
                <div className="bg-black/60 p-3 rounded-lg border border-green-500/20 flex items-center gap-2">
                  <span className="text-green-400/80 font-mono text-sm">Space - Flap</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HeroGame: React.FC<HeroGameProps> = ({ className }) => {
  // Update the state type to include the four game options and set 'vr' as default
  const [activeGame, setActiveGame] = useState<'vr' | 'fps' | 'flappy' | 'hacking'>('vr');

  return (
    <div className={`bg-black/40 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(0,255,0,0.1)] border border-green-500/20 hover:border-green-500/40 p-6 ${className}`}>
      {/* Game Mode Tabs */}
      <div className="flex border-b border-green-500/20 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveGame('fps')}
          className={`py-2 px-4 mr-2 ${activeGame === 'fps' ? 'bg-green-500/20 text-green-400 border-b-2 border-green-400' : 'text-green-400/50 hover:text-green-400/80'} transition-colors flex items-center`}
        >
          <Target className="w-4 h-4 mr-2" />
          <span className="font-mono">Robo Storm</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveGame('vr')}
          className={`py-2 px-4 mr-2 ${activeGame === 'vr' ? 'bg-green-500/20 text-green-400 border-b-2 border-green-400' : 'text-green-400/50 hover:text-green-400/80'} transition-colors flex items-center`}
        >
          <Eye className="w-4 h-4 mr-2" />
          <span className="font-mono">Web VR Lab</span>
        </motion.button>



        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveGame('flappy')}
          className={`py-2 px-4 mr-2 ${activeGame === 'flappy' ? 'bg-green-500/20 text-green-400 border-b-2 border-green-400' : 'text-green-400/50 hover:text-green-400/80'} transition-colors flex items-center`}
        >
          <Gamepad className="w-4 h-4 mr-2" />
          <span className="font-mono">Flappy Bird</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveGame('hacking')}
          className={`py-2 px-4 ${activeGame === 'hacking' ? 'bg-green-500/20 text-green-400 border-b-2 border-green-400' : 'text-green-400/50 hover:text-green-400/80'} transition-colors flex items-center`}
        >
          <Code className="w-4 h-4 mr-2" />
          <span className="font-mono">Hack the Code</span>
        </motion.button>
      </div>

      {/* Game Description */}
      <p className="text-green-400/80 font-mono mb-6">
        {activeGame === 'vr'
          ? "Experience immersive virtual reality in this cutting-edge Web VR Lab. Explore 3D environments, interact with objects, and test VR capabilities directly in your browser."
          : activeGame === 'fps'
            ? "Experience intense 3D combat in this first-person shooter with modern graphics and smooth gameplay. Battle enemies across detailed environments with realistic physics and responsive controls."
            : activeGame === 'flappy'
              ? "Soar through a neon cityscape, dodge towering obstacles, and test your reflexes in this modern twist on the classic arcade challenge."
              : "Infiltrate secure systems by deciphering a 4-digit hexadecimal code. Use your wits to bypass digital defenses, unlock encrypted files, and gain access to top-secret networks."}
      </p>

      {/* Game Content */}
      <div className="transition-all duration-300">
        {activeGame === 'vr' ? (
          <WebVRLab />
        ) : activeGame === 'fps' ? (
          <VengeFPS />
        ) : activeGame === 'flappy' ? (
          <FlappyBirdGame />
        ) : (
          <HackingGame />
        )}
      </div>
    </div>
  );
};

export default HeroGame; 