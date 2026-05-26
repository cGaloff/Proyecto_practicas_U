import { BookOpen, Hash, GraduationCap, Users, User } from 'lucide-react'

interface SeccionHeaderProps {
  practica: string
  numeroGrupo: number
  matriculados: number
  docenteNombre: string
  programa: string
  paso: number
  totalPasos: number
  labelPaso: string
  tituloSeccion: string
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 bg-surface-container-low border border-outline-variant/40 rounded-xl p-4">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon size={17} className="text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-label-caps text-outline uppercase mb-0.5">{label}</p>
        <p className="text-body-sm font-semibold text-on-surface leading-snug">{value}</p>
      </div>
    </div>
  )
}

export function SeccionHeader({
  practica,
  numeroGrupo,
  matriculados,
  docenteNombre,
  programa,
  paso,
  totalPasos,
  labelPaso,
  tituloSeccion,
}: SeccionHeaderProps) {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <InfoCard icon={BookOpen} label="Práctica" value={practica} />
        <InfoCard icon={Hash} label="Grupo" value={`Grupo ${numeroGrupo}`} />
        <InfoCard icon={GraduationCap} label="Programa" value={programa || '—'} />
        <InfoCard icon={Users} label="Matriculados" value={`${matriculados} estudiantes`} />
        <InfoCard icon={User} label="Docente" value={docenteNombre} />
      </div>

      <p className="text-label-caps text-outline uppercase tracking-wider mb-3">
        PASO {paso} DE {totalPasos} · {labelPaso}
      </p>

      <h1 className="text-headline-md text-primary-container">
        Sección {paso} · {tituloSeccion}
      </h1>
    </div>
  )
}
