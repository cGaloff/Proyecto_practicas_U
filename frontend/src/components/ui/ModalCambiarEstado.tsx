import { useState } from 'react'
import { X } from 'lucide-react'
import { cambiarEstadoInforme } from '../../api/admin'
import type { EstadoInforme } from '../../types/admin'

interface Props {
  informeId: string
  nombrePrograma: string
  onClose: () => void
  onExito: () => void
}

const opciones: { value: EstadoInforme; label: string; desc: string }[] = [
  {
    value: 'EnRevision',
    label: 'En revisión',
    desc: 'El informe está siendo evaluado por el administrador.',
  },
  {
    value: 'Aprobado',
    label: 'Aprobado',
    desc: 'El informe cumple todos los requisitos y queda aprobado.',
  },
  {
    value: 'Devuelto',
    label: 'Devuelto',
    desc: 'El informe requiere correcciones por parte del docente.',
  },
]

export function ModalCambiarEstado({ informeId, nombrePrograma, onClose, onExito }: Props) {
  const [selected, setSelected] = useState<EstadoInforme | null>(null)
  const [observacion, setObservacion] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requiereObservacion = selected === 'Devuelto'
  const puedeConfirmar =
    selected !== null && (!requiereObservacion || observacion.trim().length > 0)

  const handleConfirmar = async () => {
    if (!selected) return
    setEnviando(true)
    setError(null)
    try {
      await cambiarEstadoInforme(informeId, {
        nuevoEstado: selected,
        observacion: requiereObservacion ? observacion.trim() : undefined,
      })
      onExito()
    } catch {
      setError('No se pudo cambiar el estado. Intenta nuevamente.')
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Cambiar estado del informe</h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[280px]">{nombrePrograma}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-3">
          {opciones.map((op) => (
            <label
              key={op.value}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                selected === op.value
                  ? 'border-[#002f5a] bg-blue-50/60'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="estado"
                value={op.value}
                checked={selected === op.value}
                onChange={() => setSelected(op.value)}
                className="mt-0.5 accent-[#002f5a]"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">{op.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{op.desc}</p>
              </div>
            </label>
          ))}

          {requiereObservacion && (
            <div className="mt-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Observación para el docente <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                placeholder="Describe qué debe corregir el docente..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#002f5a]/30 focus:border-[#002f5a] transition-colors"
              />
            </div>
          )}

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            disabled={enviando}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={!puedeConfirmar || enviando}
            className="px-5 py-2 text-sm font-semibold text-white bg-[#002f5a] rounded-lg hover:bg-[#003d73] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {enviando && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {enviando ? 'Guardando...' : 'Confirmar cambio'}
          </button>
        </div>
      </div>
    </div>
  )
}
