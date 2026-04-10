import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin-auth') === 'true';
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [navigate]);

  return <>{children}</>;
}
