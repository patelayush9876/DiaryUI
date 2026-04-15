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

export interface DiaryUser {
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
}

export interface CreateDiaryEntryPayload {
  title: string;
  content: string;
  mood: Mood;
  tags: string[];
  images?: string[];
  fontStyle?: string;
  date?: string;
}

export interface UpdateDiaryEntryPayload {
  title?: string;
  content?: string;
  mood?: Mood;
  tags?: string[];
  images?: string[];
  fontStyle?: string;
  date?: string;
}

export interface CreateDiaryEntryRequestDto {
  encryptedContent: string;
  iv: string;
  algorithm?: string;
  cipherVersion?: string;
  title?: string;
  mood?: string;
  tags?: string[];
  mediaIds?: string[];
  entryDate: string;
}

export interface UpdateDiaryEntryRequestDto {
  encryptedContent?: string;
  iv?: string;
  algorithm?: string;
  cipherVersion?: string;
  title?: string;
  mood?: string;
  tags?: string[];
  mediaIds?: string[];
  entryDate?: string;
}

export interface ListDiaryEntriesParams {
  startDate?: string;
  endDate?: string;
  mood?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

export interface DiaryApiEntry {
  _id?: string;
  id?: string;
  encryptedContent?: string;
  iv?: string;
  algorithm?: string;
  cipherVersion?: string | null;
  title?: string | null;
  mood?: string | null;
  tags?: string[];
  mediaIds?: string[];
  entryDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DiaryListResponse {
  items?: DiaryApiEntry[];
  entries?: DiaryApiEntry[];
  data?: DiaryApiEntry[];
  page?: number;
  limit?: number;
  total?: number;
}
