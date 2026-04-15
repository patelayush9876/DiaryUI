import { ReactNode, SetStateAction, useEffect } from 'react';
import { ApiResult, MeResponse } from '../interfaces/auth.interface';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  adminLoginUser,
  fetchCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  setAuthLoading,
  setAuthUser,
} from '../store/slices/auth.slice';
import { tokenStorage } from '../utils/token';

type User = MeResponse;

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<any>;
  adminLogin: (credentials: any) => Promise<any>;
  register: (payload: any) => Promise<any>;
  logout: () => Promise<void>;
  setUser: (value: SetStateAction<User | null>) => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = tokenStorage.getToken();

    if (token) {
      dispatch(fetchCurrentUser());
      return;
    }

    dispatch(setAuthLoading(false));
  }, [dispatch]);

  return <>{children}</>;
};

export const useAuth = (): AuthContextType => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);

  const setUser = (value: SetStateAction<User | null>) => {
    const nextUser = typeof value === 'function' ? value(user) : value;
    dispatch(setAuthUser(nextUser));
  };

  return {
    user,
    loading,
    login: async (credentials: any): Promise<ApiResult<any>> => {
      return dispatch(loginUser(credentials)).unwrap();
    },
    adminLogin: async (credentials: any): Promise<ApiResult<any>> => {
      return dispatch(adminLoginUser(credentials)).unwrap();
    },
    register: async (payload: any): Promise<ApiResult<any>> => {
      return dispatch(registerUser(payload)).unwrap();
    },
    logout: async (): Promise<void> => {
      await dispatch(logoutUser()).unwrap();
    },
    setUser,
  };
};
