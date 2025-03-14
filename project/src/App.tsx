import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import LoadingScreen from './components/LoadingScreen';
import SplashScreen from './components/SplashScreen';
import ResumeViewer from './components/ResumeViewer';

// Add this at the end of your CSS or in your global styles
const globalStyles = `
  body {
    background-color: #0a0a0a;
    min-height: 100vh;
    margin: 0;
    padding: 0;
  }

  #root {
    min-height: 100vh;
    background-color: #0a0a0a;
  }

  * {
    transition: background-color 0.3s ease;
  }
`;

const AppContent: React.FC = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  
  // Check if this is the first load of the application
  useEffect(() => {
    // Only show splash screen on the homepage and on first load
    if (location.pathname !== '/') {
      setShowSplashScreen(false);
    }
  }, [location.pathname]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSplashScreenComplete = () => {
    setShowSplashScreen(false);
  };

  useEffect(() => {
    // Only handle loading state if splash screen is not showing
    if (!showSplashScreen) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 600); // Slightly shorter loading time

      return () => clearTimeout(timer);
    }
  }, [location.pathname, showSplashScreen]);

  return (
    <div className={`min-h-screen bg-[#0a0a0a] ${darkMode ? 'dark' : ''}`}>
      <style>{globalStyles}</style>
      
      <AnimatePresence mode="wait">
        {showSplashScreen ? (
          <SplashScreen key="splash-screen" onComplete={handleSplashScreenComplete} />
        ) : (
          <>
            <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <AnimatePresence mode="wait">
              {isLoading ? (
                <LoadingScreen key="loading" />
              ) : (
                <AnimatePresence mode="wait">
                  <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Hero />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/experience" element={<Experience />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/resume" element={<ResumeViewer />} />
                  </Routes>
                </AnimatePresence>
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;