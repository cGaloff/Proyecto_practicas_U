import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Download, ExternalLink, CheckCircle, AlertTriangle,
  Users, BookOpen, Map, CalendarCheck, Lightbulb, Trophy, ArrowUpRight, Link,
} from 'lucide-react'
import { getEntradaAdmin, descargarEntrada, getAuditoria } from '../../api/admin'
import { Badge } from '../../components/ui/Badge'
import type { EntradaDetalleDto } from '../../types/docente'
import type { AuditoriaItem } from '../../types/admin'

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm text-gray-900">{value}</p>
    </div>
  )
}

function ReadonlyField({ label, icon: Icon, value, iconColor }: {
  label: string
  icon: React.ElementType
  value: string
  iconColor: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <Icon size={14} className={iconColor} />
        {label}
      </label>
      <div className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 min-h-[90px] whitespace-pre-wrap">
        {value || <span className="text-gray-400 italic">Sin información</span>}
      </div>
    </div>
  )
}

export default function VistaEntradaAdmin() {
  const { entradaId } = useParams<{ entradaId: string }>()
  const navigate = useNavigate()
  const [entrada, setEntrada] = useState<EntradaDetalleDto | null>(null)
  const [auditoria, setAuditoria] = useState<AuditoriaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [descargando, setDescargando] = useState(false)

  useEffect(() => {
    if (!entradaId) return
    getEntradaAdmin(entradaId)
      .then((data) => {
        setEntrada(data)
      })
      .catch(() => setError('No se pudo cargar la entrada.'))
      .finally(() => setLoading(false))
  }, [entradaId])

  const handleDescargar = async () => {
    if (!entrada || !entradaId) return
    setDescargando(true)
    try {
      const blob = await descargarEntrada(entradaId)
      const url = window.URL.createObjectURL(new Blob([blob as BlobPart]))
      const a = document.createElement('a')
      a.href = url
      a.download = `informe_${entrada.practica.replace(/ /g, '_')}_grupo${entrada.numeroGrupo}${
        entrada.docenteNombre ? `_${entrada.docenteNombre.split(' ')[0].toLowerCase()}` : ''
      }.docx`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      alert('Error al descargar el informe.')
    } finally {
      setDescargando(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Cargando entrada...</p>
      </div>
    )
  }

  if (error || !entrada) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error ?? 'Entrada no encontrada.'}</p>
      </div>
    )
  }

  const s2b = entrada.seccion2B
  const s3 = entrada.seccion3
  const s4a = entrada.seccion4A
  const s4b = entrada.seccion4B
  const s5a = entrada.seccion5A
  const s5b = entrada.seccion5B
  const esEnviado = entrada.estado === 'Enviado'
  const esDevuelto = entrada.estado === 'Devuelto'

  return (
    <div className="flex flex-col gap-6 max-w-5xl pb-10">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 flex-wrap">
        <button
          onClick={() => navigate('/admin')}
          className="hover:text-[#002f5a] transition-colors"
        >
          Panel admin
        </button>
        <ChevronLeft size={14} className="rotate-180" />
        <button
          onClick={() => navigate(-1)}
          className="hover:text-[#002f5a] transition-colors"
        >
          {entrada.programa ?? 'Volver'}
        </button>
        <ChevronLeft size={14} className="rotate-180" />
        <span className="text-gray-700 font-medium">
          {entrada.docenteNombre ? `${entrada.docenteNombre} · ` : ''}
          {entrada.practica} Grupo {entrada.numeroGrupo}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {entrada.practica} · Grupo {entrada.numeroGrupo}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {[entrada.docenteNombre, entrada.semestre].filter(Boolean).join(' · ')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge estado={entrada.estado} />
          {esEnviado && (
            <button
              onClick={handleDescargar}
              disabled={descargando}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#002f5a] border-2 border-[#002f5a] rounded-lg hover:bg-[#002f5a] hover:text-white transition-colors disabled:opacity-50"
            >
              <Download size={15} />
              {descargando ? 'Descargando...' : 'Descargar .docx'}
            </button>
          )}
        </div>
      </div>

      {/* Banner Enviado */}
      {esEnviado && (
        <div className="flex items-start gap-4 bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle size={18} className="text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-green-800">Informe enviado</p>
            <p className="text-sm text-green-700 mt-0.5">
              {entrada.enviadoEn
                ? new Date(entrada.enviadoEn).toLocaleDateString('es-CO', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })
                : 'Fecha desconocida'}
            </p>
            {entrada.firmaDigital && (
              <p className="text-xs text-green-600/70 mt-1 font-mono">{entrada.firmaDigital}</p>
            )}
          </div>
        </div>
      )}

      {/* Banner Devuelto */}
      {esDevuelto && (
        <div className="flex items-start gap-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-5">
          <div className="flex-shrink-0 mt-0.5">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-red-800">Informe devuelto con observaciones</p>
            {entrada.observacionAdmin && (
              <div className="bg-red-100 border border-red-200 rounded-lg px-4 py-3">
                <p className="text-sm text-red-900">{entrada.observacionAdmin}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Datos del grupo */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <InfoRow label="Práctica" value={entrada.practica} />
          <InfoRow label="Grupo N°" value={`Grupo ${entrada.numeroGrupo}`} />
          <InfoRow label="Matriculados" value={`${entrada.matriculados} est.`} />
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

      {/* Sección 2B — Distribución */}
      {s2b && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
            <Users size={17} className="text-[#002f5a]" />
            <h2 className="font-semibold text-sm text-gray-900">Sección 2 · Distribución por lugar de práctica</h2>
          </div>
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Sector público', value: s2b.publica },
              { label: 'Sector privado', value: s2b.privada },
              { label: 'ONG / social', value: s2b.ongSocial },
              { label: 'Vinculación laboral', value: s2b.vinculacionLaboral },
              { label: 'En casa', value: s2b.enCasa },
              { label: 'Otros municipios', value: s2b.otrosMunicipios },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-4 text-center">
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                <p className="text-[11px] text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección 3 — Progreso */}
      {s3 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
            <BookOpen size={17} className="text-[#002f5a]" />
            <h2 className="font-semibold text-sm text-gray-900">Sección 3 · Progreso de estudiantes</h2>
          </div>
          <div className="p-6 grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: 'Iniciaron', value: s3.iniciaron },
              { label: 'Finalizaron', value: s3.finalizaron },
              { label: 'Retirados', value: s3.retirados },
              { label: 'Pendientes', value: s3.pendientes },
              { label: 'No aprobaron', value: s3.noAprobaron },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-4 text-center">
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                <p className="text-[11px] text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección 4A — Actividades */}
      {s4a && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
            <CalendarCheck size={17} className="text-[#002f5a]" />
            <h2 className="font-semibold text-sm text-gray-900">Sección 4A · Actividades extracurriculares</h2>
          </div>
          <div className="p-6 flex flex-col gap-3">
            {[
              { key: 'salidasCampo', label: 'Salidas de campo', icon: Map, color: 'text-blue-500', data: s4a.salidasCampo },
              { key: 'eventosAcademicos', label: 'Eventos académicos', icon: CalendarCheck, color: 'text-emerald-500', data: s4a.eventosAcademicos },
              { key: 'clasesEspejo', label: 'Clases espejo', icon: Users, color: 'text-violet-500', data: s4a.clasesEspejo },
            ].map(({ key, label, icon: Icon, color, data }) => (
              <div key={key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Icon size={15} className={color} />
                  <span className="font-medium text-sm text-gray-900">{label}</span>
                  <span className={`ml-auto px-2 py-0.5 text-[11px] font-bold rounded-full ${
                    data.aplica ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {data.aplica ? 'Aplica' : 'No aplica'}
                  </span>
                </div>
                {data.aplica && data.descripcion && (
                  <p className="text-sm text-gray-500 mt-2 pl-6">{data.descripcion}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección 4B — Innovación */}
      {s4b && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
            <Lightbulb size={17} className="text-[#002f5a]" />
            <h2 className="font-semibold text-sm text-gray-900">Sección 4B · Estrategias e innovación</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            <ReadonlyField label="Estrategias didácticas" icon={Lightbulb} value={s4b.estrategias} iconColor="text-violet-500" />
            <ReadonlyField label="Publicaciones" icon={BookOpen} value={s4b.publicaciones} iconColor="text-violet-500" />
            <ReadonlyField label="Otras actividades" icon={ArrowUpRight} value={s4b.otras} iconColor="text-violet-500" />
          </div>
        </div>
      )}

      {/* Sección 5A — Logros */}
      {s5a && (
        <div className="bg-white border border-gray-200 border-l-4 border-l-blue-500 rounded-r-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 bg-blue-50/40 flex items-center gap-3">
            <Trophy size={17} className="text-blue-600" />
            <h2 className="font-semibold text-sm text-gray-900">Sección 5A · Logros y lecciones aprendidas</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <ReadonlyField label="Logros y avances" icon={Trophy} value={s5a.logros} iconColor="text-blue-500" />
            <ReadonlyField label="Lecciones aprendidas" icon={Lightbulb} value={s5a.lecciones} iconColor="text-blue-500" />
          </div>
        </div>
      )}

      {/* Sección 5B — Retos */}
      {s5b && (
        <div className="bg-white border border-gray-200 border-l-4 border-l-amber-500 rounded-r-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 bg-amber-50/40 flex items-center gap-3">
            <AlertTriangle size={17} className="text-amber-600" />
            <h2 className="font-semibold text-sm text-gray-900">Sección 5B · Retos y recomendaciones</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <ReadonlyField label="Limitaciones y retos" icon={AlertTriangle} value={s5b.limitaciones} iconColor="text-amber-500" />
            <ReadonlyField label="Perspectivas y recomendaciones" icon={ArrowUpRight} value={s5b.recomendaciones} iconColor="text-amber-500" />
          </div>
        </div>
      )}

      {/* Sección 6 — Evidencias */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
          <Link size={17} className="text-[#002f5a]" />
          <h2 className="font-semibold text-sm text-gray-900">Sección 6 · Enlace de evidencias</h2>
        </div>
        <div className="p-6">
          {entrada.enlaceEvidencias ? (
            <a
              href={entrada.enlaceEvidencias}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#002f5a] hover:underline text-sm break-all"
            >
              <ExternalLink size={14} />
              {entrada.enlaceEvidencias}
            </a>
          ) : (
            <p className="text-gray-400 italic text-sm">Sin enlace de evidencias</p>
          )}
        </div>
      </div>

      {/* Historial de auditoría */}
      {auditoria.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-sm text-gray-900">Historial de cambios</h2>
          </div>
          <div className="p-6">
            <ol className="relative border-l border-gray-200 ml-3 flex flex-col gap-6">
              {auditoria.map((item) => (
                <li key={item.id} className="ml-5">
                  <span className="absolute -left-2 w-4 h-4 bg-[#002f5a] rounded-full border-2 border-white" />
                  <p className="text-xs text-gray-400 mb-1">
                    {new Date(item.creadoEn).toLocaleDateString('es-CO', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                    {' · '}{item.adminNombre}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{item.estadoAnterior}</span>
                    {' → '}
                    <span className="font-medium">{item.estadoNuevo}</span>
                  </p>
                  {item.observacion && (
                    <p className="text-sm text-gray-500 mt-1 italic">"{item.observacion}"</p>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft size={16} />
          Volver
        </button>
        {esEnviado && (
          <button
            onClick={handleDescargar}
            disabled={descargando}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#002f5a] rounded-lg hover:bg-[#003d73] transition-colors disabled:opacity-50"
          >
            <Download size={15} />
            {descargando ? 'Descargando...' : 'Descargar informe (.docx)'}
          </button>
        )}
      </div>

    </div>
  )
}
