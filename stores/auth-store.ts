import { create } from "zustand";
import { User, UserRole } from "@/types";
import { mockUsers } from "@/mock/data";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (
    username: string,
    password: string,
    role: UserRole
  ) => Promise<boolean>;
  logout: () => void;
  setDemoUser: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,

  login: async (username: string, password: string, role: UserRole) => {
    set({ isLoading: true });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = mockUsers.find(
      (u) => u.username === username && u.role === role
    );

    if (user && password === "password") {
      set({ user, isLoading: false });
      return true;
    }

    set({ isLoading: false });
    return false;
  },

  logout: () => set({ user: null }),

  setDemoUser: (role: UserRole) => {
    const user = mockUsers.find((u) => u.role === role);
    if (user) {
      set({ user });
    }
  },
}));
