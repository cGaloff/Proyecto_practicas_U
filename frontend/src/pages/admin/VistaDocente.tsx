import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Mail, Eye } from 'lucide-react'
import { getDocenteEntradas } from '../../api/admin'
import { Badge } from '../../components/ui/Badge'
import type { DocenteConEntradas } from '../../types/admin'

export default function VistaDocente() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [docente, setDocente] = useState<DocenteConEntradas | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    getDocenteEntradas(id)
      .then((data) => setDocente(data))
      .catch(() => setError('No se pudo cargar el docente.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Cargando...</p>
      </div>
    )
  }

  if (error || !docente) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error ?? 'Docente no encontrado.'}</p>
      </div>
    )
  }

  const totalGrupos = docente.grupos.length
  const enviados = docente.grupos.filter((g) => g.estado === 'Enviado').length
  const pendientes = docente.grupos.filter((g) => g.estado !== 'Enviado').length

  const iniciales = docente.nombre
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <button
          onClick={() => navigate('/admin')}
          className="hover:text-[#002f5a] transition-colors"
        >
          Panel admin
        </button>
        <ChevronLeft size={14} className="rotate-180" />
        <button
          onClick={() => navigate('/admin/docentes')}
          className="hover:text-[#002f5a] transition-colors"
        >
          Por docente
        </button>
        <ChevronLeft size={14} className="rotate-180" />
        <span className="font-semibold text-gray-700">{docente.nombre.toUpperCase()}</span>
      </div>

      {/* Card del docente */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-6">

          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-[#002f5a] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xl font-bold">{iniciales}</span>
          </div>

          {/* Nombre y correo */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 uppercase truncate">
              {docente.nombre}
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <Mail size={14} className="text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-500">{docente.correo}</span>
            </div>
            {docente.programa && (
              <p className="text-xs text-gray-400 mt-1">{docente.programa}</p>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-3 flex-shrink-0">
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-center min-w-[100px]">
              <p className="text-2xl font-bold text-gray-900">{totalGrupos}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                Grupos asignados
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 text-center min-w-[100px]">
              <p className="text-2xl font-bold text-green-700">{enviados}</p>
              <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mt-1">
                Enviados
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-center min-w-[100px]">
              <p className="text-2xl font-bold text-gray-400">{pendientes}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                Pendientes
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Tabla de entradas */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Entradas del docente</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Práctica</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Grupo</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Est.</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Enviado</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Ver</th>
              </tr>
            </thead>
            <tbody>
              {docente.grupos.map((g, i) => (
                <tr
                  key={g.entradaId ?? `grupo-${i}`}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${i % 2 === 1 ? 'bg-gray-50/30' : ''}`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-[200px]">
                    <span title={g.practica}>{g.practica}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Grupo {g.numeroGrupo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {g.matriculados}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {g.enviadoEn
                      ? new Date(g.enviadoEn).toLocaleDateString('es-CO', {
                          day: 'numeric',
                          month: 'short',
                        })
                      : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <Badge estado={g.estado} />
                  </td>
                  <td className="px-6 py-4">
                    {g.entradaId && (
                      <button
                        onClick={() => navigate(`/admin/entradas/${g.entradaId}`)}
                        title="Ver entrada"
                        className="p-1.5 text-gray-400 hover:text-[#002f5a] hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {docente.grupos.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">
                    No hay entradas registradas para este docente.
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
