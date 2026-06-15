# Contexto del Proyecto — Servicar

Documento de orientación para agentes. Lee esto antes de tocar cualquier archivo.

---

## Qué es el proyecto

**Servicar** — sistema de gestión de taller de autobuses. Centraliza operaciones (incidencias, reparaciones, reclamos) a través de una entidad unificada: el **Ticket**.

**Tres roles:**
- **Mecánico** — móvil, crea y edita sus propios tickets
- **Administrador** — desktop, aprueba / rechaza / reasigna cualquier ticket
- **Cliente** — portal público read-only, busca ticket por ID (sin auth)

**Stack de producción planeado:** Next.js 15 + Convex (BaaS) + Vercel. **Hoy:** Next.js con capa mock (localStorage) mientras se conecta Convex.

---

## Repositorio

```
servicar/                           ← workspace root (npm workspaces)
├── package.json                    ← { "workspaces": ["packages/*", "next"] }
├── docs/               ← documentación del proyecto
│   ├── context.md              ← este archivo
│   ├── arquitectura-modulos.md ← detalle técnico DDD+Hexagonal+MVVM-C
│   ├── estetica.md             ← design system tokens y patrones visuales
│   ├── vitacora.md             ← log cronológico de decisiones y cambios
│   ├── global-vision.md        ← reglas de negocio y glosario
│   └── ddd-hexagonal-refactor.md ← propuesta original de estructura
├── packages/
│   └── core/                   ← @servicar/core — dominio + aplicación (framework-agnostic)
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts        ← barrel: exporta todo el dominio y aplicación
│           └── modules/
│               ├── shared/domain/
│               ├── ticket/domain/ + application/
│               └── empleado/domain/ + application/
├── persistence/
│   └── mock/                   ← @servicar/persistence-mock — localStorage + seed + repos
│       ├── package.json
│       ├── tsconfig.json       ← alias @servicar/core → ../../packages/core/src/index.ts
│       └── src/
│           ├── index.ts
│           ├── data.ts         ← MockTicket, MockEmpleado, MockHistorial, seed arrays
│           ├── store.ts        ← MockStore + singleton mockStore
│           ├── ticket/         ← MockTicketRepository, MockHistorialRepository, mapper
│           └── empleado/       ← MockEmpleadoRepository, mapper
├── react-prototipo/    ← prototipo UI (no tocar, solo referencia)
└── next/               ← app de producción (aquí se trabaja)
    └── package.json    ← { "name": "@servicar/next", deps: "@servicar/core", "@servicar/persistence-mock" }
```

**Working directory activo:** `/home/hermandev/Documents/proyectos/1/servicar/next`

