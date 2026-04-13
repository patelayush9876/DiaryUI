export const tokenStorage = {
  getToken: (): string | null => {
    return localStorage.getItem('accessToken');
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem('refreshToken');
  },

  setToken: (token: string) => {
    localStorage.setItem('accessToken', token);
  },

  setRefreshToken: (token: string) => {
    localStorage.setItem('refreshToken', token);
  },

  setTokens: (accessToken: string, refreshToken?: string) => {
    localStorage.setItem('accessToken', accessToken);

    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  },

  removeToken: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};
