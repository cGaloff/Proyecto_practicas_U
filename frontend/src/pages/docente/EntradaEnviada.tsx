import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Download, ExternalLink, CheckCircle, Users, BookOpen,
  Map, CalendarCheck, Lightbulb, Trophy, AlertTriangle, ArrowUpRight, Link,
} from 'lucide-react'
import { getEntradaDetalleFull, descargarEntrada } from '../../api/docente'
import type { EntradaDetalleDto } from '../../types/docente'

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-body-md text-on-surface">{value}</p>
    </div>
  )
}

function ReadonlyTextarea({ label, icon: Icon, value, iconColor }: {
  label: string
  icon: React.ElementType
  value: string
  iconColor: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-body-sm text-on-surface flex items-center gap-2">
        <Icon size={14} className={iconColor} />
        {label}
      </label>
      <div className="w-full px-4 py-3 border border-outline-variant rounded-lg text-body-md text-on-surface bg-surface-container-lowest min-h-[100px] whitespace-pre-wrap">
        {value || <span className="text-outline italic">Sin información</span>}
      </div>
    </div>
  )
}

export default function EntradaEnviada() {
  const { entradaId } = useParams<{ entradaId: string }>()
  const navigate = useNavigate()
  const [entrada, setEntrada] = useState<EntradaDetalleDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [descargando, setDescargando] = useState(false)

  useEffect(() => {
    if (!entradaId) return
    getEntradaDetalleFull(entradaId)
      .then((res) => setEntrada(res.data))
      .catch(() => setEntrada(null))
      .finally(() => setLoading(false))
  }, [entradaId])

  const handleDescargar = async () => {
    if (!entradaId || !entrada) return
    setDescargando(true)
    try {
      const res = await descargarEntrada(entradaId)
      const url = window.URL.createObjectURL(new Blob([res.data as BlobPart]))
      const a = document.createElement('a')
      a.href = url
      a.download = `informe-${entrada.practica}-grupo${entrada.numeroGrupo}.docx`
      a.click()
      window.URL.revokeObjectURL(url)
    } finally {
      setDescargando(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-on-surface-variant">Cargando informe...</p>
    </div>
  )

  if (!entrada) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-error">No se pudo cargar el informe. Intenta de nuevo.</p>
    </div>
  )

  const s2b = entrada.seccion2B
  const s3 = entrada.seccion3
  const s4a = entrada.seccion4A
  const s4b = entrada.seccion4B
  const s5a = entrada.seccion5A
  const s5b = entrada.seccion5B

  return (
    <div className="flex flex-col gap-6 max-w-5xl">

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/docente')}
          className="flex items-center gap-2 text-body-sm text-on-surface-variant hover:text-on-surface transition"
        >
          <ArrowLeft size={16} />
          Volver al dashboard
        </button>
        <button
          onClick={handleDescargar}
          disabled={descargando}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-container text-on-primary font-bold text-body-sm rounded-lg hover:bg-primary transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={15} />
          {descargando ? 'Descargando...' : 'Descargar .docx'}
        </button>
      </div>

      {/* Header card */}
      <div className="bg-white border border-outline-variant rounded-xl p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-headline-md text-on-surface font-bold mb-1">
              Informe de Práctica Pedagógica
            </h1>
            <p className="text-body-sm text-on-surface-variant">
              {entrada.practica} · Grupo {entrada.numeroGrupo}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5">
            <CheckCircle size={14} className="text-green-600" />
            <span className="text-[12px] font-bold text-green-700 uppercase tracking-wide">Enviado</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          <InfoRow label="Práctica" value={entrada.practica} />
          <InfoRow label="Grupo" value={`Grupo ${entrada.numeroGrupo}`} />
          <InfoRow label="Matriculados" value={entrada.matriculados} />
          {entrada.docenteNombre && <InfoRow label="Docente" value={entrada.docenteNombre} />}
          {entrada.programa && <InfoRow label="Programa" value={entrada.programa} />}
          {entrada.semestre && <InfoRow label="Semestre" value={entrada.semestre} />}
          {entrada.enviadoEn && (
            <InfoRow
              label="Enviado el"
              value={new Date(entrada.enviadoEn).toLocaleDateString('es-CO', {
                day: '2-digit', month: 'long', year: 'numeric',
              })}
            />
          )}
        </div>
      </div>

      {/* Sección 2B — Distribución por lugar de práctica */}
      {s2b && (
        <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="px-8 py-5 border-b border-outline-variant bg-surface-container-lowest flex items-center gap-3">
            <Users size={18} className="text-primary" />
            <h2 className="font-semibold text-body-md text-on-surface">
              Sección 2 · Distribución por lugar de práctica
            </h2>
          </div>
          <div className="p-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Sector público', value: s2b.publica },
              { label: 'Sector privado', value: s2b.privada },
              { label: 'ONG / social', value: s2b.ongSocial },
              { label: 'Vinculación laboral', value: s2b.vinculacionLaboral },
              { label: 'En casa', value: s2b.enCasa },
              { label: 'Otros municipios', value: s2b.otrosMunicipios },
            ].map(({ label, value }) => (
              <div key={label} className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-5 py-4 text-center">
                <p className="text-3xl font-bold text-on-surface">{value}</p>
                <p className="text-[11px] text-on-surface-variant mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección 3 — Progreso de estudiantes */}
      {s3 && (
        <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="px-8 py-5 border-b border-outline-variant bg-surface-container-lowest flex items-center gap-3">
            <BookOpen size={18} className="text-primary" />
            <h2 className="font-semibold text-body-md text-on-surface">
              Sección 3 · Progreso de estudiantes
            </h2>
          </div>
          <div className="p-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { label: 'Iniciaron', value: s3.iniciaron },
              { label: 'Finalizaron', value: s3.finalizaron },
              { label: 'Retirados', value: s3.retirados },
              { label: 'Pendientes', value: s3.pendientes },
              { label: 'No aprobaron', value: s3.noAprobaron },
            ].map(({ label, value }) => (
              <div key={label} className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-5 py-4 text-center">
                <p className="text-3xl font-bold text-on-surface">{value}</p>
                <p className="text-[11px] text-on-surface-variant mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección 4A — Actividades extracurriculares */}
      {s4a && (
        <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="px-8 py-5 border-b border-outline-variant bg-surface-container-lowest flex items-center gap-3">
            <CalendarCheck size={18} className="text-primary" />
            <h2 className="font-semibold text-body-md text-on-surface">
              Sección 4A · Actividades extracurriculares
            </h2>
          </div>
          <div className="p-8 flex flex-col gap-4">
            {[
              { key: 'salidasCampo', label: 'Salidas de campo', icon: Map, color: 'text-blue-500', data: s4a.salidasCampo },
              { key: 'eventosAcademicos', label: 'Eventos académicos', icon: CalendarCheck, color: 'text-emerald-500', data: s4a.eventosAcademicos },
              { key: 'clasesEspejo', label: 'Clases espejo', icon: Users, color: 'text-violet-500', data: s4a.clasesEspejo },
            ].map(({ key, label, icon: Icon, color, data }) => (
              <div key={key} className="border border-outline-variant rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon size={16} className={color} />
                  <span className="font-semibold text-body-sm text-on-surface">{label}</span>
                  <span className={`ml-auto px-2 py-0.5 text-[11px] font-bold rounded-full ${data.aplica ? 'bg-green-100 text-green-700' : 'bg-surface-container text-on-surface-variant'}`}>
                    {data.aplica ? 'Aplica' : 'No aplica'}
                  </span>
                </div>
                {data.aplica && data.descripcion && (
                  <p className="text-body-sm text-on-surface-variant pl-7">{data.descripcion}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección 4B — Estrategias e innovación */}
      {s4b && (
        <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="px-8 py-5 border-b border-outline-variant bg-surface-container-lowest flex items-center gap-3">
            <Lightbulb size={18} className="text-primary" />
            <h2 className="font-semibold text-body-md text-on-surface">
              Sección 4B · Estrategias e innovación
            </h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <ReadonlyTextarea label="Estrategias" icon={Lightbulb} value={s4b.estrategias} iconColor="text-violet-500" />
            <ReadonlyTextarea label="Publicaciones" icon={BookOpen} value={s4b.publicaciones} iconColor="text-violet-500" />
            <ReadonlyTextarea label="Otras actividades" icon={ArrowUpRight} value={s4b.otras} iconColor="text-violet-500" />
          </div>
        </div>
      )}

      {/* Sección 5A — Logros y lecciones */}
      {s5a && (
        <div className="bg-white border border-outline-variant border-l-4 border-l-blue-500 rounded-r-xl rounded-l-none overflow-hidden shadow-sm">
          <div className="px-8 py-5 border-b border-outline-variant bg-blue-50/40 flex items-center gap-3">
            <Trophy size={18} className="text-blue-600" />
            <h2 className="font-semibold text-body-md text-on-surface">
              Sección 5A · Logros y lecciones aprendidas
            </h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReadonlyTextarea label="Logros y avances significativos" icon={Trophy} value={s5a.logros} iconColor="text-blue-500" />
            <ReadonlyTextarea label="Lecciones aprendidas" icon={Lightbulb} value={s5a.lecciones} iconColor="text-blue-500" />
          </div>
        </div>
      )}

      {/* Sección 5B — Retos y recomendaciones */}
      {s5b && (
        <div className="bg-white border border-outline-variant border-l-4 border-l-amber-500 rounded-r-xl rounded-l-none overflow-hidden shadow-sm">
          <div className="px-8 py-5 border-b border-outline-variant bg-amber-50/40 flex items-center gap-3">
            <AlertTriangle size={18} className="text-amber-600" />
            <h2 className="font-semibold text-body-md text-on-surface">
              Sección 5B · Retos y recomendaciones
            </h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReadonlyTextarea label="Limitaciones y retos" icon={AlertTriangle} value={s5b.limitaciones} iconColor="text-amber-500" />
            <ReadonlyTextarea label="Perspectivas y recomendaciones" icon={ArrowUpRight} value={s5b.recomendaciones} iconColor="text-amber-500" />
          </div>
        </div>
      )}

      {/* Sección 6 — Evidencias */}
      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="px-8 py-5 border-b border-outline-variant bg-surface-container-lowest flex items-center gap-3">
          <Link size={18} className="text-primary" />
          <h2 className="font-semibold text-body-md text-on-surface">
            Sección 6 · Enlace de evidencias
          </h2>
        </div>
        <div className="p-8">
          {entrada.enlaceEvidencias ? (
            <a
              href={entrada.enlaceEvidencias}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline text-body-md break-all"
            >
              <ExternalLink size={15} />
              {entrada.enlaceEvidencias}
            </a>
          ) : (
            <p className="text-on-surface-variant italic text-body-sm">Sin enlace de evidencias</p>
          )}
        </div>
      </div>

    </div>
  )
}
