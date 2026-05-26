import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Download, FileText, RefreshCw } from 'lucide-react'
import { getProgramas, getProgramaEntradas, descargarEntrada, descargarConsolidado } from '../../api/admin'
import { AdminBadge } from '../../components/ui/AdminBadge'
import { ModalCambiarEstado } from '../../components/ui/ModalCambiarEstado'
import { ModalDevolverEntrada } from '../../components/ui/ModalDevolverEntrada'
import type { ProgramaResumen, ProgramaEntradas, EntradaResumen, EstadoEntrada } from '../../types/admin'

const estadoEntradaConfig: Record<EstadoEntrada, { label: string; className: string }> = {
  SinIniciar: { label: 'Sin iniciar', className: 'bg-gray-100 text-gray-500' },
  Borrador: { label: 'Borrador', className: 'bg-amber-50 text-amber-700' },
  Enviado: { label: 'Enviado', className: 'bg-green-50 text-green-700' },
  Devuelto: { label: 'Devuelto', className: 'bg-red-50 text-red-700' },
}

function EntradaBadge({ estado }: { estado: EstadoEntrada }) {
  const cfg = estadoEntradaConfig[estado] ?? { label: estado, className: 'bg-gray-100 text-gray-500' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}

export default function VistaPrograma() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [programa, setPrograma] = useState<ProgramaResumen | null>(null)
  const [detalle, setDetalle] = useState<ProgramaEntradas | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [entradaADevolver, setEntradaADevolver] = useState<EntradaResumen | null>(null)
  const [descargando, setDescargando] = useState<string | null>(null)
  const [descargandoConsolidado, setDescargandoConsolidado] = useState(false)

  const cargarDatos = async () => {
    if (!id) return
    setLoading(true)
    try {
      const [programas, detalleData] = await Promise.all([
        getProgramas(),
        getProgramaEntradas(id),
      ])
      const prog = programas.find((p) => p.programaId === id) ?? null
      setPrograma(prog)
      setDetalle(detalleData)
    } catch {
      // keep null state
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargarDatos() }, [id])

  const handleDescargarEntrada = async (entradaId: string, docente: string, practica: string) => {
    setDescargando(entradaId)
    try {
      const blob = await descargarEntrada(entradaId)
      const url = window.URL.createObjectURL(new Blob([blob as BlobPart]))
      const a = document.createElement('a')
      a.href = url
      a.download = `informe_${docente.replace(/ /g, '_')}_${practica.replace(/ /g, '_')}.docx`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      alert('Error al descargar el informe.')
    } finally {
      setDescargando(null)
    }
  }

  const handleDescargarConsolidado = async () => {
    if (!id || !programa) return
    setDescargandoConsolidado(true)
    try {
      const blob = await descargarConsolidado(id)
      const url = window.URL.createObjectURL(new Blob([blob as BlobPart]))
      const a = document.createElement('a')
      a.href = url
      a.download = `consolidado_${programa.nombre.replace(/ /g, '_')}_${programa.semestre}.docx`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      alert('Error al descargar el consolidado.')
    } finally {
      setDescargandoConsolidado(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Cargando...</p>
      </div>
    )
  }

  if (!programa || !detalle) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Programa no encontrado.</p>
      </div>
    )
  }

  const enviadas = detalle.entradas.filter((e) => e.estado === 'Enviado').length
  const total = detalle.entradas.length
  const pct = total > 0 ? Math.round((enviadas / total) * 100) : 0
  const consolidadoHabilitado = enviadas > 0

  return (
    <div className="pb-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft size={16} />
          Panel de Administración
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-700 font-medium truncate max-w-[300px]">{programa.nombre}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{programa.nombre}</h1>
          <p className="text-gray-400 text-sm mt-1">{programa.codigo} · Semestre {programa.semestre}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <AdminBadge estado={programa.estado} />
          <button
            onClick={() => setModalAbierto(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#002f5a] rounded-lg hover:bg-[#003d73] transition-colors"
          >
            <RefreshCw size={14} />
            Cambiar estado
          </button>
        </div>
      </div>

      {/* Stats card */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Entradas totales</p>
          <p className="text-3xl font-bold text-gray-900">{total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Enviadas</p>
          <p className="text-3xl font-bold text-gray-900">{enviadas}</p>
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-green-500' : pct > 0 ? 'bg-amber-400' : 'bg-gray-200'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{pct}% de avance</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Fecha entrega</p>
          <p className="text-base font-semibold text-gray-900">
            {programa.fechaEntrega
              ? new Date(programa.fechaEntrega).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
              : '—'}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Entradas del programa</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Docente</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Práctica</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Grupo</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Matriculados</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Enviado</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Acción</th>
              </tr>
            </thead>
            <tbody>
              {detalle.entradas.map((e, i) => (
                <tr
                  key={e.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${i % 2 === 1 ? 'bg-gray-50/30' : ''}`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{e.docente}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-[180px]">
                    <span title={e.practica}>{e.practica}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{e.numeroGrupo}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{e.matriculados}</td>
                  <td className="px-6 py-4">
                    <EntradaBadge estado={e.estado} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {e.enviadoEn
                      ? new Date(e.enviadoEn).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
                      : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {e.estado === 'Enviado' && (
                        <button
                          onClick={() => handleDescargarEntrada(e.id, e.docente, e.practica)}
                          disabled={descargando === e.id}
                          title="Descargar informe"
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#002f5a] bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                        >
                          {descargando === e.id
                            ? <span className="w-3 h-3 border-2 border-[#002f5a]/30 border-t-[#002f5a] rounded-full animate-spin" />
                            : <Download size={12} />}
                          .docx
                        </button>
                      )}
                      {e.estado === 'Enviado' && (
                        <button
                          onClick={() => setEntradaADevolver(e)}
                          className="text-xs px-2 py-1 rounded border border-danger text-danger hover:bg-danger-bg transition-colors"
                          title="Devolver esta entrada al docente"
                        >
                          Devolver
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {detalle.entradas.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-400 text-sm">
                    No hay entradas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fixed footer */}
      <div className="fixed bottom-0 left-[224px] right-0 bg-white border-t border-gray-200 px-8 py-4 flex items-center justify-between z-40">
        <p className="text-sm text-gray-500">
          {enviadas > 0
            ? `Consolidado disponible con ${enviadas} de ${total} entradas enviadas.`
            : 'No hay entradas enviadas aún.'}
        </p>
        <button
          onClick={handleDescargarConsolidado}
          disabled={!consolidadoHabilitado || descargandoConsolidado}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#002f5a] rounded-lg hover:bg-[#003d73] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {descargandoConsolidado
            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <FileText size={15} />}
          Descargar consolidado .docx
        </button>
      </div>

      {/* Modal cambiar estado informe */}
      {modalAbierto && (
        <ModalCambiarEstado
          informeId={programa.informeId}
          nombrePrograma={programa.nombre}
          onClose={() => setModalAbierto(false)}
          onExito={() => {
            setModalAbierto(false)
            cargarDatos()
          }}
        />
      )}

      {/* Modal devolver entrada individual */}
      {entradaADevolver && (
        <ModalDevolverEntrada
          entradaId={entradaADevolver.id}
          docenteNombre={entradaADevolver.docente}
          practica={entradaADevolver.practica}
          numeroGrupo={entradaADevolver.numeroGrupo}
          onClose={() => setEntradaADevolver(null)}
          onExito={() => {
            setEntradaADevolver(null)
            cargarDatos()
          }}
        />
      )}
    </div>
  )
}
