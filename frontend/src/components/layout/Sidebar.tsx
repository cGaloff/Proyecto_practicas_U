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
      <div className="flex items-center gap-3 px-4 py-5">
        <img
          src="/logos/logo-oeum.png"
          alt="Logo FCE"
          className="h-9 w-9 object-contain flex-shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <div className="flex flex-col">
          <span className="text-white font-semibold text-[15px] leading-tight">Practicas FCE</span>
          <span className="text-white/60 text-[11px] leading-tight">Universidad del Magdalena</span>
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

      <div className="px-3 pb-3">
        <img
          src="/logos/banner.png"
          alt="Unimagdalena"
          className="w-full object-contain opacity-80"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
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
