import { Bell, Settings } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export function AdminNavbar() {
  const { user } = useAuthStore()

  const initials = user?.nombreCompleto
    ?.split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() ?? 'AD'

  return (
    <header className="fixed top-0 left-[224px] right-0 z-30 h-14 bg-white border-b border-gray-200 flex items-center justify-end px-6">
      <div className="flex items-center gap-4">
        <Bell size={18} className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
        <Settings size={18} className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
        <div className="w-px h-5 bg-gray-200" />
        <span className="text-gray-700 text-sm font-semibold hidden lg:block">
          {user?.nombreCompleto?.toUpperCase() ?? 'ADMINISTRADOR'}
        </span>
        <div className="w-8 h-8 rounded-full bg-[#002f5a] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">{initials}</span>
        </div>
      </div>
    </header>
  )
}
