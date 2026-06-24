# Contexto del Proyecto — Servicar

Documento de orientación para agentes. Lee esto antes de tocar cualquier archivo.

---

## Qué es el proyecto

**Servicar** — sistema de gestión de taller de autobuses. Centraliza operaciones (incidencias, reparaciones, reclamos) a través de una entidad unificada: el **Ticket**.

**Tres roles:**
- **Mecánico** — móvil, crea y edita sus propios tickets
- **Administrador** — desktop, aprueba / rechaza / reasigna cualquier ticket
- **Cliente** — portal público read-only, busca ticket por ID (sin auth)

**Stack de producción:** Next.js 15 + PocketBase (BaaS self-hosted) + Vercel. **Hoy:** Next.js conectado a PocketBase real (`192.168.0.222:8090`). Mock disponible via `NEXT_PUBLIC_USE_MOCK=true`.

---

## Repositorio

```
servicar/                           ← workspace root (pnpm workspaces)
├── pnpm-workspace.yaml             ← packages: ["packages/*", "next"]
├── package.json
├── docs/               ← documentación del proyecto
│   ├── context.md              ← este archivo
│   ├── arquitectura-modulos.md ← detalle técnico DDD+Hexagonal+MVVM-C
│   ├── estetica.md             ← design system tokens y patrones visuales
│   ├── vitacora.md             ← log cronológico de decisiones y cambios
│   ├── global-vision.md        ← reglas de negocio y glosario
│   └── ddd-hexagonal-refactor.md ← propuesta original de estructura
├── packages/
│   └── core/                   ← @servicar/core — dominio + aplicación + infraestructura (framework-agnostic)
│       ├── package.json        ← deps: pocketbase ^0.21
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts        ← barrel: exporta todo (dominio, aplicación, infraestructura mock + PB)
│           └── modules/
│               ├── shared/
│               │   ├── domain/         ← AggregateRoot, Rol, TicketEstado, TicketCategoria
│               │   └── infrastructure/
│               │       ├── mock/       ← data.ts, store.ts (MockStore)
│               │       └── pocketbase/ ← pb-client.ts, pb-store.ts
│               ├── auth/               ← Bounded Context: Auth
│               │   ├── domain/         ← Sesion VO, IAuthProvider
│               │   ├── application/    ← AutenticarUseCase, IAutenticarUseCase, AutenticarDTO
│               │   └── infrastructure/
│               │       ├── mock/       ← MockAuthProvider
│               │       └── pocketbase/ ← PbAuthProvider
│               ├── ticket/
│               │   ├── domain/ + application/
│               │   └── infrastructure/persistence/{mock,pocketbase}/
│               └── empleado/
│                   ├── domain/ + application/
│                   └── infrastructure/persistence/{mock,pocketbase}/
├── react-prototipo/    ← prototipo UI (no tocar, solo referencia)
└── next/               ← app de producción (aquí se trabaja)
    └── package.json    ← { "name": "@servicar/next", deps: "@servicar/core workspace:*", "pocketbase" }
```

**Working directory activo:** `/workspaces/1/servicar/next`

**Resolución de aliases** (`next/tsconfig.json`):
- `@servicar/core` → `../packages/core/src/index.ts`
- `@servicar/persistence-mock` → `../packages/core/src/index.ts` (alias de compatibilidad)
- `@servicar/persistence-pocketbase` → `../packages/core/src/index.ts` (alias de compatibilidad)

Los tres apuntan al mismo barrel. TypeScript resuelve sin build steps. Los tres nombres son intercambiables — preferir `@servicar/core` en código nuevo.

---

## Estado actual de la app

La UI está funcional con mock. El usuario puede:
- Iniciar sesión como mecánico o admin
- Mecánico: crear tickets, editarlos, verlos por estado en taller/fichas
- Admin: ver cola de pendientes, aprobar/rechazar con nota, ver kanban global, ver historial detallado de cualquier ticket

