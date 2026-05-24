import { useState } from 'react'
import { Info, ArrowLeft, ArrowRight, ChevronUp, ChevronDown, Users, FileText } from 'lucide-react'
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

type Campo = 'iniciaron' | 'finalizaron' | 'retirados' | 'pendientes' | 'noAprobaron'

interface CampoConfig {
  key: Campo
  label: string
  desc: string
}

const CAMPOS_FILA1: CampoConfig[] = [
  { key: 'iniciaron',   label: 'INICIARON',               desc: 'Total de inscritos al inicio' },
  { key: 'finalizaron', label: 'FINALIZARON',              desc: 'Estudiantes que concluyeron'  },
  { key: 'retirados',   label: 'RETIRADOS',                desc: 'Deserción o retiro formal'    },
]

const CAMPOS_FILA2: CampoConfig[] = [
  { key: 'pendientes',  label: 'PENDIENTES (LIC./INCAP.)', desc: 'Casos médicos o licencias'  },
  { key: 'noAprobaron', label: 'NO APROBARON',              desc: 'No alcanzaron nota mínima'  },
]

const INPUT_CLS =
  'w-full px-4 py-3.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all text-body-md font-semibold text-on-surface appearance-none pr-8'

export function Seccion2Situacion({
  entrada, guardando, guardadoEn, onGuardar, onSiguiente, onAnterior,
}: Props) {
  const [valores, setValores] = useState<Record<Campo, number>>({
    iniciaron:   entrada.seccion3?.iniciaron   ?? 0,
    finalizaron: entrada.seccion3?.finalizaron ?? 0,
    retirados:   entrada.seccion3?.retirados   ?? 0,
    pendientes:  entrada.seccion3?.pendientes  ?? 0,
    noAprobaron: entrada.seccion3?.noAprobaron ?? 0,
  })

  const handleChange = (campo: Campo, valor: number) => {
    const nuevos = { ...valores, [campo]: Math.max(0, valor) }
    setValores(nuevos)
    onGuardar({ seccion3: nuevos })
  }

  const handleSiguiente = () => {
    onSiguiente({ seccion3: valores })
  }

  const renderCampo = ({ key, label, desc }: CampoConfig) => (
    <div key={key} className="space-y-1.5">
      <label className="block text-label-caps text-on-surface-variant uppercase tracking-wide">
        {label}
      </label>
      <p className="text-[11px] text-outline">{desc}</p>
      <div className="relative">
        <input
          type="number"
          min={0}
          value={valores[key]}
          onChange={(e) => handleChange(key, Number(e.target.value))}
          className={INPUT_CLS}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col text-outline-variant pointer-events-none">
          <ChevronUp size={12} />
          <ChevronDown size={12} />
        </div>
      </div>
    </div>
  )

  return (
    <div className="py-8 px-8 max-w-5xl mx-auto">

      <SeccionHeader
        practica={entrada.practica}
        numeroGrupo={entrada.numeroGrupo}
        matriculados={entrada.matriculados}
        docenteNombre={entrada.docenteNombre ?? ''}
        paso={2}
        totalPasos={6}
        labelPaso="SITUACIÓN ACADÉMICA"
        tituloSeccion="Situación académica del grupo"
      />

      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">

        {/* Card header */}
        <div className="px-8 py-8 border-b border-outline-variant bg-surface-container-lowest">
          <p className="text-body-md text-on-surface-variant">
            Registra la situación académica final del grupo al cierre del período de prácticas.
          </p>
        </div>

        {/* Card body */}
        <div className="p-8">

          {/* Banner informativo */}
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Info size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-blue-900 font-semibold text-body-sm">
                Registro de permanencia y rendimiento académico
              </p>
              <p className="text-blue-700/80 text-body-sm mt-0.5">
                Los datos deben reflejar la situación real al cierre del período. La suma de finalizaron,
                retirados y pendientes no debe superar el total de matriculados.
              </p>
            </div>
          </div>

          {/* Fila 1 — 3 campos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-8 mb-8">
            {CAMPOS_FILA1.map(renderCampo)}
          </div>

          {/* Fila 2 — 2 campos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {CAMPOS_FILA2.map(renderCampo)}
          </div>

          {/* Tarjetas de ayuda */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/50">
              <div className="flex items-center gap-3 mb-2">
                <Users size={16} className="text-primary-container" />
                <p className="font-semibold text-body-sm text-on-surface">¿Qué es un estudiante retirado?</p>
              </div>
              <p className="text-body-sm text-on-surface-variant">
                Se considera retirado el estudiante que formalizó su retiro ante la institución
                o presentó deserción comprobada durante el período de prácticas.
              </p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/50">
              <div className="flex items-center gap-3 mb-2">
                <FileText size={16} className="text-primary-container" />
                <p className="font-semibold text-body-sm text-on-surface">Pendientes (lic./incap.)</p>
              </div>
              <p className="text-body-sm text-on-surface-variant">
                Incluye estudiantes con licencia médica, incapacidad o cualquier situación
                excepcional que impidió la participación sin constituir retiro formal.
              </p>
            </div>
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
