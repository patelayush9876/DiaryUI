import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiResponse, MeResponse } from '../../interfaces/auth.interface';
import authService from '../../services/auth.service';
import { tokenStorage } from '../../utils/token';
import { fetchDiaryEntries, resetDiaryState, setDiaryUser } from './diary.slice';

export type AuthState = {
  user: MeResponse | null;
  loading: boolean;
};

const initialState: AuthState = {
  user: null,
  loading: true,
};

const extractUserData = (res: unknown): MeResponse | null => {
  if (res && typeof res === 'object' && 'data' in res) {
    return (res as ApiResponse<MeResponse>).data;
  }

  return (res as MeResponse) || null;
};

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async () => {
  const res = await authService.getCurrentUser();
  return extractUserData(res);
});

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: any, { dispatch }) => {
    const response = await authService.login(credentials);
    const profile = await dispatch(fetchCurrentUser()).unwrap();

    if (profile) {
      dispatch(
        setDiaryUser({
          name: profile.name || profile.username as string,
          email: profile.email,
          joinDate: profile.createdAt
            ? profile.createdAt.split('T')[0]
            : new Date().toISOString().split('T')[0],
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
            profile.username || profile.email || profile.name || profile.email
          )}`,
        })
      );
      dispatch(fetchDiaryEntries());
    }

    return response;
  }
);

export const adminLoginUser = createAsyncThunk(
  'auth/adminLoginUser',
  async (credentials: any, { dispatch }) => {
    const response = await authService.adminLogin(credentials);
    const profile = await dispatch(fetchCurrentUser()).unwrap();

    if (profile) {
      dispatch(
        setDiaryUser({
          name: profile.name as string,
          email: profile.email,
          joinDate: profile.createdAt
            ? profile.createdAt.split('T')[0]
            : new Date().toISOString().split('T')[0],
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
            profile.username || profile.email || profile.name || profile.email
          )}`,
        })
      );
      dispatch(fetchDiaryEntries());
    }

    return response;
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload: any, { dispatch }) => {
    const normalizedPayload = {
      ...payload,
      name: payload?.name,
    };

    const response = await authService.register(normalizedPayload);
    const profile = await dispatch(fetchCurrentUser()).unwrap();

    if (profile) {
      dispatch(
        setDiaryUser({
          name: profile.name as string,
          email: profile.email,
          joinDate: profile.createdAt
            ? profile.createdAt.split('T')[0]
            : new Date().toISOString().split('T')[0],
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
            profile.username || profile.email || profile.name || profile.email
          )}`,
        })
      );
      dispatch(fetchDiaryEntries());
    }

    return response;
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { dispatch }) => {
  try {
    await authService.logout();
  } finally {
    tokenStorage.removeToken();
    dispatch(resetDiaryState());
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser(state, action: PayloadAction<MeResponse | null>) {
      state.user = action.payload;
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(adminLoginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminLoginUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(adminLoginUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
      });
  },
});

export const { setAuthUser, setAuthLoading } = authSlice.actions;
export const authReducer = authSlice.reducer;
