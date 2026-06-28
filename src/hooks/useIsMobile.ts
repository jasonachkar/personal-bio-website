'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect if the device is mobile/touch
 * Used for conditional rendering and performance optimizations
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(true); // Default to true (safer for mobile-first)

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkIsMobile = () => {
      // Check for touch device
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Check screen width (mobile typically < 768px, tablet < 1024px)
      const isSmallScreen = window.innerWidth < 1024;
      
      // Check user agent for mobile devices
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      
      // Consider it mobile if it's a touch device with small screen, or has mobile user agent
      setIsMobile(hasTouchScreen && isSmallScreen || isMobileUserAgent);
    };

    // Check immediately
    checkIsMobile();

    // Listen for resize events (e.g., device rotation)
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}

