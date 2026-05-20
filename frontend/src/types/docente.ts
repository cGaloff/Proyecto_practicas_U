export type EstadoEntrada = 'SinIniciar' | 'Borrador' | 'Enviado' | 'Devuelto'

export interface GrupoConEntradaDto {
  entradaId: string | null
  practica: string
  numeroGrupo: number
  matriculados: number
  estado: EstadoEntrada
  guardadoEn: string | null
  enviadoEn: string | null
  observacionAdmin: string | null
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
}
