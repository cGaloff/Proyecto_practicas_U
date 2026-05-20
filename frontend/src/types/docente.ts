export type EstadoEntrada =
  | 'SinIniciar'
  | 'Borrador'
  | 'Enviado'
  | 'Devuelto'

export interface GrupoResumen {
  entradaId: string | null
  practica: string
  numeroGrupo: number
  matriculados: number
  estado: EstadoEntrada
  guardadoEn: string | null
  enviadoEn: string | null
  observacionAdmin: string | null
}

export interface GruposResponse {
  grupos: GrupoResumen[]
}

export interface Actividad {
  aplica: boolean
  descripcion: string | null
}

export interface SeccionEntrada {
  actividadesDirigidas: Actividad
  practicaDocente: Actividad
  ayudantia: Actividad
  monitorAcademico: Actividad
  tutorPares: Actividad
}

export interface EntradaDetalle {
  id: string
  practica: string
  numeroGrupo: number
  matriculados: number
  estado: EstadoEntrada
  observacionAdmin: string | null
  guardadoEn: string | null
  enviadoEn: string | null
  seccion2b: SeccionEntrada | null
}
