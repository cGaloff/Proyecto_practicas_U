import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LoginResponse } from '../types/auth'

interface AuthState {
  token: string | null
  user: Omit<LoginResponse, 'token'> | null
  isAuthenticated: boolean
  setAuth: (response: LoginResponse) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (response) => {
        const { token, ...user } = response
        localStorage.setItem('ppi_token', token)
        set({ token, user, isAuthenticated: true })
      },
      clearAuth: () => {
        localStorage.removeItem('ppi_token')
        set({ token: null, user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'ppi_user',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
