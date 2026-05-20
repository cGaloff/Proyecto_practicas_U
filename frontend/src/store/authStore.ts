import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LoginResponse, Rol } from '../types/auth'

interface AuthUser {
  nombreCompleto: string
  correo: string
  rol: Rol
  primerLogin: boolean
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  setAuth: (payload: LoginResponse) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (payload) => {
        localStorage.setItem('ppi_token', payload.token)
        set({
          token: payload.token,
          isAuthenticated: true,
          user: {
            nombreCompleto: payload.nombreCompleto,
            correo: payload.correo,
            rol: payload.rol,
            primerLogin: payload.primerLogin,
          },
        })
      },
      clearAuth: () => {
        localStorage.removeItem('ppi_token')
        set({ token: null, user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'ppi_auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
