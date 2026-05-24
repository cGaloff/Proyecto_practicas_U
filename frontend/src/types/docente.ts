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

export interface Seccion2BData {
  publica: number
  privada: number
  ongSocial: number
  vinculacionLaboral: number
  enCasa: number
  otrosMunicipios: number
}

export interface Seccion3Data {
  iniciaron: number
  finalizaron: number
  retirados: number
  pendientes: number
  noAprobaron: number
}

export interface ActividadItem {
  aplica: boolean
  descripcion: string
}

export interface Seccion4AData {
  salidasCampo: ActividadItem
  eventosAcademicos: ActividadItem
  clasesEspejo: ActividadItem
}

export interface Seccion4BData {
  estrategias: string
  publicaciones: string
  otras: string
}

export interface EntradaDetalleDto extends EntradaDetalle {
  docenteNombre?: string
  seccion2B?: Seccion2BData | null
  seccion3?: Seccion3Data | null
  seccion4A?: Seccion4AData | null
  seccion4B?: Seccion4BData | null
}

export interface GuardarBorradorRequest {
  seccion2B?: Seccion2BData
  seccion3?: Seccion3Data
  seccion4A?: Seccion4AData
  seccion4B?: Seccion4BData
  [key: string]: unknown
}
