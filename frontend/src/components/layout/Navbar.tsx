import { useAuthStore } from '../../store/authStore'

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function Navbar() {
  const user = useAuthStore((s) => s.user)

  return (
    <header className="h-16 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 fixed top-0 left-[260px] right-0 z-10 flex items-center justify-between px-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
          Semestre 2025-I
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-on-surface leading-none">{user?.nombreCompleto ?? ''}</p>
          <p className="text-xs text-on-surface-variant mt-0.5">{user?.correo ?? ''}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold select-none">
          {user?.nombreCompleto ? getInitials(user.nombreCompleto) : '?'}
        </div>
      </div>
    </header>
  )
}
