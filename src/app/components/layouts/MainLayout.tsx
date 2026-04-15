import { Outlet, Navigate, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import {
  Menu,
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

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
      {/* Mobile Menu Button */}
      <div className="fixed left-4 top-4 z-[60] md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(true)}
          className="border-border bg-card/80 text-foreground shadow-lg backdrop-blur-md"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        className={`fixed left-0 top-0 z-50 h-full w-64 border-r border-border bg-card/80 shadow-xl backdrop-blur-lg transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="relative h-full p-6">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <Book className="h-6 w-6 text-white" />
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
                className="h-12 w-12 rounded-full border-2 border-white shadow"
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
                  <Icon className="h-5 w-5" />
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
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="min-h-screen md:ml-64">
        <Outlet />
      </main>
    </div>
  );
};