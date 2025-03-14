import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Code, Terminal, Shield, FileCode, Eraser, Type, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import LoadingScreen from './LoadingScreen';
import CyberCommandCenter from './CyberCommandCenter';
import HoneypotDashboard from './HoneypotDashboard';
import HeroGame from './HeroGame';

// Add global styles for the terminal UI with matrix theme
const terminalStyles = `
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  
  .animate-blink {
    animation: blink 1s ease-in-out infinite;
  }

  @keyframes cursor {
    from, to { border-color: transparent; }
    50% { border-color: #00ff00; }
  }

  .vertical-text {
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }
  
  @keyframes matrixRain {
    0% {
      transform: translateY(-100%);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(100vh);
      opacity: 0;
    }
  }
  
  .matrix-rain {
    position: absolute;
    color: #0f0;
    font-family: monospace;
    font-size: 1.2rem;
    text-shadow: 0 0 5px #0f0;
    user-select: none;
    pointer-events: none;
    white-space: nowrap;
    opacity: 0.8;
    z-index: 0;
  }
  
  .crt-effect {
    position: relative;
    overflow: hidden;
  }
  
  .crt-effect::after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
    background-size: 100% 4px;
    z-index: 10;
    opacity: 0.1;
    pointer-events: none;
  }
  
  @keyframes scanline {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(100%);
    }
  }
  
  .scanline {
    width: 100%;
    height: 4px;
    background: rgba(0, 255, 0, 0.1);
    position: absolute;
    z-index: 9;
    animation: scanline 8s linear infinite;
    pointer-events: none;
  }
  
  @keyframes glitch {
    0% {
      clip-path: inset(40% 0 61% 0);
      transform: translate(-2px, 2px);
    }
    20% {
      clip-path: inset(92% 0 1% 0);
      transform: translate(1px, 4px);
    }
    40% {
      clip-path: inset(43% 0 1% 0);
      transform: translate(3px, 2px);
    }
    60% {
      clip-path: inset(25% 0 58% 0);
      transform: translate(2px, -4px);
    }
    80% {
      clip-path: inset(54% 0 7% 0);
      transform: translate(-4px, -2px);
    }
    100% {
      clip-path: inset(58% 0 43% 0);
      transform: translate(-2px, 2px);
    }
  }
  
  .glitch-effect {
    position: relative;
  }
  
  .glitch-effect::before,
  .glitch-effect::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .glitch-effect::before {
    left: 2px;
    text-shadow: -1px 0 #00ff00;
    animation: glitch 3s infinite linear alternate-reverse;
    opacity: 0.3;
  }
  
  .glitch-effect::after {
    left: -2px;
    text-shadow: 1px 0 #00ffff;
    animation: glitch 2s infinite linear alternate-reverse;
    opacity: 0.3;
  }
`;

// Matrix rain animation component
const MatrixRain: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState<JSX.Element[]>([]);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const createMatrixColumn = (index: number) => {
      const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01234567890";
      const columnLength = Math.floor(Math.random() * 20) + 10;
      const columnContent = Array.from({ length: columnLength }, () => 
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join('');
      
      const left = `${Math.random() * 100}%`;
      const animationDuration = `${Math.random() * 15 + 10}s`;
      const fontSize = `${Math.random() * 0.7 + 0.5}rem`;
      const delay = `${Math.random() * 5}s`;
      
      return (
        <div 
          key={index}
          className="matrix-rain"
          style={{
            left,
            fontSize,
            animation: `matrixRain ${animationDuration} linear ${delay} infinite`
          }}
        >
          {columnContent}
        </div>
      );
    };
    
    const numColumns = 15; // Number of matrix columns
    const matrixColumns = Array.from({ length: numColumns }, (_, i) => createMatrixColumn(i));
    setColumns(matrixColumns);
    
  }, []);
  
  return <div ref={containerRef} className="absolute inset-0 overflow-hidden z-0">{columns}</div>;
};

