import { useState } from 'react'
import { Link, AlertTriangle, Send, ArrowLeft, CheckCircle } from 'lucide-react'
import { SeccionHeader } from './SeccionHeader'
import { AutosaveIndicator } from '../ui/AutosaveIndicator'
import type { EntradaDetalleDto, GuardarBorradorRequest } from '../../types/docente'

interface Props {
  entrada: EntradaDetalleDto
  guardando: boolean
  guardadoEn: Date | null
  onGuardar: (data: GuardarBorradorRequest) => void
  onAnterior: () => void
  onEnviar: () => Promise<void>
  esReenvio?: boolean
}

export function Seccion6Anexos({
  entrada, guardando, guardadoEn, onGuardar, onAnterior, onEnviar, esReenvio = false,
}: Props) {
  const [enlace, setEnlace] = useState(entrada.enlaceEvidencias ?? '')
  const enlaceValido = enlace.trim().length > 0
  const [mostrarModal, setMostrarModal] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null)

  const handleCambioEnlace = (valor: string) => {
    setEnlace(valor)
    onGuardar({ enlaceEvidencias: valor })
  }

  const handleGuardarBorrador = () => {
    onGuardar({ enlaceEvidencias: enlace })
  }

  const handleConfirmarEnvio = async () => {
    try {
      setEnviando(true)
      setErrorEnvio(null)
      await onEnviar()
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { mensaje?: string } } })
          ?.response?.data?.mensaje ?? 'Error al enviar el informe.'
      setErrorEnvio(msg)
      setEnviando(false)
      setMostrarModal(false)
    }
  }

  return (
    <div className="py-8 px-8 max-w-5xl mx-auto">

      <SeccionHeader
        practica={entrada.practica}
        numeroGrupo={entrada.numeroGrupo}
        matriculados={entrada.matriculados}
        docenteNombre={entrada.docenteNombre ?? ''}
        paso={6}
        totalPasos={6}
        labelPaso="EVIDENCIAS"
        tituloSeccion="Enlace de evidencias"
      />

      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">

        {/* Card header */}
        <div className="px-8 py-8 border-b border-outline-variant bg-surface-container-lowest">
          <p className="text-body-md text-on-surface-variant">
            Pega el enlace a tu carpeta de evidencias en Google Drive o Microsoft Teams.
          </p>
        </div>

        {/* Card body */}
        <div className="p-8">

          {/* Label + input */}
          <label className="block text-label-caps text-on-surface-variant uppercase tracking-wide mb-2">
            Enlace de carpeta (Drive / Teams)
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
              <Link size={16} />
            </div>
            <input
              type="url"
              value={enlace}
              onChange={(e) => handleCambioEnlace(e.target.value)}
              placeholder="https://drive.google.com/drive/folders/..."
              className="w-full pl-10 pr-4 py-3.5 border border-outline-variant rounded-lg text-body-md text-on-surface focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all"
            />
          </div>
          {!enlaceValido && (
            <p className="text-xs text-danger mt-1">El enlace de evidencias es obligatorio para enviar el informe.</p>
          )}

          {/* Banner amber */}
          <div className="mt-5 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <AlertTriangle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-900 text-body-sm">
                Verifica que el enlace sea público o compartido
              </p>
              <p className="text-amber-800/80 text-body-sm mt-0.5">
                El coordinador debe poder acceder al enlace sin solicitar permiso
                para validar los soportes pedagógicos.
              </p>
            </div>
          </div>
        </div>

        {/* Error de envío */}
        {errorEnvio && (
          <div className="mx-8 mb-6 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-body-sm">
            {errorEnvio}
          </div>
        )}

        {/* Footer — 3 botones */}
        <div className="bg-surface-container-lowest px-8 py-6 border-t border-outline-variant flex items-center justify-between">
          <AutosaveIndicator guardando={guardando} guardadoEn={guardadoEn} />
          <div className="flex gap-3">
            <button
              onClick={onAnterior}
              className="flex items-center gap-2 px-8 py-3 border border-outline-variant text-on-surface-variant font-bold text-body-md rounded-lg hover:bg-surface-container transition-all"
            >
              <ArrowLeft size={18} />
              Anterior
            </button>
            <button
              onClick={handleGuardarBorrador}
              className="flex items-center gap-2 px-8 py-3 border-2 border-primary-container text-primary-container font-bold text-body-md rounded-lg hover:bg-primary-container/10 transition-all"
            >
              Guardar borrador
            </button>
            <button
              onClick={() => setMostrarModal(true)}
              disabled={!enlaceValido}
              title={!enlaceValido ? 'Debes ingresar el enlace de evidencias antes de enviar' : undefined}
              className="flex items-center gap-2 px-10 py-3 bg-primary-container text-on-primary font-bold text-body-md rounded-lg hover:bg-primary transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {esReenvio ? 'Reenviar informe' : 'Enviar informe'}
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !enviando && setMostrarModal(false)}
          />

          {/* Card del modal */}
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-8 z-10">

            {/* Ícono de confirmación */}
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-full bg-primary-container/20 flex items-center justify-center">
                <CheckCircle size={28} className="text-primary-container" />
              </div>
            </div>

            {/* Título */}
            <h2 className="text-headline-md text-on-surface font-bold text-center mb-3">
              {esReenvio ? '¿Confirmar reenvío del informe?' : '¿Confirmar envío del informe?'}
            </h2>

            {/* Texto */}
            <p className="text-body-md text-on-surface-variant text-center mb-5">
              {esReenvio ? (
                <>El coordinador revisará las <strong className="text-on-surface">correcciones
                realizadas</strong> y actualizará el estado del informe.</>
              ) : (
                <>Una vez enviado, <strong className="text-on-surface">no podrás editar
                este informe</strong>. El coordinador podrá revisarlo y descargarlo.</>
              )}
            </p>

            {/* Info del grupo */}
            <div className="flex items-center justify-center gap-2 text-body-sm text-outline mb-8 flex-wrap">
              <span>Práctica {entrada.practica}</span>
              <span>·</span>
              <span>Grupo {entrada.numeroGrupo}</span>
              <span>·</span>
              <span>{entrada.matriculados} estudiantes</span>
            </div>

            {/* Botones */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setMostrarModal(false)}
                disabled={enviando}
                className="px-6 py-2.5 border border-outline-variant text-on-surface-variant font-bold text-body-md rounded-lg hover:bg-surface-container transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarEnvio}
                disabled={enviando}
                className="flex items-center gap-2 px-8 py-2.5 bg-primary-container text-on-primary font-bold text-body-md rounded-lg hover:bg-primary transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {enviando ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    {esReenvio ? 'Reenviando...' : 'Enviando...'}
                  </>
                ) : (
                  <>
                    {esReenvio ? 'Confirmar reenvío' : 'Confirmar envío'}
                    <Send size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
