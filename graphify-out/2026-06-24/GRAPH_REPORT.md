# Graph Report - servicar  (2026-06-23)

## Corpus Check
- 179 files · ~49,149 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 909 nodes · 2526 edges · 46 communities (38 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `888f5ad7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Mecánico MVVM-C (Coordinators)|Mecánico MVVM-C (Coordinators)]]
- [[_COMMUNITY_Auth & Service Locators|Auth & Service Locators]]
- [[_COMMUNITY_MockPB Infrastructure|Mock/PB Infrastructure]]
- [[_COMMUNITY_Admin UI Components|Admin UI Components]]
- [[_COMMUNITY_NPM Dependencies|NPM Dependencies]]
- [[_COMMUNITY_Ticket Domain Entity|Ticket Domain Entity]]
- [[_COMMUNITY_HistorialEntry Domain|HistorialEntry Domain]]
- [[_COMMUNITY_Deployment & Architecture Docs|Deployment & Architecture Docs]]
- [[_COMMUNITY_Shared Domain + Pages|Shared Domain + Pages]]
- [[_COMMUNITY_Auth Session Layer|Auth Session Layer]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Aggregate Root & DTOs|Aggregate Root & DTOs]]
- [[_COMMUNITY_Business Rules & ticketModule|Business Rules & ticketModule]]
- [[_COMMUNITY_Admin Cola (Triage) View|Admin Cola (Triage) View]]
- [[_COMMUNITY_Once UI Config Types|Once UI Config Types]]
- [[_COMMUNITY_LinterFormatter Config|Linter/Formatter Config]]
- [[_COMMUNITY_Mock Ticket Repository|Mock Ticket Repository]]
- [[_COMMUNITY_Root Layout & SEO|Root Layout & SEO]]
- [[_COMMUNITY_Icon Library|Icon Library]]
- [[_COMMUNITY_IAuthSessionService|IAuthSessionService]]
- [[_COMMUNITY_Package.json Core|Package.json Core]]
- [[_COMMUNITY_Architecture README|Architecture README]]
- [[_COMMUNITY_Not Found & Utils|Not Found & Utils]]
- [[_COMMUNITY_CLAUDE.md Instructions|CLAUDE.md Instructions]]
- [[_COMMUNITY_tsconfig Packages|tsconfig Packages]]
- [[_COMMUNITY_Domain Concepts (Docs)|Domain Concepts (Docs)]]
- [[_COMMUNITY_Public Ticket Portal|Public Ticket Portal]]
- [[_COMMUNITY_Shell Components|Shell Components]]
- [[_COMMUNITY_Ticket Entity Tests|Ticket Entity Tests]]
- [[_COMMUNITY_Workspace Root Package|Workspace Root Package]]
- [[_COMMUNITY_RouteGuard|RouteGuard]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_Next.js README|Next.js README]]
- [[_COMMUNITY_Requirements Doc|Requirements Doc]]
- [[_COMMUNITY_Graphify Config|Graphify Config]]
- [[_COMMUNITY_VSCode Extensions|VSCode Extensions]]
- [[_COMMUNITY_Graphify Workflow|Graphify Workflow]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]

## God Nodes (most connected - your core abstractions)
1. `Ticket` - 110 edges
2. `Empleado` - 80 edges
3. `ITicketRepository` - 48 edges
4. `MockStore` - 41 edges
5. `TicketEstado` - 36 edges
6. `PbStore` - 33 edges
7. `MockTicketRepository` - 32 edges
8. `ticketModule` - 32 edges
9. `PbStore` - 30 edges
10. `HistorialEntry` - 29 edges

## Surprising Connections (you probably didn't know these)
- `Ticket` --references--> `Paquete Core Domain (@servicar/core)`  [INFERRED]
  packages/core/src/modules/ticket/domain/entities/ticket.entity.ts → next/README.md
- `ITicketRepository` --conceptually_related_to--> `Backend PocketBase`  [INFERRED]
  packages/core/src/modules/ticket/domain/ports/ticket.repository.port.ts → DEPLOY.md
- `Ticket` --conceptually_related_to--> `Entidad Ticket`  [INFERRED]
  packages/core/src/modules/ticket/domain/entities/ticket.entity.ts → CLAUDE.md
- `EditarTicketUseCase` --references--> `RF-3: Edición de Tickets (rol-based ownership)`  [INFERRED]
  packages/core/src/modules/ticket/application/use-cases/editar-ticket.use-case.ts → requisitos-requerimientos.md
- `NuevoTicketPage` --references--> `RF-1: Creación de Tickets`  [INFERRED]
  next/src/app/ticket/nuevo/page.tsx → requisitos-requerimientos.md

## Communities (46 total, 8 thin omitted)

### Community 0 - "Mecánico MVVM-C (Coordinators)"
Cohesion: 0.08
Nodes (41): DashboardPage(), FichasPage(), empleadoModule, DashboardView(), FichasView(), TABS, TallerView(), DashboardVM (+33 more)

### Community 1 - "Auth & Service Locators"
Cohesion: 0.06
Nodes (40): provider, store, MOCK_EMPLEADOS, MOCK_HISTORIAL, MOCK_TICKETS, MockEmpleado, MockHistorial, MockTicket (+32 more)

### Community 2 - "Mock/PB Infrastructure"
Cohesion: 0.15
Nodes (12): Mock Mode (NEXT_PUBLIC_USE_MOCK=true), Optimistic Cache Pattern (PbStore write-through), PocketBase Real-time Subscriptions, docker-compose.mock.yml (Mock build config), PbUser, pbUserToEmpleado(), PbEmpleadoRepository, Listener (+4 more)

### Community 3 - "Admin UI Components"
Cohesion: 0.05
Nodes (67): AdminLayoutView(), AdminLayoutViewProps, HamburgerIcon(), NAV, TicketsIcon(), TriageIcon(), ColaView(), ESTADO_CFG (+59 more)

### Community 4 - "NPM Dependencies"
Cohesion: 0.05
Nodes (36): dependencies, classnames, convex, cookie, gray-matter, lint-staged, @mdx-js/loader, next (+28 more)

### Community 5 - "Ticket Domain Entity"
Cohesion: 0.33
Nodes (4): BASE, editado, original, t

### Community 6 - "HistorialEntry Domain"
Cohesion: 0.15
Nodes (10): AuditTimelineProps, HistorialEntry, HistorialEntry, HistorialEntryProps, TipoAccion, PbHistorialRepository, pbHistorialToEntity(), IHistorialRepository (+2 more)

### Community 7 - "Deployment & Architecture Docs"
Cohesion: 0.07
Nodes (28): Arquitectura de Producción, Backend PocketBase, Paquete Core Domain (@servicar/core), Frontend Next.js, Once UI Framework, 1. Desplegar PocketBase, 2. Desplegar Next.js, 3. Proxy reverso con HTTPS (Caddy — recomendado) (+20 more)

### Community 8 - "Shared Domain + Pages"
Cohesion: 0.06
Nodes (42): AdminLayout (page component), MecanicoLayout (page component), AdminCoordinator, AdminCoordinator, IMecanicoCoordinator, MecanicoCoordinator, MecanicoCoordinator, TicketCategoria (+34 more)

### Community 9 - "Auth Session Layer"
Cohesion: 0.16
Nodes (15): LoginPage(), getMockSession(), useMockAuth(), useMockCambiarEstado(), useMockCrearTicket(), useMockEditarTicket(), useMockEmpleados(), useMockHistorialByTicket() (+7 more)

### Community 10 - "TypeScript Config"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+15 more)

### Community 11 - "Aggregate Root & DTOs"
Cohesion: 0.21
Nodes (9): TicketsVM, TicketEstado, AggregateRoot, isTransicionValida(), TICKET_ESTADO_TRANSITIONS, TicketEstado, TicketProps, IGetTicketsPorEstadoQuery (+1 more)

### Community 12 - "Business Rules & ticketModule"
Cohesion: 0.15
Nodes (16): Role-based Ticket Ownership (mecánico owns, admin can all), EditarTicketDTO, TicketCamposEditables, store, IEditarTicketUseCase, IGetTicketByIdQuery, IGetTicketsQuery, GetTicketByIdQuery (+8 more)

### Community 13 - "Admin Cola (Triage) View"
Cohesion: 0.13
Nodes (14): provider, useCase, Rol, AutenticarDTO, EmpleadoProps, Sesion, SesionProps, authModule (+6 more)

### Community 14 - "Once UI Config Types"
Cohesion: 0.06
Nodes (54): NotFound(), sitemap(), Footer(), Header(), Providers(), DYNAMIC_ROUTE_PREFIXES, RouteGuard(), RouteGuardProps (+46 more)

### Community 15 - "Linter/Formatter Config"
Cohesion: 0.12
Nodes (19): files, ignoreUnknown, formatter, enabled, indentStyle, indentWidth, lineWidth, quoteStyle (+11 more)

### Community 16 - "Mock Ticket Repository"
Cohesion: 0.22
Nodes (7): Ticket State Machine (pendiente→aprobado→en_progreso→finalizado), CambiarEstadoDTO, ICambiarEstadoUseCase, r, uc, CambiarEstadoUseCase, CambiarEstadoUseCase

### Community 17 - "Root Layout & SEO"
Cohesion: 0.10
Nodes (8): Ticket, entityToPbHistorialData(), entityToPbTicketData(), pbTicketToEntity(), PbTicketRepository, IGetTicketsPorCreadorQuery, ITicketRepository, GetTicketsPorCreadorQuery

### Community 18 - "Icon Library"
Cohesion: 0.39
Nodes (8): createHistorial(), createTicket(), ensureCollection(), ensureUser(), ensureUsersSchema(), main(), pb, setRules()

### Community 19 - "IAuthSessionService"
Cohesion: 0.35
Nodes (4): MockSessionService, PbSessionService, IAuthSessionService, SessionPayload

### Community 20 - "Package.json Core"
Cohesion: 0.15
Nodes (12): dependencies, pocketbase, devDependencies, vitest, main, name, private, scripts (+4 more)

### Community 21 - "Architecture README"
Cohesion: 0.17
Nodes (11): Arquitectura, code:bash (pnpm install), code:bash (cd next), code:block3 (src/resources/once-ui.config.ts), code:block4 (src/resources/content.tsx), code:block5 (src/), Inicio rápido, Requisitos (+3 more)

### Community 22 - "Not Found & Utils"
Cohesion: 0.20
Nodes (9): 1. Instalación y Puesta en Marcha, 2. Inicialización Automática (Seeding), 3. Configuración en la Aplicación Frontend (Next.js), code:bash (PB_URL=http://<IP_SERVIDOR>:8090 \), code:env (# Desactivar la capa de mocks), Comando para ejecutar el Seed:, Configuración de PocketBase para Servicar, Requisitos de Versión (+1 more)

### Community 23 - "CLAUDE.md Instructions"
Cohesion: 0.24
Nodes (10): Architecture, Business Rules (from docs), code:block1 (servicar/), code:bash (cd react-prototipo), Convex Schema (planned), Planned Production Stack, Project Overview, react-prototipo (+2 more)

### Community 24 - "tsconfig Packages"
Cohesion: 0.22
Nodes (8): compilerOptions, lib, module, moduleResolution, skipLibCheck, strict, target, include

### Community 25 - "Domain Concepts (Docs)"
Cohesion: 0.25
Nodes (8): Entidad Ticket, Historial de Ediciones Inmutable, Máquina de Estados de Ticket, Modo Offline y Borradores, Rol Administrador, Rol Cliente, Rol Mecánico, Servicar System

### Community 26 - "Public Ticket Portal"
Cohesion: 0.35
Nodes (8): TicketPublicoPage(), ticketModule, ESTADO_CFG, formatDate(), PublicoTicketView(), TagVariant, PublicoTicketVM, usePublicoTicketViewModel()

### Community 27 - "Shell Components"
Cohesion: 0.33
Nodes (5): CrearTicketDTO, ICrearTicketUseCase, DTO, makeRepo(), CrearTicketUseCase

### Community 29 - "Workspace Root Package"
Cohesion: 0.50
Nodes (3): name, private, workspaces

### Community 30 - "RouteGuard"
Cohesion: 0.33
Nodes (5): Requisitos y Requerimientos de la aplicacion, RF-1 Creacion de tikets, RF-2 Vista de tikets, RF-3 Edicion de tikets, RnF-2.1

### Community 44 - "Community 44"
Cohesion: 0.33
Nodes (5): 1. Colección `users` (Colección de tipo Auth), 2. Colección `tickets` (Colección de tipo Base), 3. Colección `historial_ediciones` (Colección de tipo Base), Esquemas de Base de Datos en PocketBase, Particularidad de PocketBase v0.23+

### Community 45 - "Community 45"
Cohesion: 0.40
Nodes (4): Explicación de las Reglas, Reglas de Seguridad y API en PocketBase, Separación de Responsabilidades: API Rules vs Reglas de Dominio, Tabla de Reglas de Acceso (API Rules)

## Knowledge Gaps
- **192 isolated node(s):** `name`, `private`, `workspaces`, `$schema`, `clientKind` (+187 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Ticket` connect `Root Layout & SEO` to `Mecánico MVVM-C (Coordinators)`, `Auth & Service Locators`, `Admin UI Components`, `Ticket Domain Entity`, `HistorialEntry Domain`, `Deployment & Architecture Docs`, `Shared Domain + Pages`, `Aggregate Root & DTOs`, `Business Rules & ticketModule`, `Mock Ticket Repository`, `Domain Concepts (Docs)`, `Public Ticket Portal`, `Shell Components`, `Ticket Entity Tests`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Why does `ITicketRepository` connect `Root Layout & SEO` to `Auth & Service Locators`, `Mock/PB Infrastructure`, `Admin UI Components`, `HistorialEntry Domain`, `Deployment & Architecture Docs`, `Aggregate Root & DTOs`, `Business Rules & ticketModule`, `Mock Ticket Repository`, `Shell Components`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `Empleado` connect `Admin UI Components` to `Mecánico MVVM-C (Coordinators)`, `Auth & Service Locators`, `Mock/PB Infrastructure`, `HistorialEntry Domain`, `Shared Domain + Pages`, `Auth Session Layer`, `Aggregate Root & DTOs`, `Business Rules & ticketModule`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Ticket` (e.g. with `Entidad Ticket` and `Paquete Core Domain (@servicar/core)`) actually correct?**
  _`Ticket` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `workspaces` to the rest of the system?**
  _195 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Mecánico MVVM-C (Coordinators)` be split into smaller, more focused modules?**
  _Cohesion score 0.08123904149620105 - nodes in this community are weakly interconnected._
- **Should `Auth & Service Locators` be split into smaller, more focused modules?**
  _Cohesion score 0.056679151061173536 - nodes in this community are weakly interconnected._