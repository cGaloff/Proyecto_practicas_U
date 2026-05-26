import { useState } from 'react'
import { Map, CalendarCheck, Users, ArrowLeft, ArrowRight } from 'lucide-react'
import { SeccionHeader } from './SeccionHeader'
import { AutosaveIndicator } from '../ui/AutosaveIndicator'
import type {
  EntradaDetalleDto,
  GuardarBorradorRequest,
  ActividadItem,
} from '../../types/docente'

interface Props {
  entrada: EntradaDetalleDto
  guardando: boolean
  guardadoEn: Date | null
  onGuardar: (data: GuardarBorradorRequest) => void
  onSiguiente: (data: GuardarBorradorRequest) => void
  onAnterior: () => void
}

type ActividadKey = 'salidasCampo' | 'eventosAcademicos' | 'clasesEspejo'

interface ActividadConfig {
  key: ActividadKey
  titulo: string
  subtitulo: string
  Icon: typeof Map
  iconBg: string
  iconColor: string
}

const ACTIVIDADES: ActividadConfig[] = [
  {
    key: 'salidasCampo',
    titulo: 'Salidas de campo',
    subtitulo: 'Visitas a instituciones u otros contextos',
    Icon: Map,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    key: 'eventosAcademicos',
    titulo: 'Participación en eventos académicos',
    subtitulo: 'Congresos, simposios, semanas de la educación',
    Icon: CalendarCheck,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    key: 'clasesEspejo',
    titulo: 'Clases espejo / intercambio',
    subtitulo: 'Articulación con otras universidades o entidades',
    Icon: Users,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
]

const DEFAULT_ITEM: ActividadItem = { aplica: false, descripcion: '' }

export function Seccion3Actividades({
  entrada, guardando, guardadoEn, onGuardar, onSiguiente, onAnterior,
}: Props) {
  const [valores, setValores] = useState<Record<ActividadKey, ActividadItem>>({
    salidasCampo:      entrada.seccion4A?.salidasCampo      ?? { ...DEFAULT_ITEM },
    eventosAcademicos: entrada.seccion4A?.eventosAcademicos ?? { ...DEFAULT_ITEM },
    clasesEspejo:      entrada.seccion4A?.clasesEspejo      ?? { ...DEFAULT_ITEM },
  })

  const handleToggle = (key: ActividadKey) => {
    const actual = valores[key]
    const nuevos = {
      ...valores,
      [key]: {
        aplica: !actual.aplica,
        descripcion: actual.aplica ? '' : actual.descripcion,
      },
    }
    setValores(nuevos)
    onGuardar({ seccion4A: nuevos })
  }

  const handleDescripcion = (key: ActividadKey, texto: string) => {
    const nuevos = {
      ...valores,
      [key]: { ...valores[key], descripcion: texto },
    }
    setValores(nuevos)
    onGuardar({ seccion4A: nuevos })
  }

  const handleSiguiente = () => {
    onSiguiente({ seccion4A: valores })
  }

  return (
    <div className="py-8 px-8 max-w-5xl mx-auto">

      <SeccionHeader
        practica={entrada.practica}
        numeroGrupo={entrada.numeroGrupo}
        matriculados={entrada.matriculados}
        docenteNombre={entrada.docenteNombre ?? ''}
        programa={entrada.programa ?? ''}
        paso={3}
        totalPasos={6}
        labelPaso="PROYECCIÓN INSTITUCIONAL"
        tituloSeccion="Actividades de proyección, articulación y divulgación"
      />

      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">

        {/* Card header */}
        <div className="px-8 py-8 border-b border-outline-variant bg-surface-container-lowest">
          <p className="text-body-md text-on-surface-variant">
            Indica si aplica y describe brevemente cada actividad (máx. 300 caracteres).
          </p>
        </div>

        {/* Card body */}
        <div className="p-8">
          <div className="flex flex-col gap-4">
            {ACTIVIDADES.map(({ key, titulo, subtitulo, Icon, iconBg, iconColor }) => {
              const item = valores[key]
              return (
                <div
                  key={key}
                  className="border border-outline-variant rounded-xl p-5 bg-white transition-shadow hover:shadow-sm"
                >
                  {/* Fila principal */}
                  <div className="flex items-center gap-4">

                    {/* Ícono cuadrado */}
                    <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={20} className={iconColor} />
                    </div>

                    {/* Título y subtítulo */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-body-md text-on-surface">
                        {titulo}
                      </p>
                      <p className="text-body-sm text-on-surface-variant mt-0.5">
                        {subtitulo}
                      </p>
                    </div>

                    {/* Toggle SÍ / NO */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${
                        item.aplica ? 'text-primary-container' : 'text-outline'
                      }`}>
                        {item.aplica ? 'SÍ' : 'NO'}
                      </span>
                      <button
                        onClick={() => handleToggle(key)}
                        role="switch"
                        aria-checked={item.aplica}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container ${
                          item.aplica
                            ? 'bg-primary-container'
                            : 'bg-surface-container-high'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                            item.aplica ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Área de descripción */}
                  {item.aplica && (
                    <div className="mt-4 pt-4 border-t border-outline-variant/50">
                      <label className="block text-label-caps text-on-surface-variant uppercase tracking-wide mb-2">
                        Descripción de la actividad
                      </label>
                      <div className="relative">
                        <textarea
                          maxLength={300}
                          value={item.descripcion}
                          onChange={(e) => handleDescripcion(key, e.target.value)}
                          placeholder="Describe brevemente la actividad..."
                          rows={3}
                          className="w-full px-4 py-3 border border-outline-variant rounded-lg resize-none text-body-md text-on-surface bg-white focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all pb-7"
                        />
                        <span className="absolute bottom-2.5 right-3 text-[11px] font-bold text-outline uppercase tracking-wider pointer-events-none">
                          {item.descripcion.length}/300 caracteres
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-surface-container-lowest px-8 py-6 border-t border-outline-variant flex justify-between items-center">
          <AutosaveIndicator guardando={guardando} guardadoEn={guardadoEn} />
          <div className="flex gap-4">
            <button
              onClick={onAnterior}
              className="flex items-center gap-2 px-8 py-3 border border-outline-variant text-on-surface-variant font-bold text-body-md rounded-lg hover:bg-surface-container transition-all"
            >
              <ArrowLeft size={18} />
              Anterior
            </button>
            <button
              onClick={handleSiguiente}
              className="flex items-center gap-2 px-10 py-3 bg-primary-container text-on-primary font-bold text-body-md rounded-lg hover:bg-primary transition-all shadow-md hover:shadow-lg"
            >
              Siguiente
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
