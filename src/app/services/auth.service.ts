import API from '../api/api.config';
import {
  ApiResponse,
  ApiResult,
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  MeResponse,
  RefreshTokenPayload,
  RefreshTokenResponse,
  RegisterPayload,
  RegisterResponse,
} from '../interfaces/auth.interface';
import { tokenStorage } from '../utils/token';

const unwrapApiResult = <T>(payload: ApiResult<T>): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data as T;
  }

  return payload as T;
};

const authService = {
  register: async (payload: RegisterPayload): Promise<ApiResult<RegisterResponse>> => {
    const response = await API.post<ApiResult<RegisterResponse>>('/auth/register', payload);
    const authData = unwrapApiResult(response.data);

    const accessToken = authData?.accessToken;
    const refreshToken = authData?.refreshToken;

    if (accessToken) {
      tokenStorage.setTokens(accessToken, refreshToken);
    }

    return response.data;
  },

  login: async (payload: LoginPayload): Promise<ApiResult<LoginResponse>> => {
    const response = await API.post<ApiResult<LoginResponse>>('/auth/login', payload);
    const authData = unwrapApiResult(response.data);

    const accessToken = authData?.accessToken;
    const refreshToken = authData?.refreshToken;

    if (accessToken) {
      tokenStorage.setTokens(accessToken, refreshToken);
    }

    return response.data;
  },

  adminLogin: async (payload: LoginPayload): Promise<ApiResult<LoginResponse>> => {
    const response = await API.post<ApiResult<LoginResponse>>('/auth/admin/login', payload);
    const authData = unwrapApiResult(response.data);

    const accessToken = authData?.accessToken;
    const refreshToken = authData?.refreshToken;

    if (accessToken) {
      tokenStorage.setTokens(accessToken, refreshToken);
    }

    return response.data;
  },

  refreshToken: async (
    payload: RefreshTokenPayload
  ): Promise<ApiResult<RefreshTokenResponse>> => {
    const response = await API.post<ApiResult<RefreshTokenResponse>>('/auth/refresh', payload);
    const authData = unwrapApiResult(response.data);

    const accessToken = authData?.accessToken;
    const refreshToken = authData?.refreshToken;

    if (accessToken) {
      tokenStorage.setTokens(accessToken, refreshToken);
    }

    return response.data;
  },

  logout: async (): Promise<ApiResult<LogoutResponse>> => {
    const response = await API.post<ApiResult<LogoutResponse>>('/auth/logout');

    tokenStorage.removeToken();

    return response.data;
  },

  getCurrentUser: async (): Promise<ApiResult<MeResponse>> => {
    const response = await API.get<ApiResult<MeResponse>>('/auth/me');
    return response.data;
  },
};

export default authService;
