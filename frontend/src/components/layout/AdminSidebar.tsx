import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { LayoutDashboard, Building2, User, Download, LogOut } from 'lucide-react'

const ITEMS = [
  { label: 'Resumen general', icon: LayoutDashboard, path: '/admin' },
  { label: 'Por programa',    icon: Building2,       path: '/admin/programas' },
  { label: 'Por docente',     icon: User,            path: '/admin/docentes' },
  { label: 'Exportar',        icon: Download,        path: '/admin/exportar' },
]

export function AdminSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { clearAuth, user } = useAuthStore()

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  const initials = user?.nombreCompleto
    ?.split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() ?? 'AA'

  return (
    <aside className="fixed top-0 left-0 h-full w-[224px] flex flex-col z-40 bg-[#002f5a]">

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-orange-400 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">PPI</span>
        </div>
        <div className="min-w-0">
          <p className="font-bold text-white text-sm leading-tight truncate">PPI Unimagdalena</p>
          <p className="text-[11px] text-blue-300 mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-0.5 mt-4 flex-1 px-3 overflow-y-auto">
        {ITEMS.map(({ label, icon: Icon, path }) => {
          const activo =
            path === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(path)
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 text-sm font-medium ${
                activo
                  ? 'border-l-4 border-orange-400 bg-white/10 text-white pl-[calc(0.75rem-4px)]'
                  : 'text-blue-200 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
              }`}
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          )
        })}
      </nav>

      {/* Fondo: avatar + cerrar sesión */}
      <div className="px-3 pb-5 border-t border-white/10 pt-4">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
          <span className="text-blue-200 text-xs truncate">{user?.nombreCompleto ?? 'Administrador'}</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-blue-300 hover:text-white hover:bg-white/5 transition-all text-sm"
        >
          <LogOut size={15} className="flex-shrink-0" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
