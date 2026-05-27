import { useNavigate } from 'react-router-dom'
import { Users, CheckCircle, TrendingUp, FileText, Download } from 'lucide-react'
import { useGrupos } from '../../hooks/useGrupos'
import { Badge } from '../../components/ui/Badge'
import { descargarEntrada } from '../../api/docente'
import type { GrupoConEntradaDto, EstadoEntrada } from '../../types/docente'

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  progress,
}: {
  icon: React.ElementType
  label: string
  value: number | string
  sub?: string
  progress?: number
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-body-sm text-on-surface-variant font-medium">{label}</p>
        <div className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center">
          <Icon size={16} />
        </div>
      </div>
      <div>
        <p className="text-4xl font-bold text-on-surface">{value}</p>
        {sub && <p className="text-body-sm text-on-surface-variant mt-0.5">{sub}</p>}
      </div>
      {progress !== undefined && (
        <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  )
}

function estadoOrder(e: EstadoEntrada): number {
  return { Devuelto: 0, SinIniciar: 1, Borrador: 2, Enviado: 3 }[e]
}

export function Dashboard() {
  const { grupos, loading, error } = useGrupos()
  const navigate = useNavigate()

  const totalMatriculados = grupos.reduce((s, g) => s + g.matriculados, 0)
  const enviados = grupos.filter((g) => g.estado === 'Enviado').length
  const completoPct = grupos.length ? Math.round((enviados / grupos.length) * 100) : 0

  const sorted = [...grupos].sort((a, b) => estadoOrder(a.estado) - estadoOrder(b.estado))

  const handleAccion = (g: GrupoConEntradaDto) => {
    if (!g.entradaId) return
    if (g.estado === 'Enviado') {
      navigate(`/docente/entradas/${g.entradaId}/ver`)
    } else {
      navigate(`/docente/entradas/${g.entradaId}`)
    }
  }

  const handleDescargar = async (g: GrupoConEntradaDto) => {
    if (!g.entradaId) return
    const res = await descargarEntrada(g.entradaId)
    const url = window.URL.createObjectURL(new Blob([res.data as BlobPart]))
    const a = document.createElement('a')
    a.href = url
    a.download = `informe-${g.practica}-grupo${g.numeroGrupo}.pdf`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const accionLabel = (g: GrupoConEntradaDto) => {
    if (g.estado === 'Enviado') return 'Ver →'
    if (g.estado === 'Borrador') return 'Continuar →'
    if (g.estado === 'Devuelto') return 'Corregir →'
    return 'Iniciar →'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-on-surface-variant">Cargando grupos…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-error">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-headline-lg text-on-surface">Mis grupos</h2>
        <p className="text-body-sm text-on-surface-variant mt-1">Resumen de entradas de práctica del semestre actual</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={Users} label="Total grupos" value={grupos.length} sub="asignados este semestre" />
        <MetricCard icon={FileText} label="Matriculados" value={totalMatriculados} sub="estudiantes en total" />
        <MetricCard
          icon={CheckCircle}
          label="Enviadas"
          value={enviados}
          sub={`de ${grupos.length} entradas`}
          progress={completoPct}
        />
        <MetricCard
          icon={TrendingUp}
          label="Completitud"
          value={`${completoPct}%`}
          sub="entradas enviadas"
          progress={completoPct}
        />
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
        <div className="bg-surface-container/50 border-b border-outline-variant/30 px-6 py-4">
          <h3 className="text-body-md font-semibold text-on-surface">Detalle por grupo</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/30">
                <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant uppercase">Práctica</th>
                <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant uppercase">Programa</th>
                <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant uppercase">Grupo</th>
                <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant uppercase">Matriculados</th>
                <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant uppercase">Actualizado</th>
                <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant uppercase">Acción</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((g, i) => (
                <tr key={g.entradaId ?? `${g.practica}-${g.numeroGrupo}`} className={i % 2 === 0 ? '' : 'bg-surface-container/20'}>
                  <td className="px-6 py-4 text-body-sm text-on-surface font-medium">{g.practica}</td>
                  <td className="px-6 py-4 text-body-sm text-on-surface-variant">{g.programa || '—'}</td>
                  <td className="px-6 py-4 text-body-sm text-on-surface-variant">Grupo {g.numeroGrupo}</td>
                  <td className="px-6 py-4 text-body-sm text-on-surface-variant">{g.matriculados}</td>
                  <td className="px-6 py-4">
                    <Badge estado={g.estado} />
                  </td>
                  <td className="px-6 py-4 text-body-sm text-on-surface-variant">
                    {g.guardadoEn
                      ? new Date(g.guardadoEn).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
                      : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAccion(g)}
                        disabled={!g.entradaId}
                        className={`px-3 py-1.5 text-label-caps font-semibold rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed ${
                          g.estado === 'Enviado'
                            ? 'border border-outline-variant text-on-surface-variant hover:bg-surface-container'
                            : 'bg-primary text-on-primary hover:bg-primary-container'
                        }`}
                      >
                        {accionLabel(g)}
                      </button>
                      {g.estado === 'Enviado' && (
                        <button
                          onClick={() => handleDescargar(g)}
                          title="Descargar .pdf"
                          className="flex items-center gap-1 px-3 py-1.5 text-label-caps font-semibold rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container transition"
                        >
                          <Download size={13} />
                          .pdf
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {grupos.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-on-surface-variant text-body-sm">
                    No tienes grupos asignados este semestre.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {grupos.some((g) => g.observacionAdmin) && (
        <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/30">
          <h3 className="text-body-md font-semibold text-on-surface mb-3">Observaciones del coordinador</h3>
          <div className="flex flex-col gap-3">
            {grupos
              .filter((g) => g.observacionAdmin)
              .map((g) => (
                <div key={g.entradaId} className="flex flex-col gap-0.5">
                  <p className="text-label-caps text-on-surface-variant uppercase">
                    {g.practica} — Grupo {g.numeroGrupo}
                  </p>
                  <p className="text-body-sm text-on-surface">{g.observacionAdmin}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
