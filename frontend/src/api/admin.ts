import client from './client'
import type { ProgramaResumen, ProgramaEntradas, DocenteConEntradas, AuditoriaItem, CambiarEstadoRequest } from '../types/admin'
import type { MensajeResponse } from '../types/auth'

export const getProgramas = () =>
  client.get<ProgramaResumen[]>('/admin/programas').then((r) => r.data)

export const getProgramaEntradas = (id: string) =>
  client.get<ProgramaEntradas>(`/admin/programas/${id}/entradas`).then((r) => r.data)

export const getDocentes = () =>
  client.get<DocenteConEntradas[]>('/admin/docentes').then((r) => r.data)

export const getDocenteEntradas = (id: string) =>
  client.get<DocenteConEntradas>(`/admin/docentes/${id}/entradas`).then((r) => r.data)

export const descargarEntrada = (id: string) =>
  client.get(`/admin/entradas/${id}/descargar`, { responseType: 'blob' }).then((r) => r.data)

export const descargarConsolidado = (id: string) =>
  client.get(`/admin/programas/${id}/consolidado`, { responseType: 'blob' }).then((r) => r.data)

export const cambiarEstadoInforme = (id: string, body: CambiarEstadoRequest) =>
  client.put<MensajeResponse>(`/admin/informes/${id}/estado`, body).then((r) => r.data)

export const getAuditoria = (id: string) =>
  client.get<AuditoriaItem[]>(`/admin/informes/${id}/auditoria`).then((r) => r.data)
