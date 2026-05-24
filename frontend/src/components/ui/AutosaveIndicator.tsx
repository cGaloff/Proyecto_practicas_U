interface Props {
  guardando: boolean
  guardadoEn: Date | null
}

export function AutosaveIndicator({ guardando }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className={`w-2 h-2 rounded-full ${
        guardando ? 'bg-yellow-400 animate-pulse' : 'bg-emerald-500 animate-pulse'
      }`} />
      <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
        {guardando ? 'Guardando...' : 'Guardado automáticamente'}
      </span>
    </div>
  )
}
