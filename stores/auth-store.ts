import { create } from "zustand"
import type { User, UserRole } from "@/types"
import { mockUsers } from "@/mock/data"
import { useAdminStore } from "./admin-store"

interface AuthState {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  setDemoUser: (role: UserRole) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,

  login: async (username: string, password: string, role: UserRole) => {
    set({ isLoading: true })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (role === "teacher") {
      const teachers = useAdminStore.getState().teachers
      const teacher = teachers.find((t) => t.username === username && t.password === password && t.status === "active")

      if (teacher) {
        const user: User = {
          id: teacher.id,
          username: teacher.username,
          role: "teacher",
          name: teacher.name,
        }
        set({ user, isLoading: false })
        return true
      }
    }

    if (role === "student") {
      const students = useAdminStore.getState().students
      const student = students.find((s) => s.username === username && s.password === password && s.status === "active")

      if (student) {
        const user: User = {
          id: student.id,
          username: student.username,
          role: "student",
          name: student.name,
        }
        set({ user, isLoading: false })
        return true
      }
    }

    // Check mock users for admin
    const user = mockUsers.find((u) => u.username === username && u.role === role)

    if (user && password === "password") {
      set({ user, isLoading: false })
      return true
    }

    set({ isLoading: false })
    return false
  },

  logout: () => set({ user: null }),

  setDemoUser: (role: UserRole) => {
    const user = mockUsers.find((u) => u.role === role)
    if (user) {
      set({ user })
    }
  },
}))
