export type EstadoInforme =
  | 'EnProgreso'
  | 'ListoParaRevision'
  | 'EnRevision'
  | 'Devuelto'
  | 'Aprobado'

export type EstadoEntrada =
  | 'SinIniciar'
  | 'Borrador'
  | 'Enviado'
  | 'Devuelto'

export interface ProgramaResumen {
  programaId: string
  nombre: string
  codigo: string
  informeId: string
  semestre: string
  estado: EstadoInforme
  totalEntradas: number
  enviadas: number
  fechaEntrega: string | null
}

export interface EntradaResumen {
  id: string
  practica: string
  numeroGrupo: number
  matriculados: number
  docente: string
  estado: EstadoEntrada
  guardadoEn: string | null
  enviadoEn: string | null
}

export interface ProgramaEntradas {
  programa: string
  semestre: string
  estado: EstadoInforme
  entradas: EntradaResumen[]
}

export interface GrupoDocente {
  entradaId: string | null
  practica: string
  numeroGrupo: number
  matriculados: number
  estado: EstadoEntrada
  guardadoEn: string | null
  enviadoEn: string | null
  observacionAdmin: string | null
}

export interface DocenteConEntradas {
  docenteId: string
  nombre: string
  correo: string
  programa: string
  grupos: GrupoDocente[]
}

export interface AuditoriaItem {
  id: string
  adminNombre: string
  estadoAnterior: string
  estadoNuevo: string
  observacion: string | null
  creadoEn: string
}

export interface CambiarEstadoRequest {
  nuevoEstado: EstadoInforme
  observacion?: string
}
