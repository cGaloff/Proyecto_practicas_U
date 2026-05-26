import { useState, useEffect, useCallback, useRef } from 'react'
import { getEntrada, guardarBorrador } from '../api/docente'
import type { EntradaDetalleDto, GuardarBorradorRequest } from '../types/docente'

export function useEntrada(entradaId: string) {
  const [entrada, setEntrada] = useState<EntradaDetalleDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [guardadoEn, setGuardadoEn] = useState<Date | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (!entradaId) return
    let cancelled = false
    setLoading(true)
    setError(null)
    getEntrada(entradaId)
      .then((res) => { if (!cancelled) setEntrada(res.data) })
      .catch(() => { if (!cancelled) setError('No se pudo cargar la entrada.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [entradaId])

  const guardar = useCallback(async (data: GuardarBorradorRequest) => {
    if (!entradaId) return
    try {
      setGuardando(true)
      const res = await guardarBorrador(entradaId, data)
      setEntrada(res.data)
      setGuardadoEn(new Date())
    } catch (err) {
      console.error('Error al guardar:', err)
    } finally {
      setGuardando(false)
    }
  }, [entradaId])

  const guardarConDebounce = useCallback((data: GuardarBorradorRequest) => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => guardar(data), 1500)
  }, [guardar])

  return { entrada, loading, error, guardando, guardadoEn, guardar, guardarConDebounce }
}
