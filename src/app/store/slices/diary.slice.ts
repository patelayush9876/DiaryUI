import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiResponse } from '../../interfaces/auth.interface';
import {
  CreateDiaryEntryPayload,
  CreateDiaryEntryRequestDto,
  DiaryApiEntry,
  DiaryEntry,
  DiaryListResponse,
  DiaryUser,
  UpdateDiaryEntryPayload,
  UpdateDiaryEntryRequestDto,
} from '../../interfaces/diary.interface';
import { decryptDiaryContent, encryptDiaryContent } from '../../services/diary-crypto.service';
import diaryService from '../../services/diary.service';

export type DiaryState = {
  user: DiaryUser | null;
  entries: DiaryEntry[];
  currentTheme: string;
  loading: boolean;
  saving: boolean;
  deletingEntryIds: string[];
  error: string | null;
  hasLoaded: boolean;
};

const STORAGE_KEY = 'diary_theme';

const extractApiData = <T>(payload: unknown): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponse<T>).data;
  }

  return payload as T;
};

const getUserScope = (user: DiaryUser | null | undefined) => user?.email || 'anonymous';

const resolveEntriesPayload = (payload: DiaryApiEntry[] | DiaryListResponse): DiaryApiEntry[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.items)) {
    return payload.items;
  }

  if (Array.isArray(payload.entries)) {
    return payload.entries;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  return [];
};

const normalizeMood = (mood?: string | null): DiaryEntry['mood'] => {
  const supportedMoods: DiaryEntry['mood'][] = [
    'happy',
    'calm',
    'sad',
    'anxious',
    'excited',
    'neutral',
  ];

  return supportedMoods.includes(mood as DiaryEntry['mood'])
    ? (mood as DiaryEntry['mood'])
    : 'neutral';
};

const normalizeEntry = async (entry: DiaryApiEntry, userScope: string): Promise<DiaryEntry> => ({
  id: entry.id || entry._id || `${Date.now()}`,
  date: entry.entryDate || entry.createdAt || entry.updatedAt || new Date().toISOString(),
  mood: normalizeMood(entry.mood),
  title: entry.title || '',
  content: await decryptDiaryContent(entry.encryptedContent, entry.iv, userScope),
  tags: entry.tags || [],
  images: entry.mediaIds || [],
  fontStyle: undefined,
});

const toCreateDto = async (
  payload: CreateDiaryEntryPayload,
  userScope: string
): Promise<CreateDiaryEntryRequestDto> => {
  const encrypted = await encryptDiaryContent(payload.content, userScope);

  return {
    ...encrypted,
    title: payload.title || undefined,
    mood: payload.mood || undefined,
    tags: payload.tags,
    mediaIds: payload.images,
    entryDate: payload.date || new Date().toISOString(),
  };
};

const toUpdateDto = async (
  payload: UpdateDiaryEntryPayload,
  userScope: string
): Promise<UpdateDiaryEntryRequestDto> => {
  const dto: UpdateDiaryEntryRequestDto = {
    title: payload.title,
    mood: payload.mood,
    tags: payload.tags,
    mediaIds: payload.images,
    entryDate: payload.date,
  };

  if (typeof payload.content === 'string') {
    const encrypted = await encryptDiaryContent(payload.content, userScope);
    dto.encryptedContent = encrypted.encryptedContent;
    dto.iv = encrypted.iv;
    dto.algorithm = encrypted.algorithm;
    dto.cipherVersion = encrypted.cipherVersion;
  }

  return dto;
};

const getInitialState = (): DiaryState => {
  const fallback: DiaryState = {
    user: null,
    entries: [],
    currentTheme: 'vintage',
    loading: false,
    saving: false,
    deletingEntryIds: [],
    error: null,
    hasLoaded: false,
  };

  if (typeof window === 'undefined') {
    return fallback;
  }

  const storedTheme = localStorage.getItem(STORAGE_KEY);

  if (!storedTheme) {
    return fallback;
  }

  try {
    return {
      ...fallback,
      currentTheme: JSON.parse(storedTheme) as string,
    };
  } catch {
    return fallback;
  }
};

const initialState = getInitialState();