**Rutas activas:**
```
/                         → home con animación PS2, botón a /login
/login                    → formulario + acceso rápido dev (3 usuarios seed)
/dashboard                → panel mecánico (KPIs + actividad reciente)
/taller                   → lista de tickets con filtros
/fichas                   → tickets que requieren acción del mecánico
/ticket/nuevo             → formulario nuevo ticket (auth requerida, mecánico)
/ticket/[id]              → portal público read-only — sin auth, acceso por ID exacto
/ticket/[id]/editar       → editar ticket existente (auth requerida, mecánico o admin)
/admin/cola               → bandeja de triage (pendiente_revision)
/admin/tickets            → kanban global (activos / bloqueados / finalizados)
/admin/historial/[id]     → detalle + timeline de auditoría de un ticket
```

**Estados del ticket (máquina de estados):**
```
pendiente_revision → aprobado | requiere_cambios
requiere_cambios   → pendiente_revision
aprobado           → en_progreso
en_progreso        → urgente | bloqueado | finalizado
urgente            → en_progreso | finalizado
bloqueado          → en_progreso
finalizado         → (terminal)
```

---

## Arquitectura — MVVM-C + DDD + Hexagonal (completado)

La migración arquitectónica está completa. Un solo camino activo:

```
page.tsx (thin shell)
  → Coordinator (IAdminCoordinator / IMecanicoCoordinator)
  → ViewModel hook (useEffect + useState + refreshKey)
      → ticketModule / empleadoModule / authModule (service locators en next/src/modules/)
      → use cases / queries  ← @servicar/core (application layer, async)
      → ITicketRepository    ← @servicar/core (port, métodos retornan Promise<>)
      → MockTicketRepository ← @servicar/core (Promise.resolve)
      → MockStore            ← @servicar/core (shared/infrastructure/mock/store.ts)
```

**`@servicar/core`** (`packages/core/`) — dominio + aplicación + infraestructura (mock y PocketBase). Todo en un solo package. Cero dependencias de React, Next.js, o browser APIs.

**`next/src/modules/`** — solo service locators (`ticket-module.ts`, `empleado-module.ts`, `auth-module.ts`). Importan de `@servicar/core`. Para migrar a PocketBase: cambiar el flag `NEXT_PUBLIC_USE_MOCK=false` — los service locators ya tienen la lógica condicional.

**`next/src/presentation/`** contiene coordinators, ViewModels y Views. Views son JSX puro (solo props). ViewModels son hooks de React que usan los módulos. Thin shells (`page.tsx`) ensamblan todo.

---

## Estructura de next/src/

