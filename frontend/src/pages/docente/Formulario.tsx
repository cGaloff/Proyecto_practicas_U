import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FormularioLayout } from '../../components/layout/FormularioLayout'
import { Seccion1Modalidades } from '../../components/forms/Seccion1Modalidades'
import { Seccion2Situacion } from '../../components/forms/Seccion2Situacion'
import { Seccion3Actividades } from '../../components/forms/Seccion3Actividades'
import { useEntrada } from '../../hooks/useEntrada'
import { useGrupos } from '../../hooks/useGrupos'
import { useAuthStore } from '../../store/authStore'
import type { GuardarBorradorRequest } from '../../types/docente'

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
  const user = useAuthStore((s) => s.user)

  const [seccionActiva, setSeccionActiva] = useState(1)
  const [seccionesCompletadas, setSeccionesCompletadas] = useState<Set<number>>(new Set())

  const { entrada, loading, error, guardando, guardadoEn, guardar, guardarConDebounce } =
    useEntrada(entradaId ?? '')
  const { grupos } = useGrupos()

  useEffect(() => {
    setSeccionActiva(1)
    setSeccionesCompletadas(new Set())
  }, [entradaId])

  const irASiguiente = async (data: GuardarBorradorRequest) => {
    await guardar(data)
    setSeccionesCompletadas((prev) => new Set([...prev, seccionActiva]))
    setSeccionActiva((s) => s + 1)
  }

  const irAAnterior = () => {
    setSeccionActiva((s) => s - 1)
  }

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

  const entradaConDatos = {
    ...entrada,
    docenteNombre: entrada.docenteNombre ?? user?.nombreCompleto ?? '',
  }

  return (
    <FormularioLayout
      secciones={SECCIONES}
      seccionActiva={seccionActiva}
      seccionesCompletadas={seccionesCompletadas}
      grupos={gruposParaSidebar}
      entradaIdActiva={entradaId ?? ''}
      onCambiarSeccion={setSeccionActiva}
    >
      {seccionActiva === 1 && (
        <Seccion1Modalidades
          entrada={entradaConDatos}
          guardando={guardando}
          guardadoEn={guardadoEn}
          onGuardar={guardarConDebounce}
          onSiguiente={irASiguiente}
        />
      )}

      {seccionActiva === 2 && (
        <Seccion2Situacion
          entrada={entradaConDatos}
          guardando={guardando}
          guardadoEn={guardadoEn}
          onGuardar={guardarConDebounce}
          onSiguiente={irASiguiente}
          onAnterior={irAAnterior}
        />
      )}

      {seccionActiva === 3 && (
        <Seccion3Actividades
          entrada={entradaConDatos}
          guardando={guardando}
          guardadoEn={guardadoEn}
          onGuardar={guardarConDebounce}
          onSiguiente={irASiguiente}
          onAnterior={irAAnterior}
        />
      )}

      {seccionActiva > 3 && (
        <div className="p-8 text-on-surface-variant">
          Sección {seccionActiva} — en construcción
        </div>
      )}
    </FormularioLayout>
  )
}
