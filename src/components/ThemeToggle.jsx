import React from 'react';
import './ThemeToggle.css';

export default function ThemeToggle({ theme, setTheme }) {
  return (
    <div className="theme-toggle-wrapper">
      <button 
        className={`theme-btn ${theme === 'light' ? 'active' : ''}`} 
        onClick={() => setTheme('light')}
        title="Light Mode"
      >
        ☀️
      </button>
      <button 
        className={`theme-btn ${theme === 'system' ? 'active' : ''}`} 
        onClick={() => setTheme('system')}
        title="System Auto"
      >
        💻
      </button>
      <button 
        className={`theme-btn ${theme === 'dark' ? 'active' : ''}`} 
        onClick={() => setTheme('dark')}
        title="Dark Mode"
      >
        🌙
      </button>
    </div>
  );
}
