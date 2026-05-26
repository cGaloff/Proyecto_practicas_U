import { useState } from 'react'
import { Info, ArrowLeft, ArrowRight } from 'lucide-react'
import { SeccionHeader } from './SeccionHeader'
import { AutosaveIndicator } from '../ui/AutosaveIndicator'
import type { EntradaDetalleDto, GuardarBorradorRequest } from '../../types/docente'

interface Props {
  entrada: EntradaDetalleDto
  guardando: boolean
  guardadoEn: Date | null
  onGuardar: (data: GuardarBorradorRequest) => void
  onSiguiente: (data: GuardarBorradorRequest) => void
  onAnterior: () => void
}

const MAX = 300
const WARN_THRESHOLD = 270

interface CampoConfig {
  key: 'estrategias' | 'publicaciones' | 'otras'
  titulo: string
  placeholder: string
}

const CAMPOS: CampoConfig[] = [
  {
    key: 'estrategias',
    titulo: 'Estrategias didácticas de alto impacto',
    placeholder:
      'ej. Aprendizaje basado en proyectos comunitarios con herramientas digitales interactivas...',
  },
  {
    key: 'publicaciones',
    titulo: 'Publicaciones / productos académicos',
    placeholder:
      'ej. Artículo en revista indexada, capítulos de libro o material didáctico registrado...',
  },
  {
    key: 'otras',
    titulo: 'Otras iniciativas relevantes',
    placeholder:
      'ej. Organización de eventos, convenios institucionales o proyectos de extensión...',
  },
]

export function Seccion4Resultados({
  entrada, guardando, guardadoEn, onGuardar, onSiguiente, onAnterior,
}: Props) {
  const [valores, setValores] = useState({
    estrategias:   entrada.seccion4B?.estrategias   ?? '',
    publicaciones: entrada.seccion4B?.publicaciones ?? '',
    otras:         entrada.seccion4B?.otras         ?? '',
  })

  const handleChange = (campo: keyof typeof valores, texto: string) => {
    if (texto.length > MAX) return
    const nuevos = { ...valores, [campo]: texto }
    setValores(nuevos)
    onGuardar({ seccion4B: nuevos })
  }

  const handleSiguiente = () => {
    onSiguiente({ seccion4B: valores })
  }

  const counterColor = (len: number) => {
    if (len >= MAX) return 'text-error font-bold'
    if (len >= WARN_THRESHOLD) return 'text-yellow-600 font-semibold'
    return 'text-outline'
  }

  return (
    <div className="py-8 px-8 max-w-5xl mx-auto">

      <SeccionHeader
        practica={entrada.practica}
        numeroGrupo={entrada.numeroGrupo}
        matriculados={entrada.matriculados}
        docenteNombre={entrada.docenteNombre ?? ''}
        programa={entrada.programa ?? ''}
        paso={4}
        totalPasos={6}
        labelPaso="INNOVACIÓN"
        tituloSeccion="Experiencias de innovación y productos de impacto"
      />

      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">

        {/* Card header */}
        <div className="px-8 py-8 border-b border-outline-variant bg-surface-container-lowest">
          <p className="text-body-md text-on-surface-variant">
            Describe brevemente las acciones de innovación y resultados obtenidos durante el período.
          </p>
        </div>

        {/* Card body */}
        <div className="p-8">

          {/* Banner informativo */}
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Info size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-blue-800 text-body-sm">
              Describe brevemente las acciones de innovación y resultados obtenidos durante el período
              (máx. 300 caracteres por campo).
              Si no aplica para este período, puede dejar el campo en blanco.
            </p>
          </div>

          {/* 3 campos textarea */}
          <div className="flex flex-col gap-6">
            {CAMPOS.map(({ key, titulo, placeholder }) => {
              const len = valores[key].length
              return (
                <div key={key} className="border border-outline-variant rounded-xl p-6 bg-white">

                  {/* Título + contador */}
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-semibold text-body-md text-on-surface">
                      {titulo}
                    </label>
                    <span className={`text-[11px] uppercase tracking-wider ${counterColor(len)}`}>
                      {len} / {MAX}
                    </span>
                  </div>

                  {/* Barra de progreso */}
                  <div className="h-0.5 rounded-full bg-surface-container-high mb-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        len >= MAX
                          ? 'bg-error'
                          : len >= WARN_THRESHOLD
                            ? 'bg-yellow-400'
                            : 'bg-primary-container'
                      }`}
                      style={{ width: `${Math.min((len / MAX) * 100, 100)}%` }}
                    />
                  </div>

                  {/* Textarea */}
                  <textarea
                    value={valores[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={placeholder}
                    maxLength={MAX}
                    rows={4}
                    className="w-full px-4 py-3 border border-outline-variant rounded-lg resize-none text-body-md text-on-surface bg-white placeholder:text-outline/60 focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all"
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-surface-container-lowest px-8 py-6 border-t border-outline-variant flex justify-between items-center">
          <AutosaveIndicator guardando={guardando} guardadoEn={guardadoEn} />
          <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
            Paso 4 de 6
          </span>
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
