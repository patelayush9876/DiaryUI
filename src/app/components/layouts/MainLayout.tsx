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

  const displayName = user.name || user.username || user.email || 'Diary User';
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
    <div
      className="min-h-screen bg-background text-foreground transition-colors"
      style={{
        backgroundImage:
          'linear-gradient(to bottom right, var(--app-gradient-start), var(--app-gradient-middle), var(--app-gradient-end))',
      }}
    >
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        className="fixed left-0 top-0 z-50 h-full w-64 border-r border-border bg-card/80 shadow-xl backdrop-blur-lg"
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <Book className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-serif text-2xl text-foreground">Dear Diary</h2>
            </div>
          </div>

          {/* User info */}
          <div className="mb-8 rounded-xl bg-accent/70 p-4">
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-12 h-12 rounded-full border-2 border-white shadow"
              />
              <div>
                <p className="font-serif text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground">Keep writing...</p>
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
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-foreground hover:bg-accent'
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
