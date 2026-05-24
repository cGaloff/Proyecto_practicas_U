import { Lock } from 'lucide-react'

interface SeccionHeaderProps {
  practica: string
  numeroGrupo: number
  matriculados: number
  docenteNombre: string
  paso: number
  totalPasos: number
  labelPaso: string
  tituloSeccion: string
}

export function SeccionHeader({
  practica,
  numeroGrupo,
  matriculados,
  docenteNombre,
  paso,
  totalPasos,
  labelPaso,
  tituloSeccion,
}: SeccionHeaderProps) {
  return (
    <div className="mb-8">
      {/* Barra de datos del grupo — solo lectura */}
      <div className="bg-surface-container-low border border-outline-variant/50 rounded-xl p-8 mb-8 relative">
        <div className="absolute top-6 right-6 flex items-center gap-2 text-outline/60">
          <span className="text-[10px] font-medium uppercase tracking-tighter hidden group-hover:block">
            Sistema bloqueado
          </span>
          <Lock size={18} className="cursor-help" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <p className="text-label-caps text-outline uppercase mb-1.5">Práctica</p>
            <p className="text-headline-md text-on-surface">{practica}</p>
          </div>
          <div>
            <p className="text-label-caps text-outline uppercase mb-1.5">Grupo N°</p>
            <p className="text-headline-md text-on-surface">Grupo {numeroGrupo}</p>
          </div>
          <div>
            <p className="text-label-caps text-outline uppercase mb-1.5">Total Matriculados</p>
            <p className="text-headline-md text-on-surface">{matriculados} estudiantes</p>
          </div>
          <div>
            <p className="text-label-caps text-outline uppercase mb-1.5">Docente Principal</p>
            <p className="text-headline-md text-on-surface">{docenteNombre}</p>
          </div>
        </div>
      </div>

      {/* Label del paso */}
      <p className="text-label-caps text-outline uppercase tracking-wider mb-3">
        PASO {paso} DE {totalPasos} · {labelPaso}
      </p>

      {/* Título de la sección */}
      <h1 className="text-headline-md text-primary-container">
        Sección {paso} · {tituloSeccion}
      </h1>
    </div>
  )
}
