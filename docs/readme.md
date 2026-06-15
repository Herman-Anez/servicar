# Servicar — Guía de Desarrollo v1

Sistema de gestión de órdenes para talleres de autobuses. Centraliza incidencias, reparaciones y reclamos bajo un único objeto "Ticket" con audit trail completo.

---

## Arrancar el proyecto

```bash
cd servicar/next
npm install
npm run dev          # http://localhost:3000
```

Variables de entorno necesarias (`next/.env.local`):

```env
NEXT_PUBLIC_USE_MOCK=true
# NEXT_PUBLIC_CONVEX_URL=   ← dejar comentado hasta Fase 1
```

TypeScript check:

```bash
npx tsc --noEmit     # debe retornar 0 errores
```

---

## Login y usuarios de prueba

Ruta inicial: `http://localhost:3000` → redirige a `/login`.

La pantalla de login muestra un **panel de acceso rápido** con los 3 usuarios seed — un click entra directo sin escribir credenciales:

| Nombre | Email | Rol | Redirige a |
|--------|-------|-----|-----------|
| Juan Pérez | juan.perez@servicar.com | mecánico | `/dashboard` |
| M. Rodriguez | m.rodriguez@servicar.com | mecánico | `/dashboard` |
| Admin Taller | admin@servicar.com | admin | `/admin/cola` |

El formulario de email+contraseña también funciona (cualquier contraseña, el mock solo verifica el email).

---

## Mapa de rutas

```
/login                          ← pública, redirige si ya autenticado
/                               ← redirige a /login

── Mecánico (layout con bottom nav) ──────────────────────────────
/dashboard                      ← KPI + actividad reciente + FAB nueva orden
/taller                         ← todos los tickets con búsqueda y filtro
/fichas                         ← mis tickets (subtabs: corregir / en revisión)
/offline                        ← borradores offline + sync

/ticket/nuevo                   ← crear orden (publica o guarda borrador)
/ticket/[id]/editar             ← editar orden propia

── Admin (layout con top nav) ────────────────────────────────────
/admin                          ← redirige a /admin/cola
/admin/cola                     ← cola de pendiente_revision (aprobar / rechazar)
/admin/tickets                  ← tabla global con filtros y acciones de estado
/admin/historial/[id]           ← timeline del audit log de un ticket
```

Protecciones activas:
- Rutas `/dashboard`, `/fichas`, `/offline`, `/taller`, `/ticket/*` → redirigen a `/login` si no autenticado
- Rutas `/admin/*` → redirigen a `/login` si no autenticado, a `/dashboard` si el rol no es `admin`

---

## Seed data

7 tickets que cubren todos los estados:

| ID | Matrícula | Estado | Mecánico | Nota Admin |
|----|-----------|--------|----------|------------|
| tk_001 | 4829-KXL | `en_progreso` | Juan Pérez | — |
| tk_002 | 1122-CMM | `bloqueado` | M. Rodriguez | — |
| tk_003 | 9901-BBD | `finalizado` | Juan Pérez | — |
| tk_004 | 3312-HGT | `urgente` | Juan Pérez | — |
| tk_005 | VOLVO-FH16 | `requiere_cambios` | Juan Pérez | "Las fotos de las pastillas están borrosas…" |
| tk_006 | SCANIA-R500 | `requiere_cambios` | Juan Pérez | "Falta el número de serie…" |
| tk_007 | MERCEDES-ACTROS | `pendiente_revision` | Juan Pérez | — |

Historial de tk_001: CREACION + CAMBIO_ESTADO (pendiente → en_progreso por admin).

---

## Flujos de prueba

### Mecánico — flujo principal

1. Login como **Juan Pérez**
2. Dashboard → ver KPI cards (fichas pendientes, borradores)
3. Fichas → tab "Corregir" → tk_005 y tk_006 con nota admin en amarillo → "CORREGIR" abre formulario pre-cargado con la nota
4. Taller → buscar `VOLVO` → filtro chip "Correcciones"
5. Nueva orden → botón FAB → si modo Online publica, si Offline guarda borrador
6. Offline → toggle en top bar → crear otra orden → queda en borradores → "PUBLICAR TODO" cuando vuelva Online

### Admin — flujo de triage

1. Login como **Admin Taller**
2. Cola → tk_007 pendiente → "APROBAR" (confirmar) → ticket desaparece de cola
3. Cola (ya vacía) → crear un ticket como mecánico para tener material nuevo
4. Tickets → tabla completa → filtro "Activos" → acción "URGENTE" en tk_001 → confirmar inline
5. Historial → click "HISTORIAL" en cualquier ticket → timeline con eventos

