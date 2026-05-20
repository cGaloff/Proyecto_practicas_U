import client from './client'
import type { LoginRequest, LoginResponse, ChangePasswordRequest, MensajeResponse } from '../types/auth'

export const login = (data: LoginRequest) =>
  client.post<LoginResponse>('/auth/login', data).then((r) => r.data)

export const changePassword = (data: ChangePasswordRequest) =>
  client.post<MensajeResponse>('/auth/change-password', data).then((r) => r.data)

export const logout = () =>
  client.post<MensajeResponse>('/auth/logout').then((r) => r.data)
