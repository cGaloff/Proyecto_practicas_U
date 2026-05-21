import { useState, useEffect } from 'react'
import { getGrupos } from '../api/docente'
import type { GrupoConEntradaDto } from '../types/docente'

interface UseGruposResult {
  grupos: GrupoConEntradaDto[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useGrupos(): UseGruposResult {
  const [grupos, setGrupos] = useState<GrupoConEntradaDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getGrupos()
      .then((res) => {
        if (!cancelled) setGrupos(res.data)
      })
      .catch(() => {
        if (!cancelled) setError('No se pudieron cargar los grupos.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [tick])

  return { grupos, loading, error, refetch: () => setTick((t) => t + 1) }
}