### Modo offline

1. Top bar → toggle al modo **Offline** (indicador rojo)
2. Nueva orden → se guarda en localStorage como borrador
3. Tab Offline → lista de borradores → eliminar individual o "PUBLICAR TODO"
4. Toggle de vuelta a **Online** → "PUBLICAR TODO" → borradores se convierten en tickets

---

## Máquina de estados del ticket

```
[mecánico crea]
      ↓
pendiente_revision ──(admin aprueba)──→ aprobado ──(admin/inicia)──→ en_progreso
      │                                                                    │
      └──(admin rechaza)──→ requiere_cambios ──(mecánico corrige)──┘      │
                                                                           ├──→ urgente
                                                                           ├──→ bloqueado
                                                                           └──→ finalizado
```

Transiciones disponibles en `/admin/tickets`:

| Desde | Acciones |
|-------|---------|
| `aprobado` | INICIAR → `en_progreso` |
| `en_progreso` | URGENTE → `urgente` / BLOQUEAR → `bloqueado` / FINALIZAR → `finalizado` |
| `urgente` | NORMAL → `en_progreso` / FINALIZAR → `finalizado` |
| `bloqueado` | REACTIVAR → `en_progreso` |

---

## Arquitectura del frontend

```
next/src/
├── app/
│   ├── layout.tsx                    ← root: RouteGuard + Background + Providers
│   ├── page.tsx                      ← redirect /login
│   ├── login/page.tsx                ← auth mock + acceso rápido
│   ├── (mecanico)/                   ← route group — layout con bottom nav
│   │   ├── layout.tsx                ← shell: top bar + nav + auth guard
│   │   ├── _components/
│   │   │   └── EstadoChip.tsx        ← badge de estado compartido
│   │   ├── dashboard/page.tsx
│   │   ├── taller/page.tsx
│   │   ├── fichas/page.tsx
│   │   └── offline/page.tsx
│   ├── ticket/
│   │   ├── nuevo/page.tsx
│   │   └── [id]/editar/page.tsx
│   └── admin/
│       ├── layout.tsx                ← shell: top nav + auth+rol guard
│       ├── page.tsx                  ← redirect /admin/cola
│       ├── cola/page.tsx
│       ├── tickets/page.tsx
│       └── historial/[id]/page.tsx
├── lib/
│   ├── db.ts                         ← punto de entrada único para datos
│   ├── online.ts                     ← hook modo online/offline (localStorage)
│   ├── drafts.ts                     ← hook borradores offline (localStorage)
│   └── mock/
│       ├── data.ts                   ← tipos + seed data
│       ├── store.ts                  ← MockStore singleton reactivo
│       └── hooks.ts                  ← hooks con API idéntica a Convex
├── components/
│   ├── RouteGuard.tsx                ← verifica rutas permitidas
│   ├── Header.tsx                    ← placeholder (no se usa en vistas con layout propio)
│   └── Footer.tsx                    ← minimal
└── resources/
    ├── once-ui.config.ts             ← tema, rutas, estilos Once UI
    ├── content.tsx                   ← metadatos Servicar
    └── icons.ts                      ← iconos Servicar (hi2 via react-icons)
```

### Regla de importación

Componentes importan datos **siempre** de `@/lib/db`:

```typescript
// ✅ correcto
import { useAuth, useTickets, useCrearTicket, type Ticket } from "@/lib/db";

// ❌ incorrecto — rompe la capa de abstracción
import { useMockTickets } from "@/lib/mock/hooks";
import { useQuery } from "convex/react";
```

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16, App Router |
| UI | Once UI (`@once-ui-system/core`), Tailwind CSS v4 |
| Iconos | `react-icons/hi2` via `src/resources/icons.ts` |
| Estado/datos | Mock layer (`src/lib/mock/`) — swap a Convex en Fase 1 |
| Persistencia dev | localStorage (`servicar_mock_*`) |
| TypeScript | ~5.x strict |
| Package manager | npm |

---

## Pendiente

| Fase | Descripción | Bloqueado por |
|------|-------------|---------------|
| Fase 1 | Schema + mutations Convex | Cuenta Convex |
| Fase 2 | Auth real (Convex Auth + Password) | Fase 1 |
| Fase 5 | Sync borradores a Convex | Fase 1 |
| Fase 6 | Portal cliente `/ticket/[id]` (público) | — |

Ver detalle en `docs/vitacora.md`.
