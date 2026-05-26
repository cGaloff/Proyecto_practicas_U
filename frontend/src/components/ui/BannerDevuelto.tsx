import { AlertTriangle } from 'lucide-react'

interface Props {
  observacion: string
  devueltoPor?: string
  devueltoEn?: string | null
}

export function BannerDevuelto({ observacion, devueltoPor, devueltoEn }: Props) {
  const fechaFormateada = devueltoEn
    ? new Date(devueltoEn).toLocaleDateString('es-CO', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null

  return (
    <div className="flex gap-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-5">
      <div className="flex-shrink-0 mt-0.5">
        <AlertTriangle size={22} className="text-red-600" />
      </div>
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <p className="font-semibold text-red-800 text-body-md">
          Este informe fue devuelto con observaciones
        </p>
        <div className="bg-red-100 border border-red-200 rounded-lg px-4 py-3">
          <p className="text-body-sm text-red-900">{observacion}</p>
        </div>
        {(fechaFormateada || devueltoPor) && (
          <p className="text-xs text-red-600/80">
            {fechaFormateada && `Devuelto el ${fechaFormateada}`}
            {fechaFormateada && devueltoPor && ' · '}
            {devueltoPor && `por ${devueltoPor}`}
          </p>
        )}
      </div>
    </div>
  )
}
