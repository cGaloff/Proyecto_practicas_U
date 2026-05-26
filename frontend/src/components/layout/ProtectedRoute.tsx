import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import type { LoginResponse } from '../../types/auth'

interface Props {
  requiredRole?: LoginResponse['rol']
}

export function ProtectedRoute({ requiredRole }: Props) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />
  if (requiredRole && user.rol !== requiredRole) return <Navigate to="/login" replace />

  return <Outlet />
}
