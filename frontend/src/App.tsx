import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './pages/Login'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { DocenteLayout } from './components/layout/DocenteLayout'
import { Dashboard } from './pages/docente/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute requiredRole="Docente" />}>
          <Route element={<DocenteLayout />}>
            <Route path="/docente" element={<Dashboard />} />
            <Route path="/docente/historial" element={<PlaceholderPage title="Historial" />} />
            <Route path="/docente/perfil" element={<PlaceholderPage title="Mi perfil" />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/docente" replace />} />
        <Route path="*" element={<Navigate to="/docente" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-on-surface-variant text-body-md">{title} — próximamente</p>
    </div>
  )
}
