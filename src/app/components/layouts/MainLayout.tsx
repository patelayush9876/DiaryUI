import { Outlet, Navigate, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';
import {
  Book,
  Calendar,
  BarChart3,
  Palette,
  Settings as SettingsIcon,
  LogOut,
  Sparkles,
  Home,
} from 'lucide-react';
import { Button } from '../ui/button';

export const MainLayout = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const displayName = user.fullName || user.name || user.username || user.email || 'Diary User';
  const avatarSeed = user.username || user.email || displayName;
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
    avatarSeed
  )}`;

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Book, label: 'Write', path: '/write' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: Sparkles, label: 'Memories', path: '/memories' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Palette, label: 'Themes', path: '/themes' },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        className="fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-lg border-r border-amber-200 shadow-xl z-50"
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Book className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-serif text-lg text-amber-900">Dear Diary</h2>
            </div>
          </div>

          {/* User info */}
          <div className="mb-8 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-12 h-12 rounded-full border-2 border-white shadow"
              />
              <div>
                <p className="font-serif text-amber-900">{displayName}</p>
                <p className="text-xs text-amber-700">Keep writing...</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg'
                      : 'text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="absolute bottom-6 left-6 right-6">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};