```
src/
├── app/                          ← Next.js App Router (thin shells)
│   ├── page.tsx                  ← home (animación PS2)
│   ├── login/page.tsx
│   ├── not-found.tsx
│   ├── layout.tsx                ← root layout (Once UI providers)
│   ├── admin/
│   │   ├── layout.tsx            ← thin shell → AdminLayoutView
│   │   ├── page.tsx              ← redirect a /admin/cola
│   │   ├── cola/page.tsx         ← thin shell → ColaView
│   │   ├── tickets/page.tsx      ← thin shell → TicketsView
│   │   └── historial/[id]/page.tsx ← thin shell → HistorialView
│   ├── (mecanico)/               ← route group mecánico
│   │   ├── layout.tsx            ← thin shell → MecanicoLayoutView
│   │   ├── dashboard/page.tsx    ← thin shell → DashboardView
│   │   ├── taller/page.tsx       ← thin shell → TallerView
│   │   └── fichas/page.tsx       ← thin shell → FichasView
│   └── ticket/
│       ├── nuevo/page.tsx        ← thin shell → NuevoTicketView
│       ├── [id]/page.tsx         ← portal público (sin auth, sin coordinador) → PublicoTicketView
│       └── [id]/editar/page.tsx  ← thin shell → EditarTicketView
│
├── lib/
│   ├── db.ts                     ← fachada legacy (re-exporta desde @servicar/persistence-mock y @servicar/core). No usar en código nuevo.
│   ├── auth/
│   │   ├── session.port.ts       ← IAuthSessionService + SessionPayload (puerto de sesión)
│   │   ├── mock-session.service.ts ← MockSessionService implements IAuthSessionService (localStorage)
│   │   ├── pb-session.service.ts ← PbSessionService implements IAuthSessionService (pb.authStore)
│   │   └── index.ts              ← authSession singleton (hoy = MockSessionService, swap = 2 líneas)
│   └── mock/
│       └── hooks.ts              ← React hooks sobre MockStore (único "use client" fuera de app/)
│
├── modules/                      ← SOLO service locators
│   ├── auth/infrastructure/
│   │   └── auth-module.ts        ← AutenticarUseCase + MockAuthProvider | PbAuthProvider
│   ├── ticket/infrastructure/
│   │   └── ticket-module.ts      ← importa use cases + repos de @servicar/core
│   └── empleado/infrastructure/
│       └── empleado-module.ts    ← importa queries + repo de @servicar/core
│
├── presentation/                 ← MVVM-C (cross-cutting)
│   ├── coordinators/
│   │   ├── interfaces/           ← IRouter, IAdminCoordinator, IMecanicoCoordinator
│   │   ├── admin.coordinator.ts
│   │   ├── mecanico.coordinator.ts
│   │   └── index.ts
│   ├── view-models/
│   │   ├── admin/                ← useAdminLayout.view-model.ts, useCola.view-model.ts, useTickets.view-model.ts, useHistorial.view-model.ts
│   │   ├── mecanico/             ← useMecanicoLayout.view-model.ts, useDashboard.view-model.ts, useTaller.view-model.ts, useFichas.view-model.ts
│   │   └── ticket/               ← useNuevoTicket.view-model.ts, useEditarTicket.view-model.ts, usePublicoTicket.view-model.ts
│   ├── views/
│   │   ├── admin/                ← AdminLayoutView, ColaView, TicketsView, HistorialView (Once UI)
│   │   ├── mecanico/             ← MecanicoLayoutView, DashboardView, TallerView, FichasView
│   │   ├── ticket/               ← NuevoTicketView, EditarTicketView, PublicoTicketView
│   │   └── shared/               ← EstadoChip, TicketCard, ViewHeader, AlertBanner, FabButton, KpiCard, index.ts
│   └── hooks/
│       └── useStoreReactive.ts   ← useReducer + mockStore.subscribe para reactivity
│
├── components/                   ← Once UI shell (RouteGuard, Providers, Header, Footer, ThemeToggle)
├── resources/
│   ├── custom.css                ← tokens --sp-* + clases .sp-*
│   ├── icons.ts                  ← iconLibrary para Once UI (react-icons)
│   ├── once-ui.config.ts         ← tema, rutas, fuentes
│   ├── content.tsx               ← metadatos del sitio (remanente template Once UI)
│   └── index.ts                  ← barrel resources
├── types/                        ← tipos del template Once UI (config.types, content.types)
└── utils/                        ← helpers del template (formatDate, utils)
```

---

## Design System

**Modern Pulse** — light mode, paleta roja sobre fondo cálido.

Token principal: `--sp-primary: #bc0100`. Fondo: `--sp-background: #fff8f7`.

**Reglas visuales críticas:**
- Admin views: Once UI components (`Column`, `Row`, `Text`, `Heading`, `Icon`, `IconButton`, `Avatar`, `Tag`).
- En páginas mecánico: también Once UI components.
- Nunca hex hardcodeado — `var(--sp-*)` o tokens Once UI.
- `SpacingToken` Once UI — solo valores: `"0"|"1"|"2"|"4"|"8"|"12"|"16"|"20"|"24"|"32"|"40"|"48"|"56"|"64"|"80"|"104"|"128"|"160"`. Sin valores arbitrarios.
- Responsive admin: bloques `<style>` con clases CSS + media queries (no Tailwind, no inline breakpoints).

**Logo:**
- `public/servicar-logo.svg` — principal (rojo sobre transparente). Fondos claros.
- `public/servicar-logo-blanco.svg` — invertido. Solo en home (fondo rojo `#ff0000`).

Tamaños: login 260×102px, admin sidebar 180×71px, mecánico topbar 100×39px, home 340×133px.

---

## Datos seed (dev)

Tres usuarios accesibles desde el panel de acceso rápido en `/login`:

| Nombre | Rol | Email |
|---|---|---|
| Juan Pérez | mecanico | juan.perez@servicar.com |
| M. Rodriguez | mecanico | m.rodriguez@servicar.com |
| Admin Taller | admin | admin@servicar.com |

