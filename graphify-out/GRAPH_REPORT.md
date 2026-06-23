# Graph Report - /home/hermandev/Documents/proyectos/1/servicar  (2026-06-23)

## Corpus Check
- 182 files · ~47,383 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 712 nodes · 1514 edges · 44 communities (36 shown, 8 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b2b8826`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_package.json|package.json]]
- [[_COMMUNITY_formatter|formatter]]
- [[_COMMUNITY_dependencies|dependencies]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_.eslintrc.json|.eslintrc.json]]
- [[_COMMUNITY_next.config.mjs|next.config.mjs]]
- [[_COMMUNITY_extensions.json|extensions.json]]
- [[_COMMUNITY_useColaViewModel|useColaViewModel]]
- [[_COMMUNITY_TicketEstado|TicketEstado]]
- [[_COMMUNITY_EditarTicketPage|EditarTicketPage]]
- [[_COMMUNITY_index.ts|index.ts]]
- [[_COMMUNITY_hooks.ts|hooks.ts]]
- [[_COMMUNITY_index.ts|index.ts]]
- [[_COMMUNITY_index.ts|index.ts]]
- [[_COMMUNITY_utils.ts|utils.ts]]
- [[_COMMUNITY_index.ts|index.ts]]
- [[_COMMUNITY_content.types.ts|content.types.ts]]
- [[_COMMUNITY_OnceUIConfig|OnceUIConfig]]
- [[_COMMUNITY_index.ts|index.ts]]
- [[_COMMUNITY_RouteGuard()|RouteGuard()]]
- [[_COMMUNITY_ticketModule|ticketModule]]
- [[_COMMUNITY_package.json|package.json]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_.crearTicket()|.crearTicket()]]
- [[_COMMUNITY_ticket.entity.test.ts|ticket.entity.test.ts]]
- [[_COMMUNITY_MockTicketRepository|MockTicketRepository]]
- [[_COMMUNITY_Empleado|Empleado]]
- [[_COMMUNITY_Ticket|Ticket]]
- [[_COMMUNITY_HistorialEntry|HistorialEntry]]
- [[_COMMUNITY_Guía de despliegue — Servicar|Guía de despliegue — Servicar]]
- [[_COMMUNITY_CLAUDE|CLAUDE.md]]
- [[_COMMUNITY_README|README.md]]
- [[_COMMUNITY_Servicar — Frontend (Next.js)|Servicar — Frontend (Next.js)]]
- [[_COMMUNITY_graphify|graphify.md]]
- [[_COMMUNITY_graphify|graphify.md]]
- [[_COMMUNITY_Entidad Ticket|Entidad Ticket]]
- [[_COMMUNITY_RF-2 Vista de Tickets|RF-2: Vista de Tickets]]
- [[_COMMUNITY_PublicoTicketView()|PublicoTicketView()]]

## God Nodes (most connected - your core abstractions)
1. `Ticket` - 78 edges
2. `Empleado` - 57 edges
3. `ITicketRepository` - 36 edges
4. `PbStore` - 33 edges
5. `ticketModule` - 32 edges
6. `MockStore` - 31 edges
7. `MockTicketRepository` - 29 edges
8. `EditarTicketPage` - 26 edges
9. `OnceUIConfig` - 23 edges
10. `empleadoModule` - 23 edges

## Surprising Connections (you probably didn't know these)
- `Ticket` --references--> `Paquete Core Domain (@servicar/core)`  [INFERRED]
  packages/core/src/modules/ticket/domain/entities/ticket.entity.ts → next/README.md
- `ITicketRepository` --conceptually_related_to--> `Backend PocketBase`  [INFERRED]
  packages/core/src/modules/ticket/domain/ports/ticket.repository.port.ts → DEPLOY.md
- `EditarTicketUseCase` --references--> `RF-3: Edición de Tickets (rol-based ownership)`  [INFERRED]
  packages/core/src/modules/ticket/application/use-cases/editar-ticket.use-case.ts → requisitos-requerimientos.md
- `Ticket` --conceptually_related_to--> `Entidad Ticket`  [INFERRED]
  packages/core/src/modules/ticket/domain/entities/ticket.entity.ts → CLAUDE.md
- `NuevoTicketPage` --references--> `RF-1: Creación de Tickets`  [INFERRED]
  next/src/app/ticket/nuevo/page.tsx → requisitos-requerimientos.md

## Communities (44 total, 8 thin omitted)

### Community 29 - "package.json"
Cohesion: 0.50
Nodes (3): name, private, workspaces

### Community 15 - "formatter"
Cohesion: 0.14
Nodes (16): $schema, vcs, enabled, clientKind, useIgnoreFile, files, ignoreUnknown, formatter (+8 more)

### Community 4 - "dependencies"
Cohesion: 0.06
Nodes (35): name, version, scripts, dev, export, build, biome-write, start (+27 more)

### Community 10 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, typeRoots, lib, allowJs, skipLibCheck, strict, noEmit, esModuleInterop (+15 more)

### Community 13 - "useColaViewModel"
Cohesion: 0.20
Nodes (14): Action, PendingAction, ColaVM, ColaView(), ConfirmModalProps, ConfirmModal(), TriageRowProps, TriageRow() (+6 more)

### Community 3 - "TicketEstado"
Cohesion: 0.09
Nodes (34): TicketsVM, HistorialTab, TicketsView(), NAV, ESTADO_CFG, HistorialView(), ESTADO_ACTIONS, KanbanCardProps (+26 more)

### Community 8 - "EditarTicketPage"
Cohesion: 0.12
Nodes (24): NuevoTicketFormState, EMPTY, EditarTicketFormState, EditarTicketViewState, AlertType, AlertBannerProps, TYPE_CFG, AlertBanner() (+16 more)

### Community 0 - "index.ts"
Cohesion: 0.06
Nodes (43): FilterEstado, FILTROS, TallerVM, FichaTab, FichasVM, IRouter, IAdminCoordinator, IMecanicoCoordinator (+35 more)

### Community 9 - "hooks.ts"
Cohesion: 0.16
Nodes (16): useAuth(), useStoreVersion(), getMockSession(), useMockAuth(), useMockTickets(), useMockTicketsByCreador(), useMockEmpleados(), useMockHistorialByTicket() (+8 more)

### Community 1 - "index.ts"
Cohesion: 0.06
Nodes (29): authModule, provider, useCase, store, provider, t, result, id (+21 more)

### Community 22 - "utils.ts"
Cohesion: 0.24
Nodes (9): NotFound(), sitemap(), Team, Metadata, getMDXFiles(), readMDXFile(), getMDXData(), getPosts() (+1 more)

### Community 17 - "index.ts"
Cohesion: 0.21
Nodes (9): Providers(), home, appMeta, display, fonts, style, dataStyle, effects (+1 more)

### Community 18 - "content.types.ts"
Cohesion: 0.15
Nodes (12): IANATimeZone, Person, Newsletter, Social, BasePageConfig, Home, About, Blog (+4 more)

### Community 14 - "OnceUIConfig"
Cohesion: 0.17
Nodes (16): DisplayConfig, RoutesConfig, ProtectedRoutesConfig, FontsConfig, StyleConfig, DataStyleConfig, EffectsConfig, MailchimpConfig (+8 more)

### Community 27 - "index.ts"
Cohesion: 0.43
Nodes (3): Header(), ThemeToggle(), Footer()

### Community 30 - "RouteGuard()"
Cohesion: 0.50
Nodes (4): RouteGuardProps, DYNAMIC_ROUTE_PREFIXES, RouteGuard(), protectedRoutes

### Community 12 - "ticketModule"
Cohesion: 0.15
Nodes (10): store, IGetTicketByIdQuery, IEditarTicketUseCase, ticketModule, CambiarEstadoUseCase, EditarTicketUseCase, CambiarEstadoDTO, RF-3: Edición de Tickets (rol-based ownership) (+2 more)

### Community 20 - "package.json"
Cohesion: 0.15
Nodes (12): name, version, private, main, types, scripts, test, test:watch (+4 more)

### Community 24 - "compilerOptions"
Cohesion: 0.22
Nodes (8): compilerOptions, target, lib, module, moduleResolution, strict, skipLibCheck, include

### Community 11 - ".crearTicket()"
Cohesion: 0.11
Nodes (8): DTO, r, uc, isTransicionValida(), AggregateRoot, TicketCamposEditables, Matricula, CrearTicketDTO

### Community 28 - "ticket.entity.test.ts"
Cohesion: 0.33
Nodes (4): BASE, t, original, editado

### Community 16 - "MockTicketRepository"
Cohesion: 0.15
Nodes (10): t, actualizado, t2, t3, hist, uc, MockTicketRepository, mockTicketToEntity() (+2 more)

### Community 2 - "Empleado"
Cohesion: 0.08
Nodes (16): PbUser, pbUserToEmpleado(), PbEmpleadoRepository, EmpleadoProps, Empleado, IEmpleadoRepository, GetEmpleadosQuery, GetEmpleadoByIdQuery (+8 more)

### Community 5 - "Ticket"
Cohesion: 0.08
Nodes (7): pbTicketToEntity(), entityToPbTicketData(), entityToPbHistorialData(), Ticket, ITicketRepository, GetTicketsPorEstadoQuery, GetTicketsPorCreadorQuery

### Community 6 - "HistorialEntry"
Cohesion: 0.12
Nodes (11): PbHistorialRepository, pbHistorialToEntity(), mockHistorialToEntity(), MockHistorialRepository, TipoAccion, HistorialEntryProps, TicketProps, IHistorialRepository (+3 more)

### Community 7 - "Guía de despliegue — Servicar"
Cohesion: 0.07
Nodes (27): Guía de despliegue — Servicar, code:block1 (Internet), Requisitos, 1. Desplegar PocketBase, code:bash (# Construir imagen y levantar), Configuración inicial de PocketBase, 2. Desplegar Next.js, code:bash (# Exportar la variable antes de buildear) (+19 more)

### Community 23 - "CLAUDE.md"
Cohesion: 0.18
Nodes (10): Project Overview, Repository Layout, code:block1 (servicar/), react-prototipo, code:bash (cd react-prototipo), Architecture, Stack, Planned Production Stack (+2 more)

### Community 21 - "Servicar — Frontend (Next.js)"
Cohesion: 0.17
Nodes (11): Servicar — Frontend (Next.js), Requisitos, Inicio rápido, code:bash (pnpm install), code:bash (cd next), code:block3 (src/resources/once-ui.config.ts), code:block4 (src/resources/content.tsx), Arquitectura (+3 more)

### Community 25 - "Entidad Ticket"
Cohesion: 0.25
Nodes (8): Servicar System, Rol Mecánico, Rol Administrador, Rol Cliente, Entidad Ticket, Historial de Ediciones Inmutable, Máquina de Estados de Ticket, Modo Offline y Borradores

### Community 26 - "PublicoTicketView()"
Cohesion: 0.38
Nodes (5): usePublicoTicketViewModel(), TagVariant, ESTADO_CFG, PublicoTicketView(), TicketPublicoPage()

## Knowledge Gaps
- **207 isolated node(s):** `name`, `private`, `workspaces`, `$schema`, `clientKind` (+202 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Ticket` connect `Ticket` to `index.ts`, `TicketEstado`, `HistorialEntry`, `Guía de despliegue — Servicar`, `EditarTicketPage`, `.crearTicket()`, `ticketModule`, `useColaViewModel`, `MockTicketRepository`, `Entidad Ticket`, `ticket.entity.test.ts`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Why does `ITicketRepository` connect `Ticket` to `index.ts`, `Empleado`, `TicketEstado`, `HistorialEntry`, `Guía de despliegue — Servicar`, `.crearTicket()`, `ticketModule`, `MockTicketRepository`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `PbStore` connect `Empleado` to `index.ts`, `TicketEstado`, `Ticket`, `HistorialEntry`, `ticketModule`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Ticket` (e.g. with `Entidad Ticket` and `Paquete Core Domain (@servicar/core)`) actually correct?**
  _`Ticket` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `PbStore` (e.g. with `CambiarEstadoUseCase` and `EditarTicketUseCase`) actually correct?**
  _`PbStore` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `workspaces` to the rest of the system?**
  _210 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `formatter` be split into smaller, more focused modules?**
  _Cohesion score 0.13970588235294118 - nodes in this community are weakly interconnected._