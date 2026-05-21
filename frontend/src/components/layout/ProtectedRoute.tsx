import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

interface Props {
  children: React.ReactNode
  requiredRole?: 'Docente' | 'Admin'
}

export function ProtectedRoute({ children, requiredRole }: Props) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.rol !== requiredRole) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