El panel de acceso rápido llama `signIn(emp.email, "")` — `MockAuthProvider` ignora el password en dev.

7 tickets seed que cubren todos los estados. Persisten en localStorage entre recargas.

---

## Patrones de código a respetar

### Imports

```typescript
// ✅ Tipos y lógica de dominio/aplicación/infraestructura — siempre desde @servicar/core
import type { Ticket, TicketEstado, Empleado, Sesion } from "@servicar/core";
import type { ICrearTicketUseCase, IGetTicketsQuery, IAutenticarUseCase } from "@servicar/core";
import { CrearTicketUseCase, GetTicketsQuery, MockAuthProvider } from "@servicar/core";
import type { MockTicket, MockEmpleado } from "@servicar/core";
import { mockStore, MockTicketRepository } from "@servicar/core";

// ✅ Service locators — desde modules de next
import { ticketModule }   from "@/modules/ticket/infrastructure/ticket-module";
import { empleadoModule } from "@/modules/empleado/infrastructure/empleado-module";
import { authModule }     from "@/modules/auth/infrastructure/auth-module";

// ✅ Coordinators — interfaces en ViewModels, clases concretas en thin shells
import type { IAdminCoordinator }    from "@/presentation/coordinators";
import { AdminCoordinator }          from "@/presentation/coordinators";

// ❌ Nunca en pages o ViewModels
import { useTickets } from "@/lib/db";   // lib/db obsoleto, no usar en código nuevo
```

### Regla de dependencia

```
@servicar/core            — TypeScript puro, cero browser/React
  └── shared/domain
      ← auth/domain + application + infrastructure
      ← ticket/domain + application + infrastructure
      ← empleado/domain + application + infrastructure

next/src/
  └── modules/*/infrastructure/   ← service locators: instancian desde @servicar/core
  └── lib/mock/hooks.ts           ← único punto de React sobre MockStore
  └── presentation/coordinators/  ← solo IRouter + interfaces propias
  └── presentation/view-models/   ← importa modules + coordinators
  └── presentation/views/         ← solo props (JSX puro)
  └── app/*/page.tsx              ← thin shell: Coordinator + ViewModel + View
```

`@servicar/core` nunca importa React. Si tiene `"use client"` o `import { useState }`, es un error.

### Auth — dos capas independientes

**Capa 1 — Verificación de credenciales** (`auth-module.ts` + `IAuthProvider`):
- `authModule.autenticar.execute({ email, password })` → `Sesion | null`
- `Sesion` es un value object: `{ empleadoId: string, rol: Rol }` — no tiene repositorio
- En mock: `MockAuthProvider` busca por email en MockStore, ignora password
- En PocketBase: `PbAuthProvider` llama `pb.collection("users").authWithPassword()`

**Capa 2 — Sesión de browser** (`IAuthSessionService` en `next/src/lib/auth/`):
- Guarda/lee `{ empleadoId }` en localStorage (mock) o en `pb.authStore` (PocketBase)
- Los ViewModels usan `authSession` para saber si hay sesión activa

```typescript
import { authSession } from "@/lib/auth";
import { authModule } from "@/modules/auth/infrastructure/auth-module";

// Login:
const sesion = await authModule.autenticar.execute({ email, password });
if (sesion) authSession.setSession({ empleadoId: sesion.empleadoId });

// Verificar sesión en ViewModel:
const session = authSession.getSession();  // SessionPayload | null
authSession.clearSession();                // logout
```

Para cambiar de mock a PocketBase: descomentar 3 líneas en `auth/index.ts` (sesión en pb.authStore):
```typescript
// import { getPocketBase } from "@servicar/core";
// import { PbSessionService } from "./pb-session.service";
// export const authSession: IAuthSessionService = new PbSessionService(getPocketBase());
export const authSession: IAuthSessionService = new MockSessionService();
```

El `auth-module.ts` ya usa `PbAuthProvider` cuando `NEXT_PUBLIC_USE_MOCK=false` — sin cambios adicionales.

`SessionPayload = { empleadoId: string }` — la sesión solo guarda el ID. El `Empleado` completo se resuelve en el ViewModel con `empleadoModule.getEmpleadoById.execute(session.empleadoId)`.

