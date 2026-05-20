import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import { changePassword } from '../api/auth'
import { useAuthStore } from '../store/authStore'

const schema = z
  .object({
    passwordActual: z.string().min(1, 'Requerido'),
    passwordNuevo: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmacionPassword: z.string(),
  })
  .refine((d) => d.passwordNuevo === d.confirmacionPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmacionPassword'],
  })
  .refine((d) => d.passwordNuevo !== d.passwordActual, {
    message: 'La nueva contraseña debe ser diferente a la actual',
    path: ['passwordNuevo'],
  })

type FormData = z.infer<typeof schema>

function getStrength(pwd: string): { nivel: number; label: string; color: string } {
  if (pwd.length === 0) return { nivel: 0, label: '', color: '' }
  if (pwd.length < 6)   return { nivel: 1, label: 'Débil',  color: 'bg-danger' }
  if (pwd.length < 10)  return { nivel: 2, label: 'Media',  color: 'bg-warning' }
  return                       { nivel: 3, label: 'Fuerte', color: 'bg-success' }
}

export default function CambioPassword() {
  const navigate = useNavigate()
  const { user, token, setAuth, clearAuth } = useAuthStore()
  const [showActual, setShowActual] = useState(false)
  const [showNuevo, setShowNuevo] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [pwdNuevo, setPwdNuevo] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const strength = getStrength(pwdNuevo)

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      setError(null)
      await changePassword(data)

      if (user && token) {
        setAuth({
          token,
          nombreCompleto: user.nombreCompleto,
          correo: user.correo,
          rol: user.rol,
          primerLogin: false,
          expiraEn: new Date(Date.now() + 480 * 60 * 1000).toISOString(),
        })
      }

      if (user?.rol === 'Admin') {
        navigate('/admin')
      } else {
        navigate('/docente')
      }
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { mensaje?: string } } })?.response?.data?.mensaje
        ?? 'Error al cambiar la contraseña.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">

      <div className="flex flex-col items-center mb-8">
        <div className="bg-primary rounded-[8px] w-[80px] h-[80px] flex items-center justify-center mb-4 shadow-card">
          <Lock className="text-white" size={40} />
        </div>
        <h1 className="text-[28px] font-bold text-text-main">
          Cambio de contraseña
        </h1>
        <p className="text-text-secondary text-[14px] mt-1">
          Por seguridad debes establecer una contraseña personal
        </p>
      </div>

      <div className="bg-white rounded-[12px] shadow-card border border-card-border w-full max-w-[448px] overflow-hidden">

        {/* Banner amber */}
        <div className="bg-warning-bg border-b border-[rgba(194,198,209,0.3)] px-[33px] py-[14px] flex gap-[10px] items-start">
          <ShieldCheck className="text-warning shrink-0 mt-0.5" size={16} />
          <p className="text-[12px] text-warning leading-[1.6]">
            Tu contraseña inicial es temporal. Debes cambiarla antes de continuar.
          </p>
        </div>

        <div className="p-[33px]">

          {error && (
            <div className="mb-4 bg-danger-bg border border-red-200 rounded-[8px] px-4 py-3 text-danger text-[13px]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[20px]">

            {/* Contraseña actual */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-medium text-text-main">
                Contraseña actual
              </label>
              <div className="relative">
                <div className="absolute left-[12px] top-1/2 -translate-y-1/2 text-text-muted">
                  <Lock size={18} />
                </div>
                <input
                  type={showActual ? 'text' : 'password'}
                  className={`w-full h-[49px] pl-[41px] pr-[44px] border rounded-[8px] text-[14px] bg-white outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.passwordActual ? 'border-danger' : 'border-[rgba(194,198,209,0.4)]'}`}
                  {...register('passwordActual')}
                />
                <button type="button" onClick={() => setShowActual(!showActual)}
                  className="absolute right-[12px] top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors">
                  {showActual ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.passwordActual && <p className="text-[12px] text-danger">{errors.passwordActual.message}</p>}
            </div>

            {/* Nueva contraseña */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-medium text-text-main">
                Contraseña nueva
              </label>
              <div className="relative">
                <div className="absolute left-[12px] top-1/2 -translate-y-1/2 text-text-muted">
                  <Lock size={18} />
                </div>
                <input
                  type={showNuevo ? 'text' : 'password'}
                  className={`w-full h-[49px] pl-[41px] pr-[44px] border rounded-[8px] text-[14px] bg-white outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.passwordNuevo ? 'border-danger' : 'border-[rgba(194,198,209,0.4)]'}`}
                  {...register('passwordNuevo', {
                    onChange: (e) => setPwdNuevo(e.target.value),
                  })}
                />
                <button type="button" onClick={() => setShowNuevo(!showNuevo)}
                  className="absolute right-[12px] top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors">
                  {showNuevo ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {pwdNuevo.length > 0 && (
                <div className="flex items-center gap-[8px] mt-1">
                  <div className="flex gap-[4px] flex-1">
                    {[1, 2, 3].map((n) => (
                      <div key={n}
                        className={`h-[4px] flex-1 rounded-full transition-all ${strength.nivel >= n ? strength.color : 'bg-[#e0e3e6]'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-text-muted">{strength.label}</span>
                </div>
              )}
              {errors.passwordNuevo && <p className="text-[12px] text-danger">{errors.passwordNuevo.message}</p>}
            </div>

            {/* Confirmar contraseña */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-medium text-text-main">
                Confirmar contraseña
              </label>
              <div className="relative">
                <div className="absolute left-[12px] top-1/2 -translate-y-1/2 text-text-muted">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  className={`w-full h-[49px] pl-[41px] pr-[16px] border rounded-[8px] text-[14px] bg-white outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 ${errors.confirmacionPassword ? 'border-danger' : 'border-[rgba(194,198,209,0.4)]'}`}
                  {...register('confirmacionPassword')}
                />
              </div>
              {errors.confirmacionPassword && <p className="text-[12px] text-danger">{errors.confirmacionPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-semibold text-[14px] rounded-[8px] transition-colors"
            >
              {loading ? 'Guardando...' : 'Guardar y continuar'}
            </button>

          </form>
        </div>
      </div>

      <button
        onClick={() => { clearAuth(); navigate('/login') }}
        className="mt-4 text-[13px] text-text-muted hover:text-text-secondary transition-colors"
      >
        Volver al inicio de sesión
      </button>
    </div>
  )
}
