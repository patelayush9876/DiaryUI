import { ReactNode, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  clearDiaryError,
  createDiaryEntry,
  deleteDiaryEntry,
  fetchDiaryEntries,
  setCurrentTheme as setCurrentThemeAction,
  setDiaryUser,
  updateDiaryEntry,
  resetDiaryState,
} from '../store/slices/diary.slice';
import {
  CreateDiaryEntryPayload,
  DiaryEntry,
  DiaryUser,
  Mood,
  UpdateDiaryEntryPayload,
} from '../interfaces/diary.interface';

export type { Mood, DiaryEntry };
export type User = DiaryUser;

interface DiaryContextType {
  user: User | null;
  entries: DiaryEntry[];
  currentTheme: string;
  loading: boolean;
  saving: boolean;
  error: string | null;
  setCurrentTheme: (theme: string) => void;
  addEntry: (entry: CreateDiaryEntryPayload) => Promise<DiaryEntry>;
  updateEntry: (id: string, entry: UpdateDiaryEntryPayload) => Promise<DiaryEntry>;
  deleteEntry: (id: string) => Promise<void>;
  refreshEntries: () => Promise<DiaryEntry[]>;
  clearError: () => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  signup: (name: string, email: string, password: string) => void;
}

export const DiaryProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const hasLoaded = useAppSelector((state) => state.diary.hasLoaded);

  useEffect(() => {
    if (authUser) {
      dispatch(
        setDiaryUser({
          name: authUser.name || authUser.username || authUser.email,
          email: authUser.email,
          joinDate: authUser.createdAt
            ? authUser.createdAt.split('T')[0]
            : new Date().toISOString().split('T')[0],
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
            authUser.username || authUser.email || authUser.name || authUser.email
          )}`,
        })
      );
      return;
    }

    dispatch(setDiaryUser(null));
  }, [authUser, dispatch]);

  useEffect(() => {
    if (authUser && !hasLoaded) {
      dispatch(fetchDiaryEntries());
    }
  }, [authUser, hasLoaded, dispatch]);

  return <>{children}</>;
};

export const useDiary = (): DiaryContextType => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.diary.user);
  const entries = useAppSelector((state) => state.diary.entries);
  const currentTheme = useAppSelector((state) => state.diary.currentTheme);
  const loading = useAppSelector((state) => state.diary.loading);
  const saving = useAppSelector((state) => state.diary.saving);
  const error = useAppSelector((state) => state.diary.error);

  return {
    user,
    entries,
    currentTheme,
    loading,
    saving,
    error,
    setCurrentTheme: (theme: string) => {
      dispatch(setCurrentThemeAction(theme));
    },
    addEntry: async (entry: CreateDiaryEntryPayload) => {
      return dispatch(createDiaryEntry(entry)).unwrap();
    },
    updateEntry: async (id: string, entry: UpdateDiaryEntryPayload) => {
      return dispatch(updateDiaryEntry({ id, updates: entry })).unwrap();
    },
    deleteEntry: async (id: string) => {
      await dispatch(deleteDiaryEntry(id)).unwrap();
    },
    refreshEntries: async () => {
      return dispatch(fetchDiaryEntries()).unwrap();
    },
    clearError: () => {
      dispatch(clearDiaryError());
    },
    login: (email: string, _password: string) => {
      const mockUser: User = {
        name: email.split('@')[0],
        email,
        joinDate: new Date().toISOString().split('T')[0],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      };
      dispatch(setDiaryUser(mockUser));
    },
    signup: (name: string, email: string, _password: string) => {
      const mockUser: User = {
        name,
        email,
        joinDate: new Date().toISOString().split('T')[0],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      };
      dispatch(setDiaryUser(mockUser));
    },
    logout: () => {
      dispatch(resetDiaryState());
    },
  };
};
