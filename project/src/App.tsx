import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import LoadingScreen from './components/LoadingScreen';
import SplashScreen from './components/SplashScreen';
import ResumeViewer from './components/ResumeViewer';

const AppContent: React.FC = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  // Check if this is the first load of the application
  useEffect(() => {
    // Only show splash screen on the homepage and on first load
    if (location.pathname !== '/') {
      setShowSplashScreen(false);
    }
  }, [location.pathname]);

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
    <AnimatePresence mode="wait">
      {showSplashScreen ? (
        <SplashScreen key="splash-screen" onComplete={handleSplashScreenComplete} />
      ) : (
        <MainLayout>
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
        </MainLayout>
      )}
    </AnimatePresence>
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