import { NavLink } from 'react-router-dom'
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

  const handleLogout = async () => {
    try { await logout() } catch { /* ignore */ }
    clearAuth()
    window.location.href = '/login'
  }

  return (
    <aside className="w-[260px] bg-primary fixed left-0 top-0 h-screen py-8 flex flex-col z-20">
      <div className="flex items-center gap-3 px-4 pt-6 pb-5">
        <img
          src="/logos/logo-oeum.png"
          alt="PFCE"
          className="h-12 w-12 object-contain flex-shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <div className="flex flex-col leading-tight">
          <span className="text-white font-bold text-[17px]">PFCE</span>
          <span className="text-white/70 text-[12px]">Universidad del Magdalena</span>
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

      <div className="px-4 py-4 border-t border-white/10">
        <img
          src="/logos/banner.png"
          alt="Unimagdalena acreditada"
          className="w-full max-w-[180px] object-contain opacity-90"
          style={{ filter: 'brightness(1.1)' }}
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
