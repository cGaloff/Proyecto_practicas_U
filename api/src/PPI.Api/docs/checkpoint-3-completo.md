# Checkpoint 3 — Verificación completa del backend

Fecha: 2026-05-19
Commit base: c2764e0 (Merge PR #1 — feat: add admin download endpoints)
Rama: feature/f15-checkpoint3

## Resultados

| V | Descripción | Resultado |
|---|---|---|
| V01 | Docker — ppi_api y ppi_db en estado running/healthy | PASS |
| V02 | Swagger UI carga en http://localhost:5000/swagger | PASS |
| V03 | Datos en BD correctos (programas=11, docentes=87, grupos=96, informes=11, entradas=96, admins=1) | PASS |
| V04 | Login docente contraseña inicial → HTTP 200, rol: Docente, primerLogin: true | PASS |
| V05 | Login contraseña incorrecta → HTTP 401 | PASS |
| V06 | Login admin → HTTP 200, rol: Admin | PASS |
| V07 | Sin token → HTTP 401 | PASS |
| V08 | Docente no accede a admin → HTTP 403 | PASS |
| V09 | Admin no accede a docente → HTTP 403 | PASS |
| V10 | GET /api/docente/grupos → 2 grupos Práctica II, 13 matriculados c/u | PASS |
| V11 | Guardar borrador con sección 2B suma correcta → HTTP 200, estado Borrador | PASS |
| V12 | Enviar entrada → HTTP 200 | PASS |
| V13 | Editar entrada ya enviada → HTTP 409 | PASS |
| V14 | Grupos independientes — G1 Enviado, G2 Enviado (independiente) | PASS |
| V15 | Cross-ownership → HTTP 403 | PASS |
| V16 | Descarga docente individual → HTTP 200, 5.9 MB, 0 marcadores sin reemplazar | PASS |
| V17 | GET /api/admin/programas → 11 programas con estado y progreso | PASS |
| V18 | GET /api/admin/programas/{id}/entradas → lista con estado de cada entrada | PASS |
| V19 | GET /api/admin/docentes/{id}/entradas → DocenteConEntradasDto con 2 grupos | PASS |
| V20 | PUT /api/admin/informes/{id}/estado → EnRevision → HTTP 200 | PASS |
| V21 | PUT estado=Devuelto sin observación → HTTP 400 mensaje obligatorio | PASS |
| V22 | PUT estado=Devuelto con observación → HTTP 200 | PASS |
| V23 | Entradas en BD con estado=Devuelto y observacion_admin propagada | PASS |
| V24 | GET /api/docente/grupos → observacionAdmin visible en la respuesta | PASS |
| V25 | GET /api/admin/informes/{id}/auditoria → 2 entradas (EnRevision, Devuelto) | PASS |
| V26 | Admin descarga entrada enviada → HTTP 200, .docx correcto | PASS |
| V27 | Admin descarga entrada no enviada → HTTP 409 | PASS |
| V28 | Consolidado con entradas pendientes → HTTP 409 "2 de 12 enviadas" | PASS |
| V29 | Consolidado completo → HTTP 200, 5.9 MB .docx descargado | PASS |
| V30 | Verificación visual: 11 tablas, 0 marcadores {{}}, 2 docentes presentes, Dairon presente | PASS |

## Resultado final

**30/30 verificaciones pasadas.**

## Endpoints implementados en esta rama

Los siguientes endpoints fueron agregados durante la ejecución del checkpoint
(faltaban del plan original):

- `GET /api/admin/docentes/{id}/entradas` — lista grupos+entradas de un docente
- `PUT /api/admin/informes/{id}/estado` — cambia estado con auditoría y propagación
- `GET /api/admin/informes/{id}/auditoria` — historial de cambios de estado

## Notas

- El informe LIC-INFO fue utilizado como programa de prueba para V20-V25 y V29
  por tener solo 2 entradas (mínimo), facilitando el control del estado.
- Las entradas de LIC-INFO quedaron en estado Devuelto tras V22; el informe
  fue restaurado a ListoParaRevision para ejecutar V29.
- El sistema de auditoría registra correctamente cada transición de estado
  con adminId, timestamps y observación opcional.
- La propagación de estado Devuelto a entradas individuales funciona correctamente
  y la observación del admin es visible por los docentes en GET /api/docente/grupos.
