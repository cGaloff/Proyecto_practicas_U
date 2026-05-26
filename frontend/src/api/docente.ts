import client from './client'
import type { GrupoConEntradaDto, EntradaDetalle, EntradaDetalleDto, GuardarBorradorRequest } from '../types/docente'
import type { MensajeResponse } from '../types/auth'

export const getGrupos = () =>
  client.get<GrupoConEntradaDto[]>('/docente/grupos')

export const getEntrada = (id: string) =>
  client.get<EntradaDetalle>(`/docente/entradas/${id}`)

export const guardarEntrada = (id: string, body: unknown) =>
  client.put<MensajeResponse>(`/docente/entradas/${id}`, body)

export const guardarBorrador = async (id: string, data: GuardarBorradorRequest) => {
  await client.put(`/docente/entradas/${id}`, data)
  return client.get<EntradaDetalleDto>(`/docente/entradas/${id}`)
}

export const enviarEntrada = (id: string) =>
  client.post<MensajeResponse>(`/docente/entradas/${id}/enviar`)

export const descargarEntrada = (id: string) =>
  client.get(`/docente/entradas/${id}/descargar`, { responseType: 'blob' })

export const getEntradaDetalleFull = (id: string) =>
  client.get<EntradaDetalleDto>(`/docente/entradas/${id}`)
