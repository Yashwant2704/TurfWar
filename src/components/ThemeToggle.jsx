import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 
                 bg-white text-gray-800 border border-gray-200
                 dark:bg-gray-800 dark:text-yellow-400 dark:border-gray-700"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
}