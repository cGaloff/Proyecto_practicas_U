import { CheckCircle, ArrowRight, Home } from 'lucide-react'
import type { GrupoConEntradaDto } from '../../types/docente'

interface Props {
  grupoEnviado: {
    practica: string
    numeroGrupo: number
  }
  gruposRestantes: GrupoConEntradaDto[]
  onIrSiguiente: (entradaId: string) => void
  onIrDashboard: () => void
}

export function ModalEnvioExitoso({
  grupoEnviado,
  gruposRestantes,
  onIrSiguiente,
  onIrDashboard,
}: Props) {
  const siguienteGrupo = gruposRestantes[0]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[480px] mx-4 p-8 text-center">

        {/* Ícono de éxito */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-success-bg flex items-center justify-center">
            <CheckCircle size={32} className="text-success" />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-xl font-bold text-text-main mb-2">
          ¡Informe enviado exitosamente!
        </h2>

        {/* Subtítulo */}
        <p className="text-text-secondary text-sm mb-6">
          Práctica {grupoEnviado.practica} · Grupo {grupoEnviado.numeroGrupo} fue enviado correctamente.
        </p>

        {/* Grupos restantes */}
        <div className="bg-warning-bg border border-yellow-200 rounded-lg px-4 py-3 mb-6 text-left">
          <p className="text-sm font-semibold text-warning mb-1">
            Tienes {gruposRestantes.length} grupo{gruposRestantes.length > 1 ? 's' : ''} pendiente{gruposRestantes.length > 1 ? 's' : ''}
          </p>
          <ul className="text-sm text-warning/80 space-y-1">
            {gruposRestantes.map((g) => (
              <li key={g.entradaId}>
                · Práctica {g.practica} · Grupo {g.numeroGrupo} ({g.matriculados} estudiantes)
              </li>
            ))}
          </ul>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => onIrSiguiente(siguienteGrupo.entradaId ?? '')}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white font-semibold text-sm rounded-lg hover:bg-primary-container transition-colors"
          >
            Completar Práctica {siguienteGrupo.practica} · Grupo {siguienteGrupo.numeroGrupo}
            <ArrowRight size={16} />
          </button>

          <button
            onClick={onIrDashboard}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 border border-gray-200 text-text-secondary text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Home size={16} />
            Ir al dashboard
          </button>
        </div>

      </div>
    </div>
  )
}
