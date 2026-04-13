import {
  ApiResponse,
  MeResponse,
} from '../interfaces/auth.interface';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import authService from '../services/auth.service';
import { tokenStorage } from '../utils/token';

type User = MeResponse;

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<any>;
  adminLogin: (credentials: any) => Promise<any>;
  register: (payload: any) => Promise<any>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await authService.getCurrentUser();
      const userData =
        res && typeof res === 'object' && 'data' in res
          ? (res as ApiResponse<MeResponse>).data
          : (res as MeResponse);

      setUser(userData || null);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: any) => {
    const res = await authService.login(credentials);
    await fetchUser();
    return res;
  };

  const adminLogin = async (credentials: any) => {
    const res = await authService.adminLogin(credentials);
    await fetchUser();
    return res;
  };

  const register = async (payload: any) => {
    const res = await authService.register(payload);
    await fetchUser();
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
      tokenStorage.removeToken();
    }
  };

  useEffect(() => {
    const token = tokenStorage.getToken();

    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        adminLogin,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
