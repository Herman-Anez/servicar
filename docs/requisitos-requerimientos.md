# Requisitos Funcionales — Servicar

Documento de referencia para validar que el núcleo (`@servicar/core`) cumpla las reglas de negocio antes de conectar la infraestructura real (PocketBase).

Fuentes: `docs/global-vision.md` · `packages/core/src/` · `docs/vitacora.md`

---

## RF-01 — Gestión de Tickets con trazabilidad completa

> Todo ticket debe poder ser creado, revisado, aprobado/rechazado y finalizado, con un registro inmutable de cada acción.

### Reglas de negocio

| ID | Regla |
|----|-------|
| R1.1 | Todo ticket requiere `matricula` no vacía (identifica el autobús). |
| R1.2 | Todo ticket requiere `titulo` y `descripcion` no vacíos. |
| R1.3 | Estado inicial siempre `pendiente_revision`. No entra al listado global. |
| R1.4 | La máquina de estados es la única transición válida (ver diagrama). |
| R1.5 | `requiere_cambios` exige `notaAdmin` no vacía. |
| R1.6 | Cada mutación (crear, editar, cambiar estado) genera una `HistorialEntry` inmutable. |
| R1.7 | El historial no puede ser alterado ni eliminado. |

### Máquina de estados

```
pendiente_revision → aprobado | requiere_cambios
requiere_cambios   → pendiente_revision
aprobado           → en_progreso
en_progreso        → urgente | bloqueado | finalizado
urgente            → en_progreso | finalizado
bloqueado          → en_progreso
finalizado         → (terminal)
```

### Estado en `@servicar/core`

| Elemento | Archivo | Estado |
|---|---|---|
| `Ticket.create()` — valida matrícula, título, descripción; estado inicial `pendiente_revision` | `ticket/domain/entities/ticket.entity.ts:L32` | ✅ Implementado |
| `Ticket.cambiarEstado()` — valida transición con `isTransicionValida`, exige nota en `requiere_cambios` | `ticket/domain/entities/ticket.entity.ts:L57` | ✅ Implementado |
| `Ticket.editar()` — valida matrícula no vacía si se cambia | `ticket/domain/entities/ticket.entity.ts:L78` | ✅ Implementado |
| `HistorialEntry` — inmutable, solo `create()` y `reconstitute()` | `ticket/domain/entities/historial-entry.entity.ts` | ✅ Implementado |
| AR pattern: `MockTicketRepository.save()` drena `pendingHistorial` atómicamente | `ticket/infrastructure/persistence/mock/mock-ticket.repository.ts` | ✅ Implementado |
| `CrearTicketUseCase` (6 tests) | `__tests__/crear-ticket.use-case.test.ts` | ✅ Testeado |
| `CambiarEstadoUseCase` (7 tests, flujo completo) | `__tests__/cambiar-estado.use-case.test.ts` | ✅ Testeado |
| `EditarTicketUseCase` | `__tests__/` | ⚠️ Sin test propio |

### Gaps

- `EditarTicketUseCase` no tiene archivo de test dedicado. Los 4 tests de edición están en `ticket.entity.test.ts` (nivel entidad, no use case).

---

## RF-02 — Control de acceso por rol

> Mecánico edita solo sus propios tickets. Admin edita todos. Cada acción registra al responsable.

### Reglas de negocio

| ID | Regla |
|----|-------|
| R2.1 | Login obligatorio para mecánico y admin. |
| R2.2 | Mecánico puede editar (`editar()`) solo tickets donde `creadorId === su empleadoId`. |
| R2.3 | Admin puede editar cualquier ticket y cambiar cualquier estado. |
| R2.4 | Solo admin puede ejecutar `cambiarEstado()` (excepción: mecánico puede volver a `pendiente_revision` desde `requiere_cambios`). |
| R2.5 | Toda mutación recibe `empleadoId` — el historial lo registra. |

### Estado en `@servicar/core`

| Elemento | Archivo | Estado |
|---|---|---|
| `Rol` type (`mecanico` \| `admin`) | `shared/domain/rol.ts` | ✅ Definido |
| `Sesion` VO — lleva `{ empleadoId, rol }` | `auth/domain/entities/sesion.entity.ts` | ✅ Implementado |
| `AutenticarUseCase` — devuelve `Sesion \| null` | `auth/application/use-cases/autenticar.use-case.ts` | ✅ Implementado |
| **R2.2: `EditarTicketUseCase` verifica `creadorId === empleadoId` para mecánicos** | `ticket/application/use-cases/editar-ticket.use-case.ts` | ❌ **NO implementado** |
| **R2.3/R2.4: `CambiarEstadoUseCase` verifica `rol === admin`** | `ticket/application/use-cases/cambiar-estado.use-case.ts` | ❌ **NO implementado** |
| Tests de autorización en capa de aplicación | `__tests__/` | ❌ **No existen** |

### Gaps críticos

**La regla de autorización vive solo en el ViewModel (presentación), no en la capa de aplicación.** Si el use case se llama directamente (API, otro cliente, test de integración), cualquier empleado puede editar cualquier ticket.

