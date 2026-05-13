# Checkpoint 2 — Verificación de autenticación

Fecha: 2026-05-13
Commit base: bd14af4 (feat(auth): add AuthController with login and change-password)
Rama: develop

## Resultados

| Verificación | Descripción | Resultado |
|---|---|---|
| V1 | Login docente real | ✓ |
| V2 | Login docente con 2 grupos | ✓ |
| V3 | Login contraseña incorrecta | ✓ |
| V4 | Login correo inexistente | ✓ |
| V5 | Endpoint protegido sin token | ✓ |
| V6 | Cambio de contraseña completo | ✓ |
| V7 | Rechazo de misma contraseña | ✓ |
| V8 | JWT sin datos sensibles | ✓ |
| V9 | Logout con y sin token | ✓ |

## Notas

- V3 y V4 retornan exactamente el mismo mensaje ("Credenciales incorrectas.")
  y el mismo código HTTP 401, evitando enumeración de usuarios.
- `PasswordActual` en `ChangePasswordRequest` usa `MinLength(1)` en lugar de 8
  porque las contraseñas iniciales del seed (parte antes del @) pueden tener
  menos de 8 caracteres (ej. "eerojas" = 7 chars). `PasswordNuevo` mantiene
  `MinLength(8)` como mínimo de seguridad.
- Payload JWT verificado: contiene `sub` (UUID), `email`, `role`, `primer_login`,
  `jti` y `exp`. No contiene `password`, `password_hash` ni ningún dato sensible.
- `primer_login` se actualiza correctamente a `false` en BD tras el primer cambio
  de contraseña exitoso (verificado con query directa a PostgreSQL).
- Seed idempotente confirmado: al reiniciar el volumen de PostgreSQL, el seed
  se vuelve a aplicar correctamente desde cero.
