// Common API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type ApiResult<T> = ApiResponse<T> | T;

// User Interface
export interface User {
  _id?: string;
  id?: string;
  fullName?: string;
  name?: string;
  email: string;
  username?: string;
  role: 'USER' | 'ADMIN' | 'user' | 'admin';
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string | null;
}

// Auth Tokens
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Register
export interface RegisterPayload {
  fullName: string;
  email: string;
  username?: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Login
export interface LoginPayload {
  identifier: string; // email or username
  password: string;
  otpCode?: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Refresh Token
export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

// Logout
export interface LogoutResponse {
  message: string;
}

// Get Current User
export type MeResponse = User;
