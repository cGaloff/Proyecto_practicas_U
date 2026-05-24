import { useState } from 'react'
import { Trophy, Lightbulb, AlertTriangle, ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react'
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
const WARN = 270

type Campo = 'logros' | 'lecciones' | 'limitaciones' | 'recomendaciones'

const counterCls = (len: number) => {
  if (len >= MAX) return 'text-error font-bold'
  if (len >= WARN) return 'text-yellow-600 font-semibold'
  return 'text-outline'
}

const TEXTAREA_CLS =
  'w-full px-4 py-3 border border-outline-variant rounded-lg resize-none text-body-md text-on-surface bg-white placeholder:text-outline/60 focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all'

export function Seccion5Observaciones({
  entrada, guardando, guardadoEn, onGuardar, onSiguiente, onAnterior,
}: Props) {
  const [valores, setValores] = useState({
    logros:          entrada.seccion5A?.logros          ?? '',
    lecciones:       entrada.seccion5A?.lecciones       ?? '',
    limitaciones:    entrada.seccion5B?.limitaciones    ?? '',
    recomendaciones: entrada.seccion5B?.recomendaciones ?? '',
  })

  const handleChange = (campo: Campo, texto: string) => {
    if (texto.length > MAX) return
    const nuevos = { ...valores, [campo]: texto }
    setValores(nuevos)
    onGuardar({
      seccion5A: { logros: nuevos.logros, lecciones: nuevos.lecciones },
      seccion5B: { limitaciones: nuevos.limitaciones, recomendaciones: nuevos.recomendaciones },
    })
  }

  const handleSiguiente = () => {
    onSiguiente({
      seccion5A: { logros: valores.logros, lecciones: valores.lecciones },
      seccion5B: { limitaciones: valores.limitaciones, recomendaciones: valores.recomendaciones },
    })
  }

  return (
    <div className="py-8 px-8 max-w-5xl mx-auto">

      <SeccionHeader
        practica={entrada.practica}
        numeroGrupo={entrada.numeroGrupo}
        matriculados={entrada.matriculados}
        docenteNombre={entrada.docenteNombre ?? ''}
        paso={5}
        totalPasos={6}
        labelPaso="LOGROS Y RETOS"
        tituloSeccion="Logros y retos"
      />

      <div className="flex flex-col gap-6">

        {/* SUBSECCIÓN 5A — Logros y lecciones aprendidas */}
        <div className="bg-white border border-outline-variant border-l-4 border-l-blue-500 rounded-r-xl rounded-l-none overflow-hidden shadow-sm">

          <div className="px-8 py-5 border-b border-outline-variant bg-blue-50/40">
            <div className="flex items-center gap-3">
              <Trophy size={18} className="text-blue-600" />
              <h3 className="font-semibold text-body-md text-on-surface">
                Sección 5A · Logros y lecciones aprendidas
              </h3>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Logros */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-body-sm text-on-surface flex items-center gap-2">
                    <Trophy size={14} className="text-blue-500" />
                    Logros y avances significativos
                  </label>
                  <span className={`text-[11px] uppercase tracking-wider ${counterCls(valores.logros.length)}`}>
                    {valores.logros.length} / {MAX}
                  </span>
                </div>
                <textarea
                  value={valores.logros}
                  onChange={(e) => handleChange('logros', e.target.value)}
                  placeholder="Describa los logros más relevantes alcanzados con el grupo durante el período..."
                  maxLength={MAX}
                  rows={5}
                  className={TEXTAREA_CLS}
                />
                <p className="text-[11px] text-outline italic">
                  Mencione hitos alcanzados por los estudiantes durante el período.
                </p>
              </div>

              {/* Lecciones */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-body-sm text-on-surface flex items-center gap-2">
                    <Lightbulb size={14} className="text-blue-500" />
                    Lecciones aprendidas
                  </label>
                  <span className={`text-[11px] uppercase tracking-wider ${counterCls(valores.lecciones.length)}`}>
                    {valores.lecciones.length} / {MAX}
                  </span>
                </div>
                <textarea
                  value={valores.lecciones}
                  onChange={(e) => handleChange('lecciones', e.target.value)}
                  placeholder="Identifique los aprendizajes pedagógicos más valiosos de este período de práctica..."
                  maxLength={MAX}
                  rows={5}
                  className={TEXTAREA_CLS}
                />
                <p className="text-[11px] text-outline italic">
                  Identifique qué aspectos pedagógicos funcionaron mejor.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SUBSECCIÓN 5B — Retos y recomendaciones */}
        <div className="bg-white border border-outline-variant border-l-4 border-l-amber-500 rounded-r-xl rounded-l-none overflow-hidden shadow-sm">

          <div className="px-8 py-5 border-b border-outline-variant bg-amber-50/40">
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} className="text-amber-600" />
              <h3 className="font-semibold text-body-md text-on-surface">
                Sección 5B · Retos y recomendaciones
              </h3>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Limitaciones */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-body-sm text-on-surface flex items-center gap-2">
                    <AlertTriangle size={14} className="text-amber-500" />
                    Limitaciones y retos
                  </label>
                  <span className={`text-[11px] uppercase tracking-wider ${counterCls(valores.limitaciones.length)}`}>
                    {valores.limitaciones.length} / {MAX}
                  </span>
                </div>
                <textarea
                  value={valores.limitaciones}
                  onChange={(e) => handleChange('limitaciones', e.target.value)}
                  placeholder="Describa los principales obstáculos encontrados durante el período de práctica..."
                  maxLength={MAX}
                  rows={5}
                  className={TEXTAREA_CLS}
                />
                <p className="text-[11px] text-outline italic">
                  Especifique obstáculos técnicos o pedagógicos encontrados.
                </p>
              </div>

              {/* Recomendaciones */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-body-sm text-on-surface flex items-center gap-2">
                    <ArrowUpRight size={14} className="text-amber-500" />
                    Perspectivas y recomendaciones
                  </label>
                  <span className={`text-[11px] uppercase tracking-wider ${counterCls(valores.recomendaciones.length)}`}>
                    {valores.recomendaciones.length} / {MAX}
                  </span>
                </div>
                <textarea
                  value={valores.recomendaciones}
                  onChange={(e) => handleChange('recomendaciones', e.target.value)}
                  placeholder="Proponga acciones de mejora y perspectivas para el próximo período de práctica..."
                  maxLength={MAX}
                  rows={5}
                  className={TEXTAREA_CLS}
                />
                <p className="text-[11px] text-outline italic">
                  Proponga acciones de mejora para el próximo semestre.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer — fuera de las cards, alineado con el resto */}
      <div className="mt-6 bg-white border border-outline-variant rounded-xl px-8 py-6 flex justify-between items-center shadow-sm">
        <AutosaveIndicator guardando={guardando} guardadoEn={guardadoEn} />
        <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
          Paso 5 de 6
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
  )
}
