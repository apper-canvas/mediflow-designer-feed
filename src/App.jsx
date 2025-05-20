import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import { getIcon } from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  
  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);
  
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };
  
  // Get appropriate icon based on current theme
  const ThemeIcon = getIcon(isDarkMode ? 'sun' : 'moon');
  
  return (
    <div className="min-h-screen">
      {/* Theme Toggle Button */}
      <motion.button
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-surface-100 dark:bg-surface-800 shadow-soft text-surface-800 dark:text-surface-200"
        onClick={toggleDarkMode}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        <ThemeIcon size={20} />
      </motion.button>
      
      {/* Main Content */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
        toastStyle={{
          borderRadius: '0.5rem',
          fontFamily: 'Inter, sans-serif',
        }}
      />
    </div>
  );
}

export default App;