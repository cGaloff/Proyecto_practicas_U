import type { EstadoEntrada } from '../../types/docente'
import type { EstadoInforme } from '../../types/admin'

type EstadoTipo = EstadoEntrada | EstadoInforme | string

const estilos: Record<string, string> = {
  SinIniciar:        'bg-[#e0e3e6] border border-[rgba(196,199,202,0.5)] text-[#414548]',
  Borrador:          'bg-primary-light border border-primary-border text-primary',
  Enviado:           'bg-success-bg border border-green-200 text-success',
  Devuelto:          'bg-danger-bg border border-red-200 text-danger',
  Pendiente:         'bg-[#e0e3e6] border border-[rgba(196,199,202,0.5)] text-[#414548]',
  EnProgreso:        'bg-warning-bg border border-yellow-200 text-warning',
  ListoParaRevision: 'bg-success-bg border border-green-200 text-success',
  EnRevision:        'bg-primary-light border border-primary-border text-primary',
  Aprobado:          'bg-success-bg border border-green-200 text-success',
}

const puntos: Record<string, string> = {
  SinIniciar:        'bg-[rgba(65,69,72,0.5)]',
  Borrador:          'bg-primary',
  Enviado:           'bg-success',
  Devuelto:          'bg-danger',
  Pendiente:         'bg-[rgba(65,69,72,0.5)]',
  EnProgreso:        'bg-warning',
  ListoParaRevision: 'bg-success',
  EnRevision:        'bg-primary',
  Aprobado:          'bg-success',
}

interface Props {
  estado: EstadoTipo
}

export function Badge({ estado }: Props) {
  const clase = estilos[estado] ?? 'bg-gray-100 text-gray-600'
  const punto = puntos[estado] ?? 'bg-gray-400'

  return (
    <span className={`inline-flex items-center gap-[6px] px-[11px] py-[5px] rounded-full text-[12px] font-semibold ${clase}`}>
      <span className={`size-[6px] rounded-full ${punto}`} />
      {estado}
    </span>
  )
}
