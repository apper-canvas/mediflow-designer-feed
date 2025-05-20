import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const NotFound = () => {
  const navigate = useNavigate();
  const AlertCircleIcon = getIcon('alert-circle');
  const HomeIcon = getIcon('home');
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-surface-50 dark:bg-surface-900">
      <motion.div
        className="text-primary dark:text-primary-light mb-6"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AlertCircleIcon size={80} />
      </motion.div>
      
      <motion.h1 
        className="text-3xl md:text-4xl font-bold text-surface-800 dark:text-surface-100 mb-4 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        404 - Page Not Found
      </motion.h1>
      
      <motion.p 
        className="text-surface-600 dark:text-surface-400 text-center mb-8 max-w-md"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        The page you are looking for doesn't exist or has been moved. Please return to the dashboard.
      </motion.p>
      
      <motion.button
        className="btn btn-primary flex items-center gap-2"
        onClick={() => navigate('/')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <HomeIcon size={18} />
        <span>Back to Dashboard</span>
      </motion.button>
    </div>
  );
};

export default NotFound;