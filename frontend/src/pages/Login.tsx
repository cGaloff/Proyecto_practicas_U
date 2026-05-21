import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { LogIn, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { login } from '../api/auth'
import { useAuthStore } from '../store/authStore'

const schema = z.object({
  correo: z.string().email('Ingresa un correo válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

type FormData = z.infer<typeof schema>

export default function Login() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      setError(null)
      const res = await login(data)
      setAuth(res.data)

      if (res.data.rol === 'Admin') {
        navigate('/admin')
      } else {
        navigate('/docente')
      }
    } catch (err: any) {
      const msg = err.response?.data?.mensaje
        ?? 'Credenciales incorrectas. Intenta de nuevo.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">

      {/* Header institucional */}
      <div className="flex flex-col items-center mb-8">
        <div className="bg-primary rounded-[8px] w-[80px] h-[80px] flex items-center justify-center mb-4 shadow-card">
          <LogIn className="text-white" size={40} />
        </div>
        <h1 className="text-[28px] font-bold text-text-main tracking-tight">
          Iniciar Sesión
        </h1>
        <p className="text-text-secondary text-[14px] mt-1">
          Accede a tu plataforma académica institucional
        </p>
      </div>

      {/* Card del formulario */}
      <div className="bg-white rounded-[12px] shadow-card border border-card-border w-full max-w-[448px] overflow-hidden">

        <div className="p-[33px]">

          {error && (
            <div className="mb-4 bg-danger-bg border border-red-200 rounded-[8px] px-4 py-3 text-danger text-[13px]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[24px]">

            {/* Campo correo */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-medium text-text-main">
                Correo Institucional
              </label>
              <div className="relative">
                <div className="absolute left-[12px] top-1/2 -translate-y-1/2 text-text-muted">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="usuario@universidad.edu"
                  className={`w-full h-[49px] pl-[41px] pr-[16px] border rounded-[8px] text-[14px] text-text-main bg-surface outline-none transition-all
                    focus:border-primary focus:ring-2 focus:ring-primary/10
                    ${errors.correo ? 'border-danger' : 'border-[rgba(194,198,209,0.4)]'}`}
                  {...register('correo')}
                />
              </div>
              {errors.correo && (
                <p className="text-[12px] text-danger">{errors.correo.message}</p>
              )}
            </div>

            {/* Campo contraseña */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-medium text-text-main">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute left-[12px] top-1/2 -translate-y-1/2 text-text-muted">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full h-[49px] pl-[41px] pr-[44px] border rounded-[8px] text-[14px] text-text-main bg-white outline-none transition-all
                    focus:border-primary focus:ring-2 focus:ring-primary/10
                    ${errors.password ? 'border-danger' : 'border-[rgba(194,198,209,0.4)]'}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[12px] top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[12px] text-danger">{errors.password.message}</p>
              )}
            </div>

            {/* Botón submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-[14px] rounded-[8px] flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? 'Ingresando...' : (
                <>
                  Entrar
                  <LogIn size={16} />
                </>
              )}
            </button>

          </form>
        </div>

        {/* Banner de seguridad */}
        <div className="bg-[#ecf5fe] border-t border-[rgba(194,198,209,0.3)] px-[33px] py-[16px] flex gap-[12px] items-start">
          <ShieldCheck className="text-primary shrink-0 mt-0.5" size={16} />
          <p className="text-[12px] text-text-secondary leading-[1.6]">
            Esta es una conexión segura. Asegúrate de cerrar tu sesión al
            finalizar el trabajo en equipos públicos.
          </p>
        </div>
      </div>

      {/* Footer institucional */}
      <footer className="mt-8 text-center">
        <p className="text-[12px] text-text-muted font-semibold uppercase tracking-wider">
          ACADEMIC PORTAL
        </p>
        <p className="text-[12px] text-text-muted mt-1">
          © 2026 Universidad del Magdalena. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  )
}
