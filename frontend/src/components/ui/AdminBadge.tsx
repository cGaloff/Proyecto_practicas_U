import type { EstadoInforme } from '../../types/admin'

const config: Record<EstadoInforme, { label: string; className: string }> = {
  EnProgreso: {
    label: 'En progreso',
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
  ListoParaRevision: {
    label: 'Listo para revisión',
    className: 'bg-green-50 text-green-700 border border-green-200',
  },
  EnRevision: {
    label: 'En revisión',
    className: 'bg-blue-50 text-blue-700 border border-blue-200',
  },
  Devuelto: {
    label: 'Devuelto',
    className: 'bg-red-50 text-red-700 border border-red-200',
  },
  Aprobado: {
    label: 'Aprobado',
    className: 'bg-green-50 text-green-700 border border-green-200',
  },
}

export function AdminBadge({ estado }: { estado: EstadoInforme }) {
  const cfg = config[estado] ?? {
    label: estado,
    className: 'bg-gray-50 text-gray-600 border border-gray-200',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}