interface ProfileContent {
  id: string;
  full_name: string;
  title: string;
  description: string;
  phone: string;
  email: string;
  location: string;
  image_url: string;
  image_alt: string;
}

interface Translation {
  content: string;
}

interface Project {
  id: string;
  title: string;
  type: string;
  description: string;
  status: string;
  website: string | null;
  image_url: string | null;
}

// Typing cursor effect component
const TypingCursor: React.FC = () => {
  return (
    <span className="inline-block w-2 h-5 bg-green-500 ml-1 animate-blink"></span>
  );
};

// Typing text effect component
const TypedText: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isComplete, setIsComplete] = useState<boolean>(false);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let charIndex = 0;
    
    const startTyping = () => {
      if (charIndex <= text.length) {
        setDisplayedText(text.substring(0, charIndex));
        charIndex++;
        
        // Random typing speed between 30ms and 70ms for natural effect
        const typingSpeed = Math.floor(Math.random() * 40) + 30;
        timeout = setTimeout(startTyping, typingSpeed);
      } else {
        setIsComplete(true);
      }
    };
    
    // Delay start of typing
    const initialDelay = setTimeout(() => {
      startTyping();
    }, delay);
    
    return () => {
      clearTimeout(timeout);
      clearTimeout(initialDelay);
    };
  }, [text, delay]);
  
  return (
    <span>
      {displayedText}
      {!isComplete && <TypingCursor />}
    </span>
  );
};