export const fetchDiaryEntries = createAsyncThunk(
  'diary/fetchDiaryEntries',
  async (_, { getState }) => {
    const state = getState() as { diary: DiaryState };
    const userScope = getUserScope(state.diary.user);
    const response = await diaryService.getEntries();
    const apiEntries = resolveEntriesPayload(
      extractApiData<DiaryApiEntry[] | DiaryListResponse>(response)
    );

    return Promise.all(apiEntries.map((entry) => normalizeEntry(entry, userScope)));
  }
);

export const createDiaryEntry = createAsyncThunk(
  'diary/createDiaryEntry',
  async (payload: CreateDiaryEntryPayload, { getState }) => {
    const state = getState() as { diary: DiaryState };
    const userScope = getUserScope(state.diary.user);
    const requestBody = await toCreateDto(payload, userScope);
    const response = await diaryService.createEntry(requestBody);
    return normalizeEntry(extractApiData<DiaryApiEntry>(response), userScope);
  }
);

export const updateDiaryEntry = createAsyncThunk(
  'diary/updateDiaryEntry',
  async ({ id, updates }: { id: string; updates: UpdateDiaryEntryPayload }, { getState }) => {
    const state = getState() as { diary: DiaryState };
    const userScope = getUserScope(state.diary.user);
    const requestBody = await toUpdateDto(updates, userScope);
    const response = await diaryService.updateEntry(id, requestBody);
    return normalizeEntry(extractApiData<DiaryApiEntry>(response), userScope);
  }
);

export const deleteDiaryEntry = createAsyncThunk('diary/deleteDiaryEntry', async (id: string) => {
  await diaryService.deleteEntry(id);
  return id;
});

const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    setCurrentTheme(state, action: PayloadAction<string>) {
      state.currentTheme = action.payload;
    },
    setDiaryUser(state, action: PayloadAction<DiaryUser | null>) {
      state.user = action.payload;
    },
    resetDiaryState(state) {
      state.user = null;
      state.entries = [];
      state.currentTheme = 'vintage';
      state.loading = false;
      state.saving = false;
      state.deletingEntryIds = [];
      state.error = null;
      state.hasLoaded = false;
    },
    hydrateDiary(state, action: PayloadAction<DiaryState>) {
      state.user = action.payload.user;
      state.entries = action.payload.entries;
      state.currentTheme = action.payload.currentTheme;
      state.loading = action.payload.loading;
      state.saving = action.payload.saving;
      state.deletingEntryIds = action.payload.deletingEntryIds;
      state.error = action.payload.error;
      state.hasLoaded = action.payload.hasLoaded;
    },
    clearDiaryError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiaryEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiaryEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
        state.hasLoaded = true;
      })
      .addCase(fetchDiaryEntries.rejected, (state, action) => {
        state.loading = false;
        state.hasLoaded = true;
        state.error = action.error.message || 'Failed to load diary entries.';
      })
      .addCase(createDiaryEntry.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createDiaryEntry.fulfilled, (state, action) => {
        state.saving = false;
        state.entries = [action.payload, ...state.entries];
      })
      .addCase(createDiaryEntry.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || 'Failed to save diary entry.';
      })
      .addCase(updateDiaryEntry.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateDiaryEntry.fulfilled, (state, action) => {
        state.saving = false;
        state.entries = state.entries.map((entry) =>
          entry.id === action.payload.id ? action.payload : entry
        );
      })
      .addCase(updateDiaryEntry.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || 'Failed to update diary entry.';
      })
      .addCase(deleteDiaryEntry.pending, (state, action) => {
        state.error = null;
        state.deletingEntryIds.push(action.meta.arg);
      })
      .addCase(deleteDiaryEntry.fulfilled, (state, action) => {
        state.deletingEntryIds = state.deletingEntryIds.filter((id) => id !== action.payload);
        state.entries = state.entries.filter((entry) => entry.id !== action.payload);
      })
      .addCase(deleteDiaryEntry.rejected, (state, action) => {
        state.deletingEntryIds = state.deletingEntryIds.filter((id) => id !== action.meta.arg);
        state.error = action.error.message || 'Failed to delete diary entry.';
      });
  },
});

export const { clearDiaryError, hydrateDiary, resetDiaryState, setCurrentTheme, setDiaryUser } =
  diarySlice.actions;

export const diaryReducer = diarySlice.reducer;

export const persistDiaryState = (state: DiaryState) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.currentTheme));
};
