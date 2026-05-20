import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Rol } from '../types/auth'

interface AuthState {
  token: string | null
  nombreCompleto: string | null
  correo: string | null
  rol: Rol | null
  primerLogin: boolean
  setAuth: (payload: {
    token: string
    nombreCompleto: string
    correo: string
    rol: Rol
    primerLogin: boolean
  }) => void
  clearAuth: () => void
  setPrimerLogin: (value: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      nombreCompleto: null,
      correo: null,
      rol: null,
      primerLogin: false,
      setAuth: (payload) => {
        localStorage.setItem('ppi_token', payload.token)
        set({
          token: payload.token,
          nombreCompleto: payload.nombreCompleto,
          correo: payload.correo,
          rol: payload.rol,
          primerLogin: payload.primerLogin,
        })
      },
      clearAuth: () => {
        localStorage.removeItem('ppi_token')
        set({ token: null, nombreCompleto: null, correo: null, rol: null, primerLogin: false })
      },
      setPrimerLogin: (value) => set({ primerLogin: value }),
    }),
    {
      name: 'ppi_auth',
      partialize: (state) => ({
        token: state.token,
        nombreCompleto: state.nombreCompleto,
        correo: state.correo,
        rol: state.rol,
        primerLogin: state.primerLogin,
      }),
    }
  )
)
