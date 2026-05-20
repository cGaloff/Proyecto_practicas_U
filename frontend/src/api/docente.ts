import client from './client'
import type { GruposResponse, EntradaDetalle } from '../types/docente'
import type { MensajeResponse } from '../types/auth'

export const getGrupos = () =>
  client.get<GruposResponse>('/docente/grupos').then((r) => r.data)

export const getEntrada = (id: string) =>
  client.get<EntradaDetalle>(`/docente/entradas/${id}`).then((r) => r.data)

export const guardarEntrada = (id: string, body: unknown) =>
  client.put<MensajeResponse>(`/docente/entradas/${id}`, body).then((r) => r.data)

export const enviarEntrada = (id: string) =>
  client.post<MensajeResponse>(`/docente/entradas/${id}/enviar`).then((r) => r.data)

export const descargarEntrada = (id: string) =>
  client.get(`/docente/entradas/${id}/descargar`, { responseType: 'blob' }).then((r) => r.data)
