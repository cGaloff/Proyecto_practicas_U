import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './pages/Login'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { DocenteLayout } from './components/layout/DocenteLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { Dashboard } from './pages/docente/Dashboard'
import Formulario from './pages/docente/Formulario'
import EntradaEnviada from './pages/docente/EntradaEnviada'
import AdminDashboard from './pages/admin/Dashboard'
import VistaPrograma from './pages/admin/VistaPrograma'

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
            <Route path="/docente/entradas/:entradaId/ver" element={<EntradaEnviada />} />
          </Route>
          <Route path="/docente/entradas/:entradaId" element={<Formulario />} />
        </Route>

        <Route element={<ProtectedRoute requiredRole="Admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/programas" element={<PlaceholderPage title="Por programa" />} />
            <Route path="/admin/programas/:id" element={<VistaPrograma />} />
            <Route path="/admin/docentes" element={<PlaceholderPage title="Por docente" />} />
            <Route path="/admin/docentes/:id" element={<PlaceholderPage title="Detalle docente" />} />
            <Route path="/admin/exportar" element={<PlaceholderPage title="Exportar" />} />
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
