import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { authApi } from '@/api'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setTokens: (access: string, refresh: string) => void
  setUser: (user: User) => void
  login: (email: string, password: string) => Promise<void>
  register: (full_name: string, email: string, password: string) => Promise<void>
  logout: () => void
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      setTokens: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh, isAuthenticated: true }),

      setUser: (user) => set({ user }),

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await authApi.login({ email, password })
          const tokens = data.data
          set({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token, isAuthenticated: true })
          await get().fetchUser()
        } finally {
          set({ isLoading: false })
        }
      },

      register: async (full_name, email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await authApi.register({ full_name, email, password })
          const tokens = data.data
          set({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token, isAuthenticated: true })
          await get().fetchUser()
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),

      fetchUser: async () => {
        try {
          const { data } = await authApi.me()
          set({ user: data.data })
        } catch {
          get().logout()
        }
      },
    }),
    {
      name: 'agro-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