// Binary background component
const BinaryBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-10 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-0 text-green-500 font-mono text-xs">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="leading-3">
            {Array.from({ length: 80 }).map((_, j) => (
              <span key={j}>{Math.random() > 0.5 ? '1' : '0'}</span>
            ))}
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 right-0 text-green-500 font-mono text-xs">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="leading-3">
            {Array.from({ length: 80 }).map((_, j) => (
              <span key={j}>{Math.random() > 0.5 ? '1' : '0'}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Drawing Game Component
const DrawingGame: React.FC = () => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const recognitionTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
    }

    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setError(null);
    const coords = getCoordinates(e);
    setLastX(coords.x);
    setLastY(coords.y);
    setIsDrawing(true);
    
    // Clear any pending recognition when starting to draw
    if (recognitionTimeoutRef.current) {
      clearTimeout(recognitionTimeoutRef.current);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    setLastX(coords.x);
    setLastY(coords.y);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      
      // Clear any existing timeout
      if (recognitionTimeoutRef.current) {
        clearTimeout(recognitionTimeoutRef.current);
      }
      
      // Set a new timeout for recognition
      recognitionTimeoutRef.current = setTimeout(() => {
        recognizeDrawing();
      }, 1000); // Wait 1 second after stopping to recognize
    }
  };

  const preprocessCanvas = (canvas: HTMLCanvasElement) => {
    // Create a temporary canvas for preprocessing
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) return null;

    // Fill with white background
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Draw the original content in black
    tempCtx.drawImage(canvas, 0, 0);
    
    // Get image data
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imageData.data;
    
    // Enhance contrast and convert to pure black and white
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const newValue = avg < 200 ? 0 : 255; // Adjusted threshold for better contrast
      data[i] = newValue;     // R
      data[i + 1] = newValue; // G
      data[i + 2] = newValue; // B
    }
    
    // Put the processed image back
    tempCtx.putImageData(imageData, 0, 0);
    return tempCanvas;
  };

  const recognizeDrawing = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Preprocess the canvas
      const processedCanvas = preprocessCanvas(canvas);
      if (!processedCanvas) {
        throw new Error('Failed to process canvas');
      }

      // Convert to base64 image data
      const imageData = processedCanvas.toDataURL('image/png')
        .replace('data:image/png;base64,', '');

      // Call the Netlify function
      const response = await fetch('/api/recognize-handwriting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        throw new Error('Failed to recognize text');
      }

      const result = await response.json();
      
      if (result.text) {
        // Replace the text instead of appending
        setRecognizedText(result.text.trim());
      } else {
        setError('No text detected. Please write more clearly.');
      }
    } catch (error) {
      console.error('Error recognizing text:', error);
      setError(error instanceof Error ? error.message : 'Failed to process text');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setRecognizedText("");
    setError(null);
    
    // Clear any pending recognition
    if (recognitionTimeoutRef.current) {
      clearTimeout(recognitionTimeoutRef.current);
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (recognitionTimeoutRef.current) {
        clearTimeout(recognitionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('touchstart', startDrawing as any);
    canvas.addEventListener('touchmove', draw as any);
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      canvas.removeEventListener('touchstart', startDrawing as any);
      canvas.removeEventListener('touchmove', draw as any);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [isDrawing, lastX, lastY]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="bg-black/80 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(0,255,0,0.1)] border border-green-500/20 hover:border-green-500/40 p-4 w-full h-full"
    >
      <div className="text-center mb-3">
        <h3 className="text-lg font-semibold text-green-400 font-mono">{t('drawingGame.title') || 'Handwriting Recognition'}</h3>
        <p className="text-xs text-green-400/70 font-mono">
          {t('drawingGame.instruction') || 'Draw letters or characters to convert to text'}
        </p>
      </div>

      <div className="bg-black/60 p-2 rounded-lg mb-3 border border-green-500/20">
        <div className="flex items-center mb-1">
          <Type className="w-3 h-3 text-green-500 mr-2" />
          <span className="text-xs font-medium text-green-400/80 font-mono">{t('drawingGame.recognizedText') || 'Recognized Text'}:</span>
        </div>
        {isProcessing ? (
          <div className="flex items-center justify-center py-1">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent mr-2"></div>
            <span className="text-xs text-green-400/70 font-mono">{t('drawingGame.processing') || 'Processing...'}</span>
          </div>
        ) : (
          <div className="min-h-[30px] bg-black/40 rounded p-2 text-green-400 font-mono text-sm">
            {error ? (
              <span className="text-red-400 text-xs">{error}</span>
            ) : (
              recognizedText || t('drawingGame.placeholder') || 'Draw letters or characters to begin'
            )}
          </div>
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={250}
        height={150}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border-2 border-green-500/20 mx-auto bg-white cursor-crosshair touch-none rounded-lg"
      />
      
      <div className="flex justify-center mt-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearCanvas}
          className="px-3 py-1 bg-black/60 text-green-400 rounded-lg hover:bg-green-500/10 transition-colors flex items-center border border-green-500/40 shadow-[0_0_15px_rgba(0,255,0,0.1)] hover:shadow-[0_0_30px_rgba(0,255,0,0.2)] font-mono text-sm"
        >
          <Eraser className="w-3 h-3 mr-2" />
          {t('drawingGame.clear') || 'Clear'}
        </motion.button>
      </div>
    </motion.div>
  );
};

// Console output effect component - new component
const HackingConsole: React.FC = () => {
  const [consoleLines, setConsoleLines] = useState<string[]>([
    "{'>'}initializing system...",
    "{'>'}accessing secure network...",
    "{'>'}bypassing firewalls...",
    "{'>'}establishing encrypted connection...",
    "{'>'}connection established"
  ]);
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  
  useEffect(() => {
    if (currentLine < consoleLines.length) {
      const timer = setTimeout(() => {
        setDisplayedLines(prev => [...prev, consoleLines[currentLine]]);
        setCurrentLine(prev => prev + 1);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [currentLine, consoleLines]);
  
  return (
    <div className="font-mono text-sm text-green-400/90 mt-3 mb-4 bg-black/40 p-2 rounded-md border border-green-500/20">
      {displayedLines.map((line, index) => (
        <div key={index} className={`${index === displayedLines.length - 1 && currentLine < consoleLines.length ? 'flex items-center' : ''}`}>
          <span>{line}</span>
          {index === displayedLines.length - 1 && currentLine < consoleLines.length && (
            <span className="ml-1 animate-blink">_</span>
          )}
        </div>
      ))}
      {currentLine >= consoleLines.length && (
        <div className="flex items-center">
          <span className="text-green-500">{'>'}</span>
          <span className="ml-1 animate-blink">_</span>
        </div>
      )}
    </div>
  );
};

const Hero: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState<ProfileContent | null>(null);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [projects, setProjects] = useState<Project[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Inject the terminal styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = terminalStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile...');
        // Fetch profile content
        const { data: profileData, error: profileError } = await supabase
          .from('profile_content')
          .select('*')
          .single();

        if (profileError) throw profileError;

        // Fetch translations if language is French
        if (i18n.language === 'fr') {
          console.log('Fetching French translations...');
          const { data: translationsData, error: translationsError } = await supabase
            .from('translations')
            .select('field_name, content')
            .eq('table_name', 'profile_content')
            .eq('record_id', profileData.id)
            .eq('language', 'fr');

          if (translationsError) {
            console.error('Error fetching translations:', translationsError);
            throw translationsError;
          }

          console.log('Translations data:', translationsData);
          const translationsMap = translationsData.reduce((acc: Record<string, string>, curr) => {
            acc[curr.field_name] = curr.content;
            return acc;
          }, {});

          setTranslations(translationsMap);
          console.log('Translation map:', translationsMap);
        } else {
          setTranslations({});
        }

        setProfile(profileData);
        console.log('Profile fetched successfully:', profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error instanceof Error ? error.message : 'Failed to load profile');
      }
    };

    fetchProfile();
  }, [i18n.language]);

  useEffect(() => {
    // Set typing complete after all initial animations
    const timer = setTimeout(() => {
      setIsTypingComplete(true);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, []);

  // New function to scroll project container
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount),
        behavior: 'smooth'
      });
    }
  };

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, title, type, description, status, website, image_url')
          .order('order_num');

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-black">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 font-mono max-w-md"
        >
          <p className="text-lg">$ ERROR: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 border border-red-500 hover:bg-red-500/10 text-red-500 font-mono"
          >
            $ retry
          </button>
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return <LoadingScreen />;
  }

  const getTranslatedContent = (fieldName: keyof ProfileContent) => {
    // Check if we have a translation for this field
    if (i18n.language === 'fr' && translations[fieldName]) {
      return translations[fieldName];
    }
    
    // Fallback to original content
    return profile ? profile[fieldName] : '';
  };

  const renderTerminalSection = () => {
    switch (activeSection) {
      case 'about':
  return (
          <div className="text-white/90 font-mono mt-4 space-y-3 z-10 relative">
            <HackingConsole />
            <TypedText 
              text={`Hello, I'm ${getTranslatedContent('full_name')}`} 
              delay={4000} 
            />
            {isTypingComplete && (
              <>
                <p className="text-green-400/90 text-sm mt-4 flex items-center">
                  <Code className="w-4 h-4 mr-2" />
                  # {getTranslatedContent('title')}
                </p>
                <div className="mt-4">
                  <TypedText 
                    text={getTranslatedContent('description')} 
                    delay={4500} 
                  />
                </div>
                
                <div className="flex gap-4 mt-8">
                  <motion.a
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://github.com/jasonachkar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-black/80 border border-green-500/30 hover:border-green-500 hover:text-green-400 transition-colors shadow-[0_0_10px_rgba(0,255,0,0.1)]"
                  >
                    <Github className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://linkedin.com/in/jason-achkar-diab"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-black/80 border border-green-500/30 hover:border-green-500 hover:text-green-400 transition-colors shadow-[0_0_10px_rgba(0,255,0,0.1)]"
                  >
                    <Linkedin className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    href={`mailto:${profile.email}`}
                    className="p-2 bg-black/80 border border-green-500/30 hover:border-green-500 hover:text-green-400 transition-colors shadow-[0_0_10px_rgba(0,255,0,0.1)]"
                  >
                    <Mail className="w-5 h-5" />
                  </motion.a>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-black/80 border border-green-500/30 hover:border-green-500 hover:text-green-400 transition-colors shadow-[0_0_10px_rgba(0,255,0,0.1)]"
                  >
                    <Link to="/resume">
                      <FileCode className="w-5 h-5 text-white hover:text-green-400" />
                    </Link>
                  </motion.div>
                </div>
                
                {/* Navigation buttons with proper grid layout - reduced width */}
                <div className="pt-6 pb-2 grid grid-cols-2 gap-3">
                  <Link 
                    to="/about" 
                    className="px-3 py-2 border border-green-500/50 bg-green-500/5 text-green-400 hover:bg-green-500/10 font-mono text-sm flex items-center justify-center shadow-[0_0_15px_rgba(0,255,0,0.1)] w-auto max-w-[160px]"
                  >
                    {'>'}_access about
                  </Link>
                  <Link 
                    to="/projects" 
                    className="px-3 py-2 border border-green-500/50 bg-green-500/5 text-green-400 hover:bg-green-500/10 font-mono text-sm flex items-center justify-center shadow-[0_0_15px_rgba(0,255,0,0.1)] w-auto max-w-[160px]"
                  >
                    {'>'}_access projects
                  </Link>
                  <Link 
                    to="/experience" 
                    className="px-3 py-2 border border-green-500/50 bg-green-500/5 text-green-400 hover:bg-green-500/10 font-mono text-sm flex items-center justify-center shadow-[0_0_15px_rgba(0,255,0,0.1)] w-auto max-w-[160px]"
                  >
                    {'>'}_access experience
                  </Link>
                  <Link 
                    to="/contact" 
                    className="px-3 py-2 border border-green-500/50 bg-green-500/5 text-green-400 hover:bg-green-500/10 font-mono text-sm flex items-center justify-center shadow-[0_0_15px_rgba(0,255,0,0.1)] w-auto max-w-[160px]"
                  >
                    {'>'}_access contact
                  </Link>
                </div>
              </>
            )}
              </div>
        );
      default:
        return <div>404: Section not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden crt-effect">
      <MatrixRain />
      <BinaryBackground />
      <div className="scanline"></div>
      
      {/* Main Terminal Window */}
      <main className="flex-grow flex flex-col items-center justify-start p-4 pt-20 relative z-10 overflow-auto">
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex flex-col lg:flex-row w-full gap-6 mb-10">
            {/* Primary Terminal Window */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full lg:w-3/5 relative backdrop-blur-sm flex-shrink-0"
            >
              {/* Terminal window header */}
              <div className="bg-black/80 border-green-500/50 border rounded-t px-4 py-2 flex items-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                  <span className="text-green-500/50 font-mono text-xs">secure-terminal</span>
                </div>
              </div>
              
              {/* Terminal content */}
              <div className="bg-black/80 border-green-500/50 border border-t-0 rounded-b p-5 font-mono shadow-[0_0_30px_rgba(0,255,0,0.1)]">
                <div className="flex items-center">
                  <span className="text-green-400">{'>'}</span>
                  <span className="ml-2 text-white">access</span>
                  <span className="ml-2 text-blue-400">TheHackerDungeon_</span>
                </div>
                
                {renderTerminalSection()}

                {/* Call to action button */}
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="mt-8"
            >
                </motion.div>
              </div>
            </motion.div>

            {/* Right-side Interactive Components */}
            <div className="w-full lg:w-2/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {/* Cyber Command Center */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="col-span-1"
              >
                <div className="bg-black/80 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(0,255,0,0.1)] border border-green-500/20 hover:border-green-500/40 p-4 w-full h-full">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-green-400 font-mono">$ ./monitor.sh</h3>
                  </div>
                  <CyberCommandCenter />
                </div>
              </motion.div>
              
              {/* Drawing Game */}
                <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="col-span-1"
              >
                <DrawingGame />
                </motion.div>
              </div>
          </div>

            {/* Projects Section */}
          {projects.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="relative w-full mb-10"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-green-400 font-mono">$ ls projects/</h3>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => scroll('left')}
                    className="p-2 rounded-full bg-black/40 text-green-400 hover:bg-green-500/10 hover:text-green-500 transition-colors border border-green-500/20"
                  >
                    <span className="text-green-500 font-mono">←</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => scroll('right')}
                    className="p-2 rounded-full bg-black/40 text-green-400 hover:bg-green-500/10 hover:text-green-500 transition-colors border border-green-500/20"
                  >
                    <span className="text-green-500 font-mono">→</span>
                  </motion.button>
                </div>
              </div>

              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-2 px-2 snap-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="flex-none w-[300px] snap-start"
                  >
                    {project.website ? (
                      <a
                        href={project.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group/card"
                      >
                        <div className="relative h-[200px]">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="absolute inset-0 bg-black rounded-lg border border-green-500 overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)]"
                          >
                            {project.image_url && (
                              <div className="absolute inset-0">
                                <img
                                  src={project.image_url}
                                  alt={project.title}
                                  className="w-full h-full object-cover object-center opacity-20"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black" />
                              </div>
                            )}
                          </motion.div>
                          <div className="relative z-10 p-5 h-full flex flex-col">
                            <div className="absolute top-3 right-3">
                              <div className="text-xs text-green-400 font-mono flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
                                <span>Visit Site</span>
                                <ExternalLink className="w-3 h-3 text-green-400" />
                            </div>
                            </div>
                            <div className="flex-grow flex flex-col justify-end">
                              <h4 className="font-semibold text-green-400 text-lg font-mono mb-1">
                              {project.title}
                            </h4>
                              <p className="text-sm text-green-400/70 font-mono mb-3 line-clamp-2">
                              {project.description}
                            </p>
                              <div className="flex items-center justify-between mt-auto">
                                <span className="text-xs text-green-400 font-mono">
                                {project.type}
                              </span>
                                <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 font-mono border border-green-500">
                                {project.status}
                              </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    ) : (
                      <Link to={`/projects#${project.id}`} className="block group/card">
                        <div className="relative h-[200px]">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="absolute inset-0 bg-black rounded-lg border border-green-500 overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)]"
                          >
                            {project.image_url && (
                              <div className="absolute inset-0">
                                <img
                                  src={project.image_url}
                                  alt={project.title}
                                  className="w-full h-full object-cover object-center opacity-20"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black" />
                              </div>
                            )}
                          </motion.div>
                          <div className="relative z-10 p-5 h-full flex flex-col">
                            <div className="flex-grow flex flex-col justify-end">
                              <h4 className="font-semibold text-green-400 text-lg font-mono mb-1">
                              {project.title}
                            </h4>
                              <p className="text-sm text-green-400/70 font-mono mb-3 line-clamp-2">
                              {project.description}
                            </p>
                              <div className="flex items-center justify-between mt-auto">
                                <span className="text-xs text-green-400 font-mono">
                                {project.type}
                              </span>
                                <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 font-mono border border-green-500">
                                {project.status}
                              </span>
                              </div>
                            </div>
                          </div>
                        </div>
              </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Bottom Interactive Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Hero Game */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="col-span-1"
            >
              <div className="bg-black/80 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(0,255,0,0.1)] border border-green-500/20 hover:border-green-500/40 p-4 w-full">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-green-400 font-mono">$ ./arcade.sh</h3>
          </div>
              <HeroGame />
              </div>
            </motion.div>
            
            {/* Honeypot Dashboard */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="col-span-1"
            >
              <div className="bg-black/80 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(0,255,0,0.1)] border border-green-500/20 hover:border-green-500/40 p-4 w-full h-full">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-green-400 font-mono">$ ./honeypot.sh</h3>
                </div>
                <HoneypotDashboard />
              </div>
            </motion.div>
          </div>
            
          {/* Terminal Console Decoration */}
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="mt-16 text-center text-green-500/30 font-mono z-10"
          >
            <div className="w-16 h-8 border-b-2 border-green-500/10 mx-auto"></div>
            </motion.div>
          </div>
      </main>
    </div>
  );
};

export default Hero;