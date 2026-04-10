import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Mood = 'happy' | 'calm' | 'sad' | 'anxious' | 'excited' | 'neutral';

export interface DiaryEntry {
  id: string;
  date: string;
  mood: Mood;
  content: string;
  title: string;
  tags: string[];
  images?: string[];
  fontStyle?: string;
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
}

interface DiaryContextType {
  user: User | null;
  entries: DiaryEntry[];
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
  addEntry: (entry: DiaryEntry) => void;
  updateEntry: (id: string, entry: Partial<DiaryEntry>) => void;
  deleteEntry: (id: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  signup: (name: string, email: string, password: string) => void;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error('useDiary must be used within DiaryProvider');
  }
  return context;
};

const STORAGE_KEY = 'diary_data';

// Mock diary entries for demo
const mockEntries: DiaryEntry[] = [
  {
    id: '1',
    date: new Date(2024, 3, 1).toISOString(),
    mood: 'happy',
    title: 'A Beautiful Spring Morning',
    content: `Today was absolutely wonderful! I woke up to the sound of birds chirping and sunlight streaming through my window. I made myself a cup of coffee and sat on the balcony, watching the world wake up.\n\nI've been thinking a lot about gratitude lately. It's amazing how the small things - like a good cup of coffee, a gentle breeze, or a stranger's smile - can make such a difference in our day.\n\nI feel so blessed to be here, alive, and experiencing this beautiful journey called life.`,
    tags: ['gratitude', 'morning', 'happiness'],
  },
  {
    id: '2',
    date: new Date(2024, 2, 15).toISOString(),
    mood: 'calm',
    title: 'Reflections on Change',
    content: `Change is inevitable, they say. And I'm learning to embrace it rather than resist it. Today I spent some time meditating and journaling about the changes happening in my life.\n\nIt's scary sometimes, not knowing what's next. But there's also something exciting about it - the possibility of growth, new experiences, and becoming a better version of myself.\n\nI'm learning to trust the process and have faith that everything will work out as it should.`,
    tags: ['reflection', 'growth', 'meditation'],
  },
  {
    id: '3',
    date: new Date(2024, 1, 28).toISOString(),
    mood: 'excited',
    title: 'New Beginnings',
    content: `I can't contain my excitement! I just got news about something I've been working towards for months. It feels like all the hard work is finally paying off.\n\nThis reminded me that patience and persistence really do matter. There were moments when I wanted to give up, but I kept pushing forward. And now, here I am, celebrating this victory.\n\nI want to remember this feeling - this pure joy and excitement. It's proof that dreams can come true if we're willing to work for them.`,
    tags: ['achievement', 'goals', 'celebration'],
  },
];

export const DiaryProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [currentTheme, setCurrentTheme] = useState('vintage');

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setUser(data.user);
        setEntries(data.entries || mockEntries);
        setCurrentTheme(data.theme || 'vintage');
      } catch (e) {
        console.error('Failed to load stored data');
        setEntries(mockEntries);
      }
    } else {
      // Initialize with mock entries
      setEntries(mockEntries);
    }

    // Create mock user if none exists
    if (!user) {
      const mockUser = {
        name: 'Ayush',
        email: 'ayush@example.com',
        joinDate: '2024-01-15',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ayush'
      };
      setUser(mockUser);
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (user) {
      const data = {
        user,
        entries,
        theme: currentTheme,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [user, entries, currentTheme]);

  const addEntry = (entry: DiaryEntry) => {
    setEntries([entry, ...entries]);
  };

  const updateEntry = (id: string, updates: Partial<DiaryEntry>) => {
    setEntries(entries.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const login = (email: string, password: string) => {
    // Mock login
    const mockUser = {
      name: email.split('@')[0],
      email,
      joinDate: new Date().toISOString().split('T')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    setUser(mockUser);
  };

  const signup = (name: string, email: string, password: string) => {
    const mockUser = {
      name,
      email,
      joinDate: new Date().toISOString().split('T')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
    setEntries([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <DiaryContext.Provider
      value={{
        user,
        entries,
        currentTheme,
        setCurrentTheme,
        addEntry,
        updateEntry,
        deleteEntry,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </DiaryContext.Provider>
  );
};