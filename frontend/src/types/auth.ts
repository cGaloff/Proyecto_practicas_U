export type Rol = 'Docente' | 'Admin'

export interface LoginRequest {
  correo: string
  password: string
}

export interface LoginResponse {
  token: string
  nombreCompleto: string
  correo: string
  rol: Rol
  primerLogin: boolean
  expiraEn: string
}

export interface ChangePasswordRequest {
  passwordActual: string
  passwordNuevo: string
}

export interface MensajeResponse {
  exitoso?: boolean
  mensaje: string
}
