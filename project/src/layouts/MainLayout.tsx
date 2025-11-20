import React from 'react';
import Navbar from '../components/Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background font-sans text-text">
      <header className="fixed top-0 left-0 w-full bg-background/80 backdrop-blur-sm z-10 border-b border-primary/20 shadow-[0_0_15px_rgba(0,255,0,0.1)]">
        <Navbar />
      </header>

      <main className="pt-16">
        {children}
      </main>

      {/* Footer will go here */}
      <footer className="text-center py-4 text-secondary">
        <p>&copy; 2025 Jason. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
