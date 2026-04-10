import { Outlet, NavLink, useNavigate } from 'react-router';
import { LayoutDashboard, Users, Shield, LogOut, Lock } from 'lucide-react';
import { Button } from '../ui/button';
import { ProtectedAdminRoute } from '../admin/ProtectedAdminRoute';

export function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin-auth');
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/users', icon: Users, label: 'User Management' },
  ];

  return (
    <ProtectedAdminRoute>
      <div className="flex h-screen bg-slate-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
          {/* Logo/Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-2 text-slate-800">
              <Shield className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="font-semibold">Admin Portal</h1>
                <p className="text-xs text-slate-500">Diary Platform</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Privacy Notice */}
          <div className="p-4 m-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-green-700 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-green-800 font-medium">Privacy Protected</p>
                <p className="text-xs text-green-700 mt-1">
                  User diary content is end-to-end encrypted and cannot be accessed by admin.
                </p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-slate-200">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-3 text-slate-600 hover:text-slate-800"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </ProtectedAdminRoute>
  );
}
