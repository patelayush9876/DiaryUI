import { Outlet, Navigate } from 'react-router';
import { useDiary } from '../../context/DiaryContext';
import { motion } from 'motion/react';
import { Book } from 'lucide-react';

export const AuthLayout = () => {
  const { user } = useDiary();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with blur effect */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1580567814278-64f290c71bf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb3VybmFsJTIwbm90ZWJvb2slMjBkZXNrJTIwYWVzdGhldGljfGVufDF8fHx8MTc3NTg0MDIyM3ww&ixlib=rb-4.1.0&q=80&w=1080)',
        }}
      >
        <div className="absolute inset-0 backdrop-blur-md bg-black/30" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-200/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: -10,
            }}
            animate={{
              y: window.innerHeight + 10,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-4 shadow-lg"
            >
              <Book className="w-8 h-8 text-amber-800" />
            </motion.div>
            <h1 className="text-4xl text-white mb-2 font-serif">Dear Diary</h1>
            <p className="text-amber-100">Your personal sanctuary for thoughts</p>
          </div>

          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};