**Resolución `@servicar/core`:** alias en `next/tsconfig.json` → `../packages/core/src/index.ts`. TypeScript resuelve sin necesidad de `npm install` ni symlinks.

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
/ticket/nuevo             → formulario nuevo ticket
/ticket/[id]/editar       → editar ticket existente
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
  → ViewModel hook
      → ticketModule / empleadoModule (service locators en next/src/modules/)
      → use cases / queries  ← @servicar/core (application layer)
      → ITicketRepository    ← @servicar/core (port)
      → MockTicketRepository ← next/src/modules/*/infrastructure/ (adaptador)
      → MockStore            ← next/src/lib/mock/store.ts
```

**`@servicar/core`** (`packages/core/`) — dominio + aplicación. Cero dependencias de React, Next.js, o browser APIs. Una futura app Vue importa esto directamente.

**`@servicar/persistence-mock`** (`persistence/mock/`) — adaptadores de persistencia en localStorage. Contiene `MockStore`, seed data, repositorios, mappers. Sin React. Cuando llegue Convex, se crea `persistence/convex/` en paralelo — core y UI no se tocan.

**`next/src/modules/`** — solo service locators (`ticket-module.ts`, `empleado-module.ts`). Importan de `@servicar/core` (use cases) y `@servicar/persistence-mock` (repositorios). Para migrar a Convex: cambiar los imports de repositorios en estos 2 archivos.

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
│       └── [id]/editar/page.tsx  ← thin shell → EditarTicketView
│
├── lib/                          ← legacy — solo hooks.ts permanece
│   └── mock/
│       └── hooks.ts              ← React hooks sobre MockStore (único archivo con "use client" fuera de app/)
│
├── modules/                      ← SOLO service locators
│   ├── ticket/infrastructure/
│   │   └── ticket-module.ts      ← importa use cases de @servicar/core + repos de @servicar/persistence-mock
│   └── empleado/infrastructure/
│       └── empleado-module.ts    ← importa use cases de @servicar/core + repo de @servicar/persistence-mock
│
├── presentation/                 ← MVVM-C (cross-cutting)
│   ├── coordinators/
│   │   ├── interfaces/           ← IRouter, IAdminCoordinator, IMecanicoCoordinator
│   │   ├── admin.coordinator.ts
│   │   ├── mecanico.coordinator.ts
│   │   └── index.ts
│   ├── view-models/
│   │   ├── admin/                ← useAdminLayoutViewModel, useColaViewModel, useTicketsViewModel, useHistorialViewModel
│   │   ├── mecanico/             ← useMecanicoLayoutViewModel, useDashboardViewModel, useTallerViewModel, useFichasViewModel
│   │   └── ticket/               ← useNuevoTicketViewModel, useEditarTicketViewModel
│   ├── views/
│   │   ├── admin/                ← AdminLayoutView, ColaView, TicketsView, HistorialView (Once UI)
│   │   ├── mecanico/             ← MecanicoLayoutView, DashboardView, TallerView, FichasView
│   │   ├── ticket/               ← NuevoTicketView, EditarTicketView
│   │   └── shared/EstadoChip.tsx
│   └── hooks/
│       └── useStoreReactive.ts   ← useReducer + mockStore.subscribe para reactivity
│
├── components/                   ← Once UI shell (RouteGuard, Providers, etc.)
└── resources/
    ├── custom.css                ← tokens --sp-* + clases .sp-*
    ├── icons.ts                  ← iconLibrary para Once UI (react-icons)
    └── once-ui.config.ts         ← tema, rutas, fuentes
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

| Nombre | Rol | Email | authId |
|---|---|---|---|
| Juan Pérez | mecanico | juan.perez@servicar.com | auth_juan |
| M. Rodriguez | mecanico | m.rodriguez@servicar.com | auth_rodriguez |
| Admin Taller | admin | admin@servicar.com | auth_admin |

7 tickets seed que cubren todos los estados. Persisten en localStorage entre recargas.

---

## Patrones de código a respetar

### Imports

```typescript
// ✅ Tipos y lógica de dominio/aplicación — desde @servicar/core
import type { Ticket, TicketEstado, Empleado } from "@servicar/core";
import type { ICrearTicketUseCase, IGetTicketsQuery } from "@servicar/core";
import { CrearTicketUseCase, GetTicketsQuery } from "@servicar/core";

// ✅ Tipos de persistence (Mock*, seed data, mockStore) — desde @servicar/persistence-mock
import type { MockTicket, MockEmpleado } from "@servicar/persistence-mock";
import { mockStore, MockTicketRepository } from "@servicar/persistence-mock";

// ✅ Service locators — desde modules de next
import { ticketModule }   from "@/modules/ticket/infrastructure/ticket-module";
import { empleadoModule } from "@/modules/empleado/infrastructure/empleado-module";

// ✅ Coordinators — interfaces en ViewModels, clases concretas en thin shells
import type { IAdminCoordinator }    from "@/presentation/coordinators";
import { AdminCoordinator }          from "@/presentation/coordinators";

// ❌ Nunca en pages o ViewModels
import { useTickets } from "@/lib/db";   // lib/db obsoleto, no usar en código nuevo
```

### Regla de dependencia

```
@servicar/core            — solo TypeScript puro, cero browser/React
  └── shared/domain ← ticket/domain + application ← empleado/domain + application

@servicar/persistence-mock — localStorage + seed data, cero React
  └── depende de @servicar/core (implementa sus puertos)

next/src/
  └── modules/*/infrastructure/   ← service locators: @servicar/core + @servicar/persistence-mock
  └── lib/mock/hooks.ts           ← único punto de React sobre MockStore
  └── presentation/coordinators/  ← solo IRouter + interfaces propias
  └── presentation/view-models/   ← importa modules + coordinators
  └── presentation/views/         ← solo props (JSX puro)
  └── app/*/page.tsx              ← thin shell: Coordinator + ViewModel + View
```

`@servicar/core` y `@servicar/persistence-mock` nunca importan React. Si tienen `"use client"` o `import { useState }`, es un error.

### MockStore — reactividad

`useStoreVersion()` en `hooks.ts` suscribe al `mockStore` (de `@servicar/persistence-mock`) y fuerza re-render en cada `notify()`. Toda mutación debe terminar con `mockStore.notify()`. Si el store cambia pero la UI no actualiza, este es el lugar a revisar.

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
- **Portal cliente `/ticket/[id]`** — público, sin auth, lookup por ID exacto. Próxima tarea.
- Módulo offline/drafts (postergado intencionalmente)

### Futuro — Convex

Cuando haya cuenta Convex:
1. Crear `persistence/convex/` con `ConvexTicketRepository` y `ConvexEmpleadoRepository`
2. Cambiar imports en `ticket-module.ts` y `empleado-module.ts` (de `@servicar/persistence-mock` a `@servicar/persistence-convex`)
3. `@servicar/core` y toda la UI: sin tocar

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
