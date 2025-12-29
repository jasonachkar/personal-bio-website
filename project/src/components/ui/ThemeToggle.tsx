import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const ThemeToggle = () => {
  const { theme, toggleTheme, mounted } = useTheme();

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-lg border border-border bg-background-card" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg border border-border bg-background-card p-2 text-text-primary transition-all hover:border-primary/50 hover:bg-background-elevated focus:outline-none focus:ring-2 focus:ring-primary/50"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
