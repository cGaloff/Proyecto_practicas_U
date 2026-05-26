import type { EstadoEntrada } from '../../types/docente'

const config: Record<EstadoEntrada, { label: string; className: string }> = {
  SinIniciar: {
    label: 'Sin iniciar',
    className: 'bg-tertiary-fixed text-tertiary-container border border-tertiary-fixed-dim/50',
  },
  Borrador: {
    label: 'Borrador',
    className: 'bg-secondary-fixed text-primary border border-secondary-fixed-dim/50',
  },
  Enviado: {
    label: 'Enviado',
    className: 'bg-success/10 text-success border border-success/20',
  },
  Devuelto: {
    label: 'Devuelto',
    className: 'bg-error/10 text-error border border-error/20',
  },
}

export function Badge({ estado }: { estado: EstadoEntrada }) {
  const { label, className } = config[estado]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  )
}
