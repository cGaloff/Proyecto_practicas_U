import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FormularioLayout } from '../../components/layout/FormularioLayout'
import { Seccion1Modalidades } from '../../components/forms/Seccion1Modalidades'
import { Seccion2Situacion } from '../../components/forms/Seccion2Situacion'
import { Seccion3Actividades } from '../../components/forms/Seccion3Actividades'
import { Seccion4Resultados } from '../../components/forms/Seccion4Resultados'
import { Seccion5Observaciones } from '../../components/forms/Seccion5Observaciones'
import { Seccion6Anexos } from '../../components/forms/Seccion6Anexos'
import { BannerDevuelto } from '../../components/ui/BannerDevuelto'
import { ModalEnvioExitoso } from '../../components/ui/ModalEnvioExitoso'
import { useEntrada } from '../../hooks/useEntrada'
import { enviarEntrada, getGrupos } from '../../api/docente'
import { useGrupos } from '../../hooks/useGrupos'
import { useAuthStore } from '../../store/authStore'
import type { GuardarBorradorRequest, GrupoConEntradaDto } from '../../types/docente'

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
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const [seccionActiva, setSeccionActiva] = useState(1)
  const [seccionesCompletadas, setSeccionesCompletadas] = useState<Set<number>>(new Set())
  const [mostrarModalExito, setMostrarModalExito] = useState(false)
  const [gruposRestantes, setGruposRestantes] = useState<GrupoConEntradaDto[]>([])

  const { entrada, loading, error, guardando, guardadoEn, guardar, guardarConDebounce } =
    useEntrada(entradaId ?? '')
  const { grupos } = useGrupos()

  useEffect(() => {
    setSeccionActiva(1)
    setSeccionesCompletadas(new Set())
  }, [entradaId])

  useEffect(() => {
    if (entrada?.estado === 'Enviado') {
      navigate(`/docente/entradas/${entrada.id}/ver`, { replace: true })
    }
  }, [entrada, navigate])

  const irASiguiente = async (data: GuardarBorradorRequest) => {
    await guardar(data)
    setSeccionesCompletadas((prev) => new Set([...prev, seccionActiva]))
    setSeccionActiva((s) => s + 1)
  }

  const irAAnterior = () => {
    setSeccionActiva((s) => s - 1)
  }

  const handleEnviar = async () => {
    try {
      await enviarEntrada(entradaId ?? '')

      const gruposActualizados = await getGrupos()
      const pendientes = gruposActualizados.data.filter(
        (g) => g.estado !== 'Enviado' && g.entradaId !== null
      )

      if (pendientes.length > 0) {
        setGruposRestantes(pendientes)
        setMostrarModalExito(true)
      } else {
        navigate('/docente')
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { mensaje?: string } } })?.response?.data?.mensaje
      alert(msg ?? 'Error al enviar.')
    }
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

  const esReenvio = entrada.estado === 'Devuelto'

  return (
    <>
    <FormularioLayout
      secciones={SECCIONES}
      seccionActiva={seccionActiva}
      seccionesCompletadas={seccionesCompletadas}
      grupos={gruposParaSidebar}
      entradaIdActiva={entradaId ?? ''}
      onCambiarSeccion={setSeccionActiva}
      estadoEntrada={entrada.estado}
    >
      <>
        {esReenvio && entrada.observacionAdmin && (
          <div className="px-8 pt-6 max-w-5xl mx-auto">
            <BannerDevuelto
              observacion={entrada.observacionAdmin}
              devueltoPor="adminpracticas@unimagdalena.edu.co"
              devueltoEn={entrada.guardadoEn}
            />
          </div>
        )}

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

        {seccionActiva === 4 && (
          <Seccion4Resultados
            entrada={entradaConDatos}
            guardando={guardando}
            guardadoEn={guardadoEn}
            onGuardar={guardarConDebounce}
            onSiguiente={irASiguiente}
            onAnterior={irAAnterior}
          />
        )}

        {seccionActiva === 5 && (
          <Seccion5Observaciones
            entrada={entradaConDatos}
            guardando={guardando}
            guardadoEn={guardadoEn}
            onGuardar={guardarConDebounce}
            onSiguiente={irASiguiente}
            onAnterior={irAAnterior}
          />
        )}

        {seccionActiva === 6 && (
          <Seccion6Anexos
            entrada={entradaConDatos}
            guardando={guardando}
            guardadoEn={guardadoEn}
            onGuardar={guardarConDebounce}
            onAnterior={irAAnterior}
            onEnviar={handleEnviar}
            esReenvio={esReenvio}
          />
        )}
      </>
    </FormularioLayout>

    {mostrarModalExito && entrada && (
      <ModalEnvioExitoso
        grupoEnviado={{
          practica: entrada.practica,
          numeroGrupo: entrada.numeroGrupo,
        }}
        gruposRestantes={gruposRestantes}
        onIrSiguiente={(id) => {
          setMostrarModalExito(false)
          navigate(`/docente/entradas/${id}`)
        }}
        onIrDashboard={() => navigate('/docente')}
      />
    )}
    </>
  )
}
