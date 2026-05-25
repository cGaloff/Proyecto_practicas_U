import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Eye } from 'lucide-react'
import { getDocentes } from '../../api/admin'
import type { DocenteConEntradas } from '../../types/admin'

export default function ListaDocentes() {
  const navigate = useNavigate()
  const [docentes, setDocentes] = useState<DocenteConEntradas[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDocentes()
      .then((data) => setDocentes(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtrados = docentes.filter(
    (d) =>
      d.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      d.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
      d.programa.toLowerCase().includes(busqueda.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Cargando docentes...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Por docente</h1>
          <p className="text-gray-500 text-sm mt-1">
            {docentes.length} docentes registrados · Semestre 2026-I
          </p>
        </div>

        {/* Buscador */}
        <div className="relative flex-shrink-0">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Buscar docente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#002f5a]/20 focus:border-[#002f5a] transition-colors w-60"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Docente</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Programa</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Grupos</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Enviados</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Ver</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((d, i) => {
                const total = d.grupos?.length ?? 0
                const enviados = d.grupos?.filter((g) => g.estado === 'Enviado').length ?? 0
                return (
                  <tr
                    key={d.docenteId}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${i % 2 === 1 ? 'bg-gray-50/30' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{d.nombre}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{d.correo}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px]">
                      <span title={d.programa}>{d.programa}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{total}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {enviados}/{total}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/admin/docentes/${d.docenteId}`)}
                        title="Ver docente"
                        className="p-1.5 text-gray-400 hover:text-[#002f5a] hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400 text-sm">
                    {busqueda ? 'No se encontraron docentes.' : 'No hay docentes registrados.'}
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
