import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { devolverEntrada } from '../../api/admin'

interface Props {
  entradaId: string
  docenteNombre: string
  practica: string
  numeroGrupo: number
  onClose: () => void
  onExito: () => void
}

export function ModalDevolverEntrada({
  entradaId, docenteNombre, practica,
  numeroGrupo, onClose, onExito,
}: Props) {
  const [observacion, setObservacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const puedeConfirmar = observacion.trim().length > 0

  const handleConfirmar = async () => {
    if (!puedeConfirmar) return
    try {
      setCargando(true)
      setError(null)
      await devolverEntrada(entradaId, observacion)
      onExito()
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { mensaje?: string } } })
          ?.response?.data?.mensaje ?? 'Error al devolver la entrada.'
      )
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[520px] mx-4">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-danger-bg flex items-center justify-center">
              <AlertTriangle size={20} className="text-danger" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-main">
                Devolver entrada al docente
              </h2>
              <p className="text-sm text-text-muted mt-0.5">
                {docenteNombre} · Práctica {practica} · Grupo {numeroGrupo}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-main">
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">

          {/* Advertencia */}
          <div className="bg-warning-bg border border-yellow-200 rounded-lg px-4 py-3 mb-4 text-sm text-warning">
            Solo se devolverá la entrada de este docente.
            Las demás entradas del programa no se verán afectadas.
          </div>

          {/* Textarea observación */}
          <div>
            <label className="text-sm font-semibold text-text-main block mb-1">
              Observación para el docente
              <span className="text-danger ml-1">*</span>
            </label>
            <textarea
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              placeholder="Describe qué debe corregir el docente..."
              rows={4}
              maxLength={1000}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-text-main resize-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-text-muted">
                El docente verá este mensaje al ingresar al sistema.
              </p>
              <span className="text-xs text-text-muted">
                {observacion.length}/1000
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-3 text-sm text-danger bg-danger-bg rounded-lg px-4 py-2">
              {error}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-text-secondary hover:text-text-main"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={!puedeConfirmar || cargando}
            className="px-5 py-2 bg-danger text-white text-sm font-semibold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-800 transition-colors"
          >
            {cargando ? 'Devolviendo...' : 'Confirmar devolución'}
          </button>
        </div>

      </div>
    </div>
  )
}
