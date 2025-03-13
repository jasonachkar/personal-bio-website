import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Phone, MapPin, FileText, Eraser, Type } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';

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
        ctx.lineWidth = 15;
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
      transition={{ delay: 0.8, duration: 0.6 }}
      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl w-full max-w-md"
    >
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('drawingGame.title')}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('drawingGame.instruction')}
        </p>
      </div>

      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4">
        <div className="flex items-center mb-2">
          <Type className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('drawingGame.recognizedText')}:</span>
        </div>
        {isProcessing ? (
          <div className="flex items-center justify-center py-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{t('drawingGame.processing')}</span>
          </div>
        ) : (
          <div className="min-h-[40px] bg-white dark:bg-gray-800 rounded p-2 text-gray-900 dark:text-white">
            {error ? (
              <span className="text-red-500 text-sm">{t('drawingGame.error')}</span>
            ) : (
              recognizedText || t('drawingGame.placeholder')
            )}
          </div>
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border-2 border-gray-300 dark:border-gray-600 mx-auto bg-white cursor-crosshair touch-none"
      />
      
      <div className="flex justify-center mt-4 space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearCanvas}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Eraser className="w-4 h-4 mr-2" />
          {t('drawingGame.clear')}
        </motion.button>
      </div>
    </motion.div>
  );
};

const Hero: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState<ProfileContent | null>(null);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <p className="text-red-500 text-lg font-medium">Error loading profile: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative w-16 h-16">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-full bg-blue-500/30"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  const getTranslatedContent = (fieldName: keyof ProfileContent) => {
    // Add debugging logs
    console.log('Getting translation for:', fieldName);
    console.log('Current language:', i18n.language);
    console.log('Available translations:', translations);
    console.log('Translation exists:', translations[fieldName]);
    
    // Check if we have a translation for this field
    if (i18n.language === 'fr' && translations[fieldName]) {
      return translations[fieldName];
    }
    
    // Fallback to original content
    return profile ? profile[fieldName] : '';
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden pt-20 pb-10">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.02]" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-30 dark:opacity-20" />
      </motion.div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16"
        >
          <motion.div variants={itemVariants} className="md:w-1/2 text-center md:text-left">
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
            >
              {t('hero.greeting')} <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {getTranslatedContent('full_name')}
              </span>
            </motion.h1>

            <motion.h2 
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8"
            >
              {getTranslatedContent('title')}
            </motion.h2>

            <motion.p 
              variants={itemVariants}
              className="text-gray-600 dark:text-gray-300 mb-10 max-w-2xl leading-relaxed"
            >
              {getTranslatedContent('description')}
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col space-y-4 mb-10 text-gray-600 dark:text-gray-300"
            >
              {[
                { icon: <Phone size={18} />, content: profile.phone },
                { icon: <Mail size={18} />, content: profile.email },
                { icon: <MapPin size={18} />, content: profile.location }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="flex items-center justify-center md:justify-start space-x-3"
                >
                  <span className="text-blue-600 dark:text-blue-400">{item.icon}</span>
                  <span>{item.content}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-4 justify-center md:justify-start"
            >
              <Link
                to="/contact"
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {t('hero.contact')}
              </Link>
              <Link
                to="/projects"
                className="px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                {t('hero.viewWork')}
              </Link>
              <Link
                to="/resume"
                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex items-center space-x-2 hover:-translate-y-0.5"
              >
                <FileText className="w-5 h-5" />
                <span>{t('hero.resume')}</span>
              </Link>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="flex space-x-6 mt-10 justify-center md:justify-start"
            >
              {[
                { href: "https://github.com/jasonachkar", icon: <Github size={24} /> },
                { href: "https://linkedin.com/in/jason-achkar-diab", icon: <Linkedin size={24} /> },
                { href: `mailto:${profile.email}`, icon: <Mail size={24} /> }
              ].map((item, index) => (
                <motion.a
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg"
                >
                  {item.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={imageVariants}
            className="md:w-1/2 flex flex-col items-center space-y-8"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative w-64 h-64 md:w-80 md:h-80"
            >
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 360],
                  borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "50%"]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-400/20 dark:to-purple-400/20"
              />
              <img
                src={profile.image_url}
                alt={getTranslatedContent('image_alt')}
                className="rounded-full w-full h-full object-cover border-4 border-white dark:border-gray-800 shadow-2xl relative z-10"
              />
            </motion.div>

            <DrawingGame />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;