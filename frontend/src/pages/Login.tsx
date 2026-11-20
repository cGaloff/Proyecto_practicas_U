import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { login } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import { Mail, ArrowRight, ShieldCheck, Phone, MapPin, Mail as MailIcon, Globe } from 'lucide-react'

const schema = z.object({
  correo: z.string().email('Ingresa un correo válido'),
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
      const correo = data.correo.trim().toLowerCase()
      const password = correo.split('@')[0]
      const res = await login({ correo, password })
      setAuth(res.data)
      window.location.href = res.data.rol === 'Admin' ? '/admin' : '/docente'
    } catch {
      setError('root', { message: 'Correo no reconocido o sin acceso al sistema.' })
    }
  }

  return (
    <div className="login-split">
      {/* Left panel — classroom photo (image has overlay baked in) */}
      <div className="login-photo">
        <img
          src="/logos/classroom.jpg"
          alt="Prácticas Pedagógicas Investigativas — Facultad de Ciencias de la Educación"
          className="login-photo__img"
        />
      </div>

      {/* Right panel — form */}
      <div className="login-form-panel">
        <div className="login-form-wrapper">
          {/* Logos */}
          <div className="login-logos">
            <img
              src="/logos/pfce-seal.png"
              alt="Facultad de Ciencias de la Educación"
              className="login-logos__seal"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <div className="login-logos__divider" />
            <img
              src="/logos/unimag-crest.png"
              alt="Universidad del Magdalena"
              className="login-logos__crest"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>

          {/* Title */}
          <div className="login-title">
            <h1>Facultad de Ciencias de la Educación</h1>
            <p>Prácticas Pedagógicas · Universidad del Magdalena</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
            <div className="login-field">
              <label className="login-field__label">Correo Institucional</label>
              <div className="login-field__wrap">
                <Mail size={17} className="login-field__icon" />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="usuario@unimagdalena.edu.co"
                  {...register('correo')}
                  className="login-field__input"
                />
              </div>
              {errors.correo && (
                <p className="login-field__error">{errors.correo.message}</p>
              )}
            </div>

            {errors.root && (
              <p className="login-error">{errors.root.message}</p>
            )}

            <button type="submit" disabled={isSubmitting} className="login-btn">
              {isSubmitting ? 'Ingresando…' : (
                <>
                  Ingresar
                  <ArrowRight size={17} className="login-btn__arrow" />
                </>
              )}
            </button>
          </form>

          {/* Security note */}
          <div className="login-security">
            <ShieldCheck size={18} className="login-security__icon" />
            <p>Conexión segura. Cierra tu sesión al finalizar en equipos compartidos.</p>
          </div>

          {/* Contact info */}
          <div className="login-contact">
            <p className="login-contact__title">Información de contacto</p>
            <div className="login-contact__items">
              <span className="login-contact__item">
                <Phone size={14} className="login-contact__ic" />
                Línea Gratuita Nacional: 01 8000 180 504
              </span>
              <span className="login-contact__item">
                <MapPin size={14} className="login-contact__ic" style={{ marginTop: 2 }} />
                <span>
                  Calle 29H3 No. 22-01, Edificio Sierra Nevada Norte, Piso 2<br />
                  Santa Marta - Colombia · PBX: (57-605) 438 1000 Ext. 2202
                </span>
              </span>
              <span className="login-contact__item">
                <MailIcon size={14} className="login-contact__ic" />
                practicasfce@unimagdalena.edu.co
              </span>
              <span className="login-contact__item">
                <Globe size={14} className="login-contact__ic" />
                www.unimagdalena.edu.co
              </span>
            </div>
          </div>

          {/* Copyright */}
          <div className="login-copyright">
            <p>© 2026 Universidad del Magdalena — Facultad de Ciencias de la Educación</p>
            <p>Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    </div>
  )
}
