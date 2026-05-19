# Release v1.0.0 — Backend PPI Unimagdalena

**Fecha:** 2026-05-19
**Semestre:** 2026-I

## ¿Qué incluye este release?

### Infraestructura
- Docker Compose con 4 servicios: PostgreSQL 16, ASP.NET Core 8,
  nginx y frontend (placeholder)
- Migraciones automáticas al arrancar el contenedor
- Seed inicial con datos reales del semestre 2026-I

### Base de datos
- 11 programas de la Facultad de Ciencias de la Educación
- 87 docentes con autenticación bcrypt
- 96 grupos asignados
- 11 informes (uno por programa)
- 96 entradas en estado inicial SinIniciar

### Autenticación
- JWT con roles Docente y Admin
- Contraseña inicial = parte antes del @ del correo
- Cambio de contraseña obligatorio en primer acceso
- Cuenta admin: adminpracticas@unimagdalena.edu.co

### API Docente
- GET  /api/docente/grupos
- GET  /api/docente/entradas/{id}
- PUT  /api/docente/entradas/{id}
- POST /api/docente/entradas/{id}/enviar
- GET  /api/docente/entradas/{id}/descargar

### API Admin
- GET /api/admin/programas
- GET /api/admin/programas/{id}/entradas
- GET /api/admin/programas/{id}/consolidado
- GET /api/admin/docentes/{id}/entradas
- PUT /api/admin/informes/{id}/estado
- GET /api/admin/informes/{id}/auditoria
- GET /api/admin/entradas/{id}/descargar

### Generación de documentos Word
- Plantilla institucional con diseño original preservado
- Generación dinámica de filas por grupo/docente
- Descarga individual por docente
- Descarga individual por admin
- Descarga consolidada por programa

### Verificación
- Checkpoint 1: infraestructura y datos ✓
- Checkpoint 2: autenticación 9/9 ✓
- Checkpoint 3: backend completo 30/30 ✓

## Pendiente (v2.0)
- Frontend React + TypeScript
- Conversión a PDF
- Rate limiting en endpoints de auth
- Tests de integración automatizados
