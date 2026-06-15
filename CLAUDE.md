# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview     

**Servicar** — bus workshop management system. Centralizes operations (incidents, repairs, claims) via a unified "Ticket" entity with full audit trail.

Three user roles:
- **Mecánico**: Mobile UI, creates/edits own tickets
- **Administrador**: Desktop panel, approves/rejects/reassigns any ticket
- **Cliente**: Public read-only ticket lookup by ID (no auth)

## Repository Layout

```
servicar/
├── docs/               # Architecture docs & DB schema
│   ├── global-vision.md            # Business rules and domain glossary
│   └── esquema_de_base_de_datos_convex.ts  # Planned Convex schema
├── react-prototipo/    # Interactive UI prototype (no real backend)
└── next/               # Future Next.js + Convex production app (TBD)
```

## react-prototipo

Standalone UI mockup built with React 19 + Vite. Uses **localStorage** to simulate persistence and has a network toggle to simulate offline mode. **Not connected to any backend.**

**Package manager:** `pnpm`

```bash
cd react-prototipo
pnpm install
pnpm dev        # http://localhost:3000
pnpm build
pnpm lint       # tsc --noEmit
```

Requires `GEMINI_API_KEY` in `.env.local` (see `.env.example`) for any Gemini AI features.

### Architecture

All application state lives in `src/App.tsx` and is passed down as props — no router, no state library. Tab navigation (`dashboard | tickets | drafts | workshops`) is a `useState` value.

Key data flow:
- `src/types.ts` — `Ticket`, `Draft`, `RecentActivity`, `AppState` types
- `src/data.ts` — seed data for initial state
- `src/App.tsx` — state root; all handlers defined here
- `src/components/` — pure presentational views (`DashboardView`, `TicketsView`, `DraftsView`, `WorkshopsView`, `TicketFormView`, `Header`, `LoginScreen`)

Offline mode: drafts saved locally, batch-synced to live tickets via `handleSyncAllDrafts` when online. Draft→Ticket promotion happens in `handleSaveLiveTicket`.

### Stack

- React 19, TypeScript ~5.8, Vite 6
- Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- Lucide React (icons), Motion (animations)
- `@google/genai` for Gemini integration

## Planned Production Stack

From `docs/global-vision.md`:
- **Backend/DB**: Convex (BaaS) — real-time queries, mutations, auth
- **Frontend**: Next.js (React)
- **Deploy**: Vercel

### Convex Schema (planned)

Defined in `docs/esquema_de_base_de_datos_convex.ts`:

| Table | Key fields |
|-------|-----------|
| `empleados` | `nombre`, `rol` (`mecanico`/`admin`), `identificadorAutenticacion` |
| `tickets` | `matricula`, `categoria`, `estado`, `creadorId`, indexes by estado/matricula/creador |
| `historial_ediciones` | `ticketId`, `empleadoId`, `tipoAccion`, `detallesCambio` — immutable audit log |

Ticket state machine: `pendiente_revision` → `aprobado` / `requiere_cambios` → `en_progreso` → `finalizado`

## Business Rules (from docs)

1. Every ticket requires a `matricula` (bus plate).
2. Login mandatory; every action records the responsible employee.
3. Mecánico edits only own tickets; Admin edits all.
4. No ticket reaches the global list without `aprobado` status.
5. `historial_ediciones` is immutable — never alter or delete entries.
6. Public client access only by exact ticket ID — no listing endpoints.