Para corregir, `EditarTicketDTO` y `CambiarEstadoDTO` deben recibir el `rol` del empleado, y los use cases deben aplicar la regla antes de ejecutar la mutación.

---

## RF-03 — Portal público de consulta

> El cliente puede ver el estado de un ticket por ID exacto, sin autenticarse, sin acceso a listados.

### Reglas de negocio

| ID | Regla |
|----|-------|
| R3.1 | Acceso por ID exacto únicamente — sin listados públicos. |
| R3.2 | No requiere autenticación. |
| R3.3 | Vista de solo lectura: estado, matrícula, categoría, fecha creación, última modificación. |
| R3.4 | Si el ID no existe, mostrar error genérico (no revelar que el ticket no existe). |

### Estado en `@servicar/core`

| Elemento | Archivo | Estado |
|---|---|---|
| `GetTicketByIdQuery` — busca ticket por ID | `ticket/application/use-cases/get-ticket-by-id.query.ts` | ✅ Implementado |
| Ruta pública `/ticket/[id]/page.tsx` | `next/src/app/ticket/[id]/` | ❌ **No existe** |

### Gaps

- El query de core existe. Solo falta la ruta Next.js pública y su View + ViewModel.

---

## Resumen de cumplimiento

| Requisito | Core | Infraestructura | UI |
|---|---|---|---|
| RF-01 Tickets + historial | ✅ 95% (falta test EditarUC) | ✅ Mock, ✅ PB repos | ✅ |
| RF-02 Control de acceso | ⚠️ 60% (**sin enforcement en app layer**) | N/A | ✅ (solo en VM) |
| RF-03 Portal cliente | ✅ Query listo | N/A | ❌ Ruta no existe |

---

## Plan de acción

### Fase 1 — Cerrar gaps del núcleo (antes de conectar PB)

**1.1 — Enforcement de autorización en `EditarTicketUseCase`**

Agregar `rol: Rol` a `EditarTicketDTO`. El use case verifica:
```typescript
if (dto.rol === "mecanico" && ticket.creadorId !== dto.empleadoId) {
  throw new Error("Mecánico solo puede editar sus propios tickets.");
}
```
Archivo: `packages/core/src/modules/ticket/application/use-cases/editar-ticket.use-case.ts`
Test: `packages/core/src/__tests__/editar-ticket.use-case.test.ts`

**1.2 — Enforcement de autorización en `CambiarEstadoUseCase`**

Agregar `rol: Rol` a `CambiarEstadoDTO`. El use case verifica:
```typescript
const transicionesPermitidas: TicketEstado[] = dto.rol === "admin"
  ? TICKET_ESTADO_TRANSITIONS[ticket.estado]
  : ["pendiente_revision"]; // mecánico solo puede reenviar a revisión

if (!transicionesPermitidas.includes(dto.nuevoEstado)) {
  throw new Error("No autorizado para esta transición.");
}
```
Archivo: `packages/core/src/modules/ticket/application/use-cases/cambiar-estado.use-case.ts`
Test: agregar casos a `__tests__/cambiar-estado.use-case.test.ts`

**1.3 — Test dedicado para `EditarTicketUseCase`**

Archivo nuevo: `packages/core/src/__tests__/editar-ticket.use-case.test.ts`
Casos mínimos:
- Mecánico edita su propio ticket → OK
- Mecánico intenta editar ticket ajeno → lanza
- Admin edita cualquier ticket → OK
- Matrícula vacía en edición → lanza (dominio)
- Ticket no encontrado → lanza

### Fase 2 — Portal cliente RF-03

**2.1 — Ruta pública Next.js**

Crear `next/src/app/ticket/[id]/page.tsx` (thin shell sin auth guard).

ViewModel: `usePublicoTicket.view-model.ts` — llama `ticketModule.getTicketById.execute(id)`, sin `authSession.getSession()`.

View: `PublicoTicketView.tsx` — muestra `estado`, `matricula`, `categoria`, `creationTime`, `fechaUltimaModificacion`. Sin historial, sin acciones.

Error: si `ticket === null` → mensaje genérico "Ticket no encontrado."

**2.2 — Registrar ruta en `once-ui.config.ts`**

Agregar `"/ticket/[id]": false` (ruta pública, sin RouteGuard).

### Fase 3 — Conectar PocketBase

Solo después de Fase 1 y Fase 2 validadas con mock.

1. Cambiar `NEXT_PUBLIC_USE_MOCK=false` en `.env.local`
2. Verificar que `ticket-module.ts` y `empleado-module.ts` usen repos PB (ya condicional)
3. Descomentar `PbSessionService` en `auth/index.ts` (ya condicional)
4. Smoke test: login → crear ticket → aprobar → ver portal cliente

### Orden de ejecución

```
[Fase 1.1] EditarTicketUseCase + rol check
[Fase 1.2] CambiarEstadoUseCase + rol check     ← paralelo con 1.1
[Fase 1.3] Tests EditarTicketUseCase            ← después de 1.1
[Fase 2.1] Ruta /ticket/[id] pública
[Fase 2.2] RouteGuard config
[Fase 3]   Activar PocketBase + smoke test
```

Estimado: Fase 1 (~1h) · Fase 2 (~45min) · Fase 3 (~30min smoke test)
