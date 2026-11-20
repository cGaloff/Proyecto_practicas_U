export interface LoginRequest {
  correo: string
  password: string
}

export interface LoginResponse {
  token: string
  nombreCompleto: string
  correo: string
  rol: 'Docente' | 'Admin'
  esAuxiliar: boolean
  expiraEn: string
}

export interface MensajeResponse {
  mensaje: string
  exitoso: boolean
}
