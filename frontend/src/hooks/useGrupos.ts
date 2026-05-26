import { useState, useEffect, useCallback } from 'react'
import { getGrupos } from '../api/docente'
import type { GrupoConEntradaDto } from '../types/docente'

interface UseGruposResult {
  grupos: GrupoConEntradaDto[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useGrupos(): UseGruposResult {
  const [grupos, setGrupos] = useState<GrupoConEntradaDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGrupos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await getGrupos()
      setGrupos(res.data)
    } catch {
      setError('No se pudieron cargar los grupos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchGrupos() }, [fetchGrupos])

  return { grupos, loading, error, refetch: fetchGrupos }
}
