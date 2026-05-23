import { Navbar } from './Navbar'
import { FormularioSidebar } from './FormularioSidebar'

interface Props {
  secciones: Array<{ id: number; nombre: string }>
  seccionActiva: number
  seccionesCompletadas: Set<number>
  grupos: Array<{ entradaId: string; practica: string; numeroGrupo: number; estado: string }>
  entradaIdActiva: string
  onCambiarSeccion: (seccion: number) => void
  children: React.ReactNode
}

export function FormularioLayout({
  secciones,
  seccionActiva,
  seccionesCompletadas,
  grupos,
  entradaIdActiva,
  onCambiarSeccion,
  children,
}: Props) {
  return (
    <div className="min-h-screen flex flex-col">

      {/* NAVBAR — IDÉNTICO AL DASHBOARD, NO MODIFICAR */}
      <Navbar />

      <div className="flex flex-1" style={{ paddingTop: '56px' }}>

        {/* SIDEBAR CONTEXTUAL DEL FORMULARIO */}
        <FormularioSidebar
          secciones={secciones}
          seccionActiva={seccionActiva}
          seccionesCompletadas={seccionesCompletadas}
          grupos={grupos}
          entradaIdActiva={entradaIdActiva}
          onCambiarSeccion={onCambiarSeccion}
        />

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 overflow-auto" style={{ marginLeft: '224px' }}>
          {children}
        </main>

      </div>
    </div>
  )
}
