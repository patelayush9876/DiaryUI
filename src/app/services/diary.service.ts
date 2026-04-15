import API from '../api/api.config';
import { ApiResult } from '../interfaces/auth.interface';
import {
  CreateDiaryEntryRequestDto,
  DiaryApiEntry,
  DiaryListResponse,
  ListDiaryEntriesParams,
  UpdateDiaryEntryRequestDto,
} from '../interfaces/diary.interface';

const diaryService = {
  getEntries: async (
    params?: ListDiaryEntriesParams
  ): Promise<ApiResult<DiaryApiEntry[] | DiaryListResponse>> => {
    const response = await API.get<ApiResult<DiaryApiEntry[] | DiaryListResponse>>('/diary', {
      params,
    });
    return response.data;
  },

  getEntryById: async (id: string): Promise<ApiResult<DiaryApiEntry>> => {
    const response = await API.get<ApiResult<DiaryApiEntry>>(`/diary/${id}`);
    return response.data;
  },

  createEntry: async (
    payload: CreateDiaryEntryRequestDto
  ): Promise<ApiResult<DiaryApiEntry>> => {
    const response = await API.post<ApiResult<DiaryApiEntry>>('/diary', payload);
    return response.data;
  },

  updateEntry: async (
    id: string,
    payload: UpdateDiaryEntryRequestDto
  ): Promise<ApiResult<DiaryApiEntry>> => {
    const response = await API.patch<ApiResult<DiaryApiEntry>>(`/diary/${id}`, payload);
    return response.data;
  },

  deleteEntry: async (id: string): Promise<ApiResult<{ id?: string; _id?: string } | void>> => {
    const response = await API.delete<ApiResult<{ id?: string; _id?: string } | void>>(
      `/diary/${id}`
    );
    return response.data;
  },
};

export default diaryService;
