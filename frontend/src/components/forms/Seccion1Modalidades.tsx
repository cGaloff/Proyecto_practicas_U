import { useState } from 'react'
import { CheckCircle, XCircle, ChevronUp, ChevronDown, ArrowRight } from 'lucide-react'
import { SeccionHeader } from './SeccionHeader'
import { AutosaveIndicator } from '../ui/AutosaveIndicator'
import type { EntradaDetalleDto, GuardarBorradorRequest } from '../../types/docente'

interface Props {
  entrada: EntradaDetalleDto
  guardando: boolean
  guardadoEn: Date | null
  onGuardar: (data: GuardarBorradorRequest) => void
  onSiguiente: (data: GuardarBorradorRequest) => void
}

const CAMPOS = [
  { key: 'publica',             label: 'INSTITUCIÓN PÚBLICA' },
  { key: 'privada',             label: 'INSTITUCIÓN PRIVADA' },
  { key: 'ongSocial',           label: 'ONG / SOCIAL' },
  { key: 'vinculacionLaboral',  label: 'VINCULACIÓN LABORAL' },
  { key: 'enCasa',              label: 'EN CASA' },
  { key: 'otrosMunicipios',     label: 'OTROS MUNICIPIOS' },
] as const

type Campo = typeof CAMPOS[number]['key']

export function Seccion1Modalidades({
  entrada, guardando, guardadoEn, onGuardar, onSiguiente,
}: Props) {
  const [valores, setValores] = useState<Record<Campo, number>>({
    publica:            entrada.seccion2B?.publica            ?? 0,
    privada:            entrada.seccion2B?.privada            ?? 0,
    ongSocial:          entrada.seccion2B?.ongSocial          ?? 0,
    vinculacionLaboral: entrada.seccion2B?.vinculacionLaboral ?? 0,
    enCasa:             entrada.seccion2B?.enCasa             ?? 0,
    otrosMunicipios:    entrada.seccion2B?.otrosMunicipios    ?? 0,
  })

  const suma = Object.values(valores).reduce((a, b) => a + b, 0)
  const coincide = suma === entrada.matriculados

  const handleChange = (campo: Campo, valor: number) => {
    const nuevos = { ...valores, [campo]: Math.max(0, valor) }
    setValores(nuevos)
    onGuardar({ seccion2B: nuevos })
  }

  const handleSiguiente = () => {
    onSiguiente({ seccion2B: valores })
  }

  return (
    <div className="py-8 px-8 max-w-5xl mx-auto">

      <SeccionHeader
        practica={entrada.practica}
        numeroGrupo={entrada.numeroGrupo}
        matriculados={entrada.matriculados}
        docenteNombre={entrada.docenteNombre ?? ''}
        programa={entrada.programa ?? ''}
        paso={1}
        totalPasos={6}
        labelPaso="DISTRIBUCIÓN POR MODALIDAD"
        tituloSeccion="Distribución por modalidad y escenario"
      />

      {/* Card principal del formulario */}
      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">

        {/* Header de la card con instrucción */}
        <div className="px-8 py-8 border-b border-outline-variant bg-surface-container-lowest">
          <p className="text-body-md text-on-surface-variant">
            Ingresa el número de estudiantes por modalidad.
            La suma debe ser igual al total de matriculados ({entrada.matriculados}).
          </p>
        </div>

        {/* Cuerpo: grid de inputs */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
            {CAMPOS.map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <label className="block text-label-caps text-on-surface-variant uppercase tracking-wide">
                  {label}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={valores[key]}
                    onChange={(e) => handleChange(key, Number(e.target.value))}
                    className="w-full px-4 py-3.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all text-body-md font-semibold text-on-surface appearance-none pr-8"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col text-outline-variant pointer-events-none">
                    <ChevronUp size={12} />
                    <ChevronDown size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicador de suma */}
          {coincide ? (
            <div className="mt-12 bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <CheckCircle size={22} />
              </div>
              <div>
                <p className="text-emerald-900 font-semibold text-body-md">
                  Total ingresado: <span className="text-emerald-600">{suma} / {entrada.matriculados}</span>
                </p>
                <p className="text-emerald-700/80 text-body-sm">
                  Coincide con el total del grupo asignado por el sistema.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-12 bg-red-50 border border-red-100 rounded-lg p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                <XCircle size={22} />
              </div>
              <div>
                <p className="text-red-900 font-semibold text-body-md">
                  Total ingresado: <span className="text-red-600">{suma} / {entrada.matriculados}</span>
                </p>
                <p className="text-red-700/80 text-body-sm">
                  No coincide. Ajusta los valores hasta completar {entrada.matriculados} estudiantes.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-surface-container-lowest px-8 py-6 border-t border-outline-variant flex justify-between items-center">
          <AutosaveIndicator guardando={guardando} guardadoEn={guardadoEn} />
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
  )
}
