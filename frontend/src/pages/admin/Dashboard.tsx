import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, FileText, Users, Send, CheckCircle, Clock } from 'lucide-react'
import { getProgramas, descargarConsolidado } from '../../api/admin'
import { AdminBadge } from '../../components/ui/AdminBadge'
import type { ProgramaResumen } from '../../types/admin'

function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  iconColor,
  progress,
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ElementType
  iconColor: string
  progress?: number
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColor}`}>
          <Icon size={15} />
        </div>
      </div>
      <div>
        <p className="text-4xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-sm text-gray-400 mt-0.5">{sub}</p>}
      </div>
      {progress !== undefined && (
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#002f5a] rounded-full transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [programas, setProgramas] = useState<ProgramaResumen[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProgramas()
      .then((data) => setProgramas(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const totalEntradas = programas.reduce((a, p) => a + p.totalEntradas, 0)
  const totalEnviadas = programas.reduce((a, p) => a + p.enviadas, 0)
  const envioPct = totalEntradas > 0 ? Math.round((totalEnviadas / totalEntradas) * 100) : 0

  const informesCompletos = programas.filter((p) =>
    ['ListoParaRevision', 'EnRevision', 'Aprobado'].includes(p.estado)
  ).length
  const informesPendientes = programas.filter((p) =>
    ['EnProgreso', 'Devuelto'].includes(p.estado)
  ).length

  const handleDescargar = async (programaId: string, nombre: string) => {
    try {
      const blob = await descargarConsolidado(programaId)
      const url = window.URL.createObjectURL(new Blob([blob as BlobPart]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `consolidado_${nombre.replace(/ /g, '_')}_2026-I.docx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      alert('Error al descargar el consolidado.')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-400">Cargando...</p>
    </div>
  )

  return (
    <div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-500 text-sm mt-1">
          Semestre 2026-I · Facultad de Ciencias de la Educación
        </p>
      </div>

      {/* 4 cards de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Docentes activos"
          value={87}
          sub="asignados al semestre"
          icon={Users}
          iconColor="bg-blue-50 text-blue-600"
        />
        <MetricCard
          label="Entradas enviadas"
          value={`${totalEnviadas} / ${totalEntradas}`}
          sub={`${envioPct}% de avance`}
          icon={Send}
          iconColor="bg-orange-50 text-orange-500"
          progress={envioPct}
        />
        <MetricCard
          label="Informes completos"
          value={informesCompletos}
          sub="listos para revisión"
          icon={CheckCircle}
          iconColor="bg-green-50 text-green-600"
        />
        <MetricCard
          label="Informes pendientes"
          value={informesPendientes}
          sub="requieren atención"
          icon={Clock}
          iconColor="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Tabla Estado por programa */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Estado por programa</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Programa</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Docentes</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Enviadas</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Progreso</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Acción</th>
              </tr>
            </thead>
            <tbody>
              {programas.map((p, i) => {
                const pct = p.totalEntradas > 0
                  ? Math.round((p.enviadas / p.totalEntradas) * 100)
                  : 0
                const listo = p.enviadas > 0
                return (
                  <tr
                    key={p.programaId}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${i % 2 === 1 ? 'bg-gray-50/30' : ''}`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-[240px]">
                      <span title={p.nombre}>{p.nombre}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{p.totalEntradas}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{p.enviadas}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-[80px]">
                          <div
                            className={`h-full rounded-full transition-all ${
                              pct === 100
                                ? 'bg-green-500'
                                : pct > 0
                                  ? 'bg-amber-400'
                                  : 'bg-gray-200'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-9 text-right">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <AdminBadge estado={p.estado} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/programas/${p.programaId}`)}
                          title="Ver detalle"
                          className="p-1.5 text-gray-400 hover:text-[#002f5a] hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        {listo && (
                          <button
                            onClick={() => handleDescargar(p.programaId, p.nombre)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <FileText size={13} />
                            Consolidado .docx
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {programas.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">
                    No hay programas registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
