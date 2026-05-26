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
      <div className="flex items-center gap-3 px-4 pt-6 pb-5">
        <img
          src="/logos/logo-oeum.png"
          alt="PFCE"
          className="h-12 w-12 object-contain flex-shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <div className="flex flex-col leading-tight">
          <span className="text-white font-bold text-[17px]">PFCE</span>
          <span className="text-white/70 text-[12px]">Universidad del Magdalena</span>
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
                    {g.estado === 'Enviado' ? (
                      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-success flex-shrink-0">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    ) : g.estado === 'Devuelto' ? (
                      <span className="w-2 h-2 rounded-full bg-danger flex-shrink-0" />
                    ) : activo ? (
                      <span className="w-2 h-2 rounded-full bg-white flex-shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full border border-white/50 flex-shrink-0" />
                    )}
                    <span className={`text-label-caps leading-tight ${activo ? 'text-white font-medium' : ''}`}>
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
      <div className="px-4 py-4 border-t border-white/10">
        <img
          src="/logos/banner.png"
          alt="Unimagdalena acreditada"
          className="w-full max-w-[180px] object-contain opacity-90"
          style={{ filter: 'brightness(1.1)' }}
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
