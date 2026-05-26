import { NavLink, useNavigate } from 'react-router-dom'
import { ClipboardList, History, User, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { logout } from '../../api/auth'

const navItems = [
  { to: '/docente', label: 'Mis grupos', icon: ClipboardList, end: true },
  { to: '/docente/historial', label: 'Historial', icon: History, end: false },
  { to: '/docente/perfil', label: 'Mi perfil', icon: User, end: false },
]

export function Sidebar() {
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try { await logout() } catch { /* ignore */ }
    clearAuth()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="w-[260px] bg-primary fixed left-0 top-0 h-screen py-8 flex flex-col z-20">
      <div className="px-5 mb-8 flex items-center gap-3">
        <img
          src="/logos/logo-pfce.png"
          alt="PFCE"
          className="w-10 h-10 object-contain flex-shrink-0"
        />
        <div className="min-w-0">
          <h1 className="text-white text-base font-semibold leading-tight truncate">Practicas FCE</h1>
          <p className="text-white/65 text-[11px] mt-0.5 truncate">Universidad del Magdalena</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-0.5 px-3">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border-l-4 ${
                isActive
                  ? 'bg-white/10 border-[#a6c9f8] text-[#d2e4ff]'
                  : 'border-transparent text-white/50 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-2 px-4 py-3 border-t border-white/10">
        <img src="/logos/logo-unimagdalena.png" alt="Unimagdalena" className="h-8 w-auto object-contain" />
        <img src="/logos/logo-acreditacion.png" alt="Acreditación" className="h-8 w-auto object-contain" />
      </div>

      <div className="px-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium border-l-4 border-transparent text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
