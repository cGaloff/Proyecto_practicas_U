import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import { ProtectedRoute } from './components/layout/ProtectedRoute'

const DocenteDashboard = () => (
  <div className="min-h-screen bg-surface flex items-center justify-center">
    <p className="text-text-secondary">Dashboard docente — commit 19</p>
  </div>
)

const AdminDashboard = () => (
  <div className="min-h-screen bg-surface flex items-center justify-center">
    <p className="text-text-secondary">Dashboard admin — commit siguiente</p>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/docente" element={
          <ProtectedRoute requiredRole="Docente">
            <DocenteDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute requiredRole="Admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
