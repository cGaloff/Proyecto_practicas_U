import client from './client'
import type { LoginRequest, LoginResponse, MensajeResponse } from '../types/auth'

export const login = (data: LoginRequest) =>
  client.post<LoginResponse>('/auth/login', data)

export const logout = () =>
  client.post<MensajeResponse>('/auth/logout')
