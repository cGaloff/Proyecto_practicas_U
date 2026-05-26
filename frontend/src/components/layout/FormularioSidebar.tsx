import { useNavigate } from 'react-router-dom'
import { CheckCircle, AlertTriangle, Settings, HelpCircle } from 'lucide-react'

interface Seccion {
  id: number
  nombre: string
}

interface Grupo {
  entradaId: string
  practica: string
  numeroGrupo: number
  estado: string
}

interface Props {
  secciones: Seccion[]
  seccionActiva: number
  seccionesCompletadas: Set<number>
  grupos: Grupo[]
  entradaIdActiva: string
  onCambiarSeccion: (seccion: number) => void
  estadoEntrada?: string
}

export function FormularioSidebar({
  secciones,
  seccionActiva,
  seccionesCompletadas,
  grupos,
  entradaIdActiva,
  onCambiarSeccion,
  estadoEntrada,
}: Props) {
  const navigate = useNavigate()

  const handleSeccion = (id: number) => {
    if (seccionesCompletadas.has(id) || id === seccionActiva) {
      onCambiarSeccion(id)
    }
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-[224px] bg-primary flex flex-col py-8 z-20">

      {/* 1. LOGO / TÍTULO */}
      <div className="flex items-center gap-3 px-4 py-5">
        <img
          src="/logos/logo-oeum.png"
          alt="Logo FCE"
          className="h-9 w-9 object-contain flex-shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <div className="flex flex-col">
          <span className="text-white font-semibold text-[15px] leading-tight">Practicas FCE</span>
          <span className="text-white/60 text-[11px] leading-tight">Universidad del Magdalena</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto px-3">

        {/* 2. SELECTOR DE GRUPOS — solo si hay más de 1 */}
        {grupos.length > 1 && (
          <>
            <div className="space-y-1 mb-3">
              {grupos.map((g) => {
                const activo = g.entradaId === entradaIdActiva
                return (
                  <button
                    key={g.entradaId}
                    onClick={() => navigate(`/docente/entradas/${g.entradaId}`)}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-left transition-all duration-200 ${
                      activo
                        ? 'bg-white/10 text-secondary-fixed'
                        : 'text-primary-fixed/70 hover:text-primary-fixed hover:bg-white/5'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      activo ? 'bg-secondary-fixed-dim' : 'bg-primary-fixed/30'
                    }`} />
                    <span className="text-label-caps leading-tight">
                      Práctica {g.practica} · Grupo {g.numeroGrupo}
                    </span>
                  </button>
                )
              })}
            </div>
            {/* Separador entre grupos y secciones */}
            <div className="border-t border-white/10 mb-3" />
          </>
        )}

        {/* 3. NAVEGACIÓN DE SECCIONES */}
        <div className="space-y-1">
          {secciones.map((s) => {
            const completado = seccionesCompletadas.has(s.id)
            const activo = s.id === seccionActiva
            const navegable = completado || activo
            return (
              <button
                key={s.id}
                onClick={() => handleSeccion(s.id)}
                disabled={!navegable}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-left transition-all duration-200 disabled:cursor-not-allowed ${
                  activo
                    ? 'bg-white/10 text-secondary-fixed'
                    : completado
                    ? 'text-primary-fixed hover:bg-white/5'
                    : 'text-primary-fixed/40'
                }`}
              >
                {estadoEntrada === 'Devuelto' && activo ? (
                  <AlertTriangle size={14} className="text-orange-400 flex-shrink-0" />
                ) : completado ? (
                  <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                ) : (
                  <span className={`w-3.5 h-3.5 flex-shrink-0 flex items-center justify-center rounded-full border text-[9px] font-bold ${
                    activo ? 'border-secondary-fixed-dim text-secondary-fixed' : 'border-primary-fixed/30 text-primary-fixed/30'
                  }`}>
                    {s.id}
                  </span>
                )}
                <span className="text-label-caps leading-tight">
                  {completado ? s.nombre : `${s.id}. ${s.nombre}`}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* BANNER INSTITUCIONAL */}
      <div className="px-3 pb-3">
        <img
          src="/logos/banner.png"
          alt="Unimagdalena"
          className="w-full object-contain opacity-80"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      </div>

      {/* 4. BOTÓN VOLVER AL INICIO */}
      <div className="px-3">
        <button
          onClick={() => navigate('/docente')}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-primary-fixed/50 hover:text-primary-fixed/80 hover:bg-white/5 transition-all duration-200 text-left"
        >
          <span className="text-label-caps">← Volver al inicio</span>
        </button>
      </div>

      {/* 5. CONFIGURACIÓN Y AYUDA */}
      <div className="border-t border-white/10 mt-3 pt-4 px-3 space-y-1">
        <button className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-primary-fixed/50 hover:text-primary-fixed hover:bg-white/5 transition-all duration-200">
          <Settings size={14} className="flex-shrink-0" />
          <span className="text-label-caps">Configuración</span>
        </button>
        <button className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-primary-fixed/50 hover:text-primary-fixed hover:bg-white/5 transition-all duration-200">
          <HelpCircle size={14} className="flex-shrink-0" />
          <span className="text-label-caps">Ayuda</span>
        </button>
      </div>
    </aside>
  )
}
