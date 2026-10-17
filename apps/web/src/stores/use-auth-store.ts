import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type RoleType = "student" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: RoleType;
  targetLevel?: "beginner" | "intermediate" | "advanced";
  streakDays?: number;
  totalXp?: number;
  wordsLearned?: number;
}

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserProfile, accessToken: string) => void;
  setUser: (user: UserProfile) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken) =>
        set({
          user,
          accessToken,
          isAuthenticated: true,
        }),
      setUser: (user) => set({ user }),
      clearAuth: () => {
        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();
        }
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "popago-auth-storage",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
