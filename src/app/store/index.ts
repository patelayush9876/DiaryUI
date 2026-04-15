import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/auth.slice';
import { diaryReducer, persistDiaryState } from './slices/diary.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    diary: diaryReducer,
  },
});

store.subscribe(() => {
  persistDiaryState(store.getState().diary);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
