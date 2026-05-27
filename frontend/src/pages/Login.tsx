import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { login } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Phone, MapPin, Mail as MailIcon } from 'lucide-react'

const schema = z.object({
  correo: z.string().email('Ingresa un correo válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

type FormData = z.infer<typeof schema>

export function Login() {
  const [verPassword, setVerPassword] = useState(false)
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
    <div className="min-h-screen bg-surface-container-low flex flex-col">

      {/* Contenido principal centrado */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">

        {/* Logos institucionales */}
        <div className="flex items-center gap-6 mb-8">
          <img
            src="/logos/pfce.png"
            alt="PFCE"
            className="h-16 w-16 object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <div className="w-px h-12 bg-outline-variant" />
          <img
            src="/logos/unnamed.png"
            alt="Universidad del Magdalena"
            className="h-16 object-contain"
            style={{ maxWidth: '160px' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>

        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-headline-lg text-on-surface font-bold">
            Facultad de Ciencias de la Educación
          </h1>
          <p className="text-body-sm text-on-surface-variant mt-2">
            Prácticas Pedagógicas · Universidad del Magdalena
          </p>
        </div>

        {/* Card del formulario */}
        <div
          className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/40"
          style={{ boxShadow: '0px 4px 12px rgba(0,0,0,0.06)' }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>

            {/* Campo correo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-label-caps text-on-surface-variant uppercase">
                Correo Institucional
              </label>
              <div className="relative group">
                <Mail
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors"
                />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="usuario@unimagdalena.edu.co"
                  {...register('correo')}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none text-body-md text-on-surface"
                />
              </div>
              {errors.correo && (
                <p className="text-xs text-error">{errors.correo.message}</p>
              )}
            </div>

            {/* Campo contraseña */}
            <div className="flex flex-col gap-1.5">
              <label className="text-label-caps text-on-surface-variant uppercase">
                Contraseña
              </label>
              <div className="relative group">
                <Lock
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors"
                />
                <input
                  type={verPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="w-full pl-10 pr-12 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none text-body-md text-on-surface"
                />
                <button
                  type="button"
                  onClick={() => setVerPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  tabIndex={-1}
                >
                  {verPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-error">{errors.password.message}</p>
              )}
            </div>

            {/* Error general */}
            {errors.root && (
              <p className="text-sm text-error bg-error-container/40 px-3 py-2.5 rounded-lg border border-error/20">
                {errors.root.message}
              </p>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 w-full bg-primary text-on-primary py-3 px-6 rounded-lg font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
            >
              {isSubmitting ? 'Ingresando…' : (
                <>
                  Ingresar
                  <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Nota de seguridad */}
          <div className="mt-6 flex items-start gap-3 p-4 bg-surface-container rounded-lg">
            <ShieldCheck size={18} className="text-primary flex-shrink-0 mt-0.5" />
            <p className="text-body-sm text-on-surface-variant">
              Conexión segura. Cierra tu sesión al finalizar en equipos compartidos.
            </p>
          </div>
        </div>
      </main>

      {/* Footer institucional */}
      <footer className="border-t border-outline-variant/30 bg-surface-container py-8 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <p className="text-label-caps text-on-surface-variant uppercase tracking-wider">
            Información de contacto
          </p>
          <div className="flex flex-col items-center gap-2">
            <span className="flex items-center gap-2 text-body-sm text-on-surface-variant">
              <Phone size={14} className="text-outline flex-shrink-0" />
              Línea Gratuita Nacional: 01 8000 180 504
            </span>
            <span className="flex items-center gap-2 text-body-sm text-on-surface-variant">
              <MapPin size={14} className="text-outline flex-shrink-0 mt-0.5" />
              <span>
                Calle 29H3 No. 22-01, Edificio Sierra Nevada Norte, Piso 2<br />
                Santa Marta - Colombia &nbsp;·&nbsp; PBX: (57-605) 438 1000 Ext. 2202
              </span>
            </span>
            <span className="flex items-center gap-2 text-body-sm text-on-surface-variant">
              <MailIcon size={14} className="text-outline flex-shrink-0" />
              practicasfce@unimagdalena.edu.co
            </span>
            <span className="flex items-center gap-2 text-body-sm text-on-surface-variant">
              <MailIcon size={14} className="text-outline flex-shrink-0 opacity-0" />
              www.unimagdalena.edu.co
            </span>
          </div>
          <div className="border-t border-outline-variant/30 pt-3 mt-2">
            <p className="text-label-caps text-outline">
              © 2026 Universidad del Magdalena — Facultad de Ciencias de la Educación
            </p>
            <p className="text-label-caps text-outline mt-0.5">
              Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
