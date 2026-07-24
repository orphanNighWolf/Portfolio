import { create } from "zustand";

export interface UserContext {
  id: string;
  email: string;
  role: "admin" | "visitor";
}

interface AuthState {
  accessToken: string | null;
  user: UserContext | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string | null) => void;
  setAuth: (accessToken: string, user: UserContext) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  setAccessToken: (token) => set({ accessToken: token }),
  setAuth: (accessToken, user) =>
    set({
      accessToken,
      user,
      isAuthenticated: true,
    }),
  logout: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    }),
}));
