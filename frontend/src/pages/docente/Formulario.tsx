import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FormularioLayout } from '../../components/layout/FormularioLayout'
import { useEntrada } from '../../hooks/useEntrada'
import { useGrupos } from '../../hooks/useGrupos'

const SECCIONES = [
  { id: 1, nombre: 'Modalidades' },
  { id: 2, nombre: 'Situación' },
  { id: 3, nombre: 'Actividades' },
  { id: 4, nombre: 'Resultados' },
  { id: 5, nombre: 'Observaciones' },
  { id: 6, nombre: 'Anexos' },
]

export default function Formulario() {
  const { entradaId } = useParams<{ entradaId: string }>()

  const [seccionActiva, setSeccionActiva] = useState(1)
  const [seccionesCompletadas, setSeccionesCompletadas] = useState<Set<number>>(new Set())

  const { entrada, loading, error } = useEntrada(entradaId ?? '')
  const { grupos } = useGrupos()

  useEffect(() => {
    setSeccionActiva(1)
    setSeccionesCompletadas(new Set())
  }, [entradaId])

  const gruposParaSidebar = grupos
    .filter((g): g is typeof g & { entradaId: string } => g.entradaId !== null)
    .map((g) => ({
      entradaId: g.entradaId,
      practica: g.practica,
      numeroGrupo: g.numeroGrupo,
      estado: g.estado,
    }))

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-on-surface-variant">Cargando entrada...</p>
    </div>
  )

  if (error || !entrada) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-error">Error al cargar. Intenta de nuevo.</p>
    </div>
  )

  return (
    <FormularioLayout
      secciones={SECCIONES}
      seccionActiva={seccionActiva}
      seccionesCompletadas={seccionesCompletadas}
      grupos={gruposParaSidebar}
      entradaIdActiva={entradaId ?? ''}
      onCambiarSeccion={setSeccionActiva}
    >
      {/* Las secciones se agregarán en prompts 1-6 */}
      <div className="p-8">
        <p className="text-on-surface-variant">
          Sección {seccionActiva} — en construcción
        </p>
      </div>
    </FormularioLayout>
  )
}