---

### MockStore — reactividad

`useStoreReactive()` en `presentation/hooks/useStoreReactive.ts` suscribe al `mockStore` y devuelve un `number` (`refreshKey`) que incrementa en cada `notify()`. Los ViewModels usan ese `refreshKey` como dependencia de `useEffect` para re-fetch async cuando el store cambia:

```typescript
const refreshKey = useStoreReactive();
const [tickets, setTickets] = useState<Ticket[]>([]);
useEffect(() => {
  ticketModule.getTickets.execute().then(setTickets);
}, [refreshKey]);
```

Toda mutación termina con `mockStore.notify()`. Si el store cambia pero la UI no actualiza, revisar: (1) que `notify()` se llame, (2) que `refreshKey` esté en el array de dependencias del `useEffect`.

### Z-index reference

```
admin sidebar:   z-index 50
admin overlay:   z-index 49
admin topbar:    z-index 40
mecánico dropdown: z-index 10
mecánico overlay:  z-index 5   ← DEBE ser < 10
```

---

## Lo que está pendiente (en orden)

### Funcionalidades sin implementar
- Módulo offline/drafts (postergado intencionalmente)

### Tests

```bash
pnpm --filter @servicar/core test   # 85 tests — entidades, use cases, auth, store, repos
```

Todo en `@servicar/core`. Desglose:
- `__tests__/` — entidades (14), crear-ticket (6), cambiar-estado (10), editar-ticket (6)
- `__tests__/auth/` — `autenticar.use-case.test.ts` (3), `mock-auth.provider.test.ts` (3)
- `__tests__/persistence/mock/` — `mock-store.test.ts` (26), `mock-ticket-repository.test.ts` (12), `mock-empleado-repository.test.ts` (3)

Auth enforcement probado a nivel de use case:
- Mecánico edita solo sus tickets; admin edita todos → `EditarTicketUseCase`
- Mecánico solo puede reenviar a `pendiente_revision`; no puede aprobar ni modificar ticket ajeno → `CambiarEstadoUseCase`

---

### PocketBase — estado de conexión ✅

**PocketBase:** `http://192.168.0.222:8090` (red local). Nota v0.23+: usa `pb.collection("_superusers").authWithPassword()`.

**Seed:** `packages/core/seed.ts`. Ejecutar desde raíz:
```bash
PB_URL=http://192.168.0.222:8090 PB_ADMIN_EMAIL=<su> PB_ADMIN_PASS=<pass> npx tsx packages/core/seed.ts
```
Crea 2 mecánicos + 1 admin (password `Password1234!`), 1 ticket por mecánico, historial de creación. Idempotente en usuarios; borra y recrea tickets. Nota: El seed está adaptado para PocketBase v0.23+, forzando la actualización de esquemas (usando `fields` en lugar de `schema`, y declarando explícitamente los campos autodate de `created`/`updated` para evitar su eliminación y asegurar el soporte para ordenamientos en las queries del frontend).

El seed también setea API rules en `users`, `tickets`, `historial_ediciones` (list/view/create para usuarios autenticados, delete solo superusers). Sin esto PocketBase retorna 403 al listar usuarios.

**Cambiar a mock:** `NEXT_PUBLIC_USE_MOCK=true` en `.env.local` — toda la infraestructura es condicional.

---

## Archivos clave para leer primero

Si vas a trabajar en algo específico, estos son los archivos que dan más contexto rápido:

| Tarea | Leer primero |
|---|---|
| Cualquier cosa | `docs/context.md` (este archivo) |
| Reglas de negocio | `docs/global-vision.md` |
| Design system | `docs/estetica.md` |
| Arquitectura módulos | `docs/arquitectura-modulos.md` |
| Historial de cambios | `docs/vitacora.md` |
| Capa de datos actual | `src/lib/db.ts` + `src/lib/mock/store.ts` |
| Módulos DDD | `src/modules/ticket/infrastructure/ticket-module.ts` |
| Admin layout/nav | `src/app/admin/layout.tsx` |
| Mecánico layout/nav | `src/app/(mecanico)/layout.tsx` |
