import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { login } from '../api/auth'
import { useAuthStore } from '../store/authStore'

const schema = z.object({
  correo: z.string().email('Ingresa un correo válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

type FormData = z.infer<typeof schema>

export function Login() {
  const setAuth = useAuthStore((s) => s.setAuth)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await login(data)
      setAuth(res.data)
      window.location.href = res.data.rol === 'Admin' ? '/admin' : '/docente'
    } catch {
      setError('root', { message: 'Correo o contraseña incorrectos.' })
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-headline-lg text-on-surface">Portal Académico</h1>
          <p className="text-body-sm text-on-surface-variant mt-1">Prácticas Pedagógicas · UniMag</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 shadow-sm">
          <h2 className="text-headline-md text-on-surface mb-6">Iniciar sesión</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label className="text-label-caps text-on-surface-variant uppercase">Correo institucional</label>
              <input
                type="email"
                autoComplete="email"
                {...register('correo')}
                className="h-11 px-3 rounded-lg border border-outline-variant bg-surface text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
              {errors.correo && <p className="text-xs text-error">{errors.correo.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-label-caps text-on-surface-variant uppercase">Contraseña</label>
              <input
                type="password"
                autoComplete="current-password"
                {...register('password')}
                className="h-11 px-3 rounded-lg border border-outline-variant bg-surface text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
              {errors.password && <p className="text-xs text-error">{errors.password.message}</p>}
            </div>

            {errors.root && (
              <p className="text-sm text-error bg-error/10 px-3 py-2 rounded-lg">{errors.root.message}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 h-11 bg-primary text-on-primary font-semibold rounded-lg hover:bg-primary-container transition disabled:opacity-60"
            >
              {isSubmitting ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
