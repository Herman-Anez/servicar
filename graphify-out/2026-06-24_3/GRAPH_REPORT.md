# Graph Report - servicar  (2026-06-24)

## Corpus Check
- 181 files · ~51,031 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 952 nodes · 2567 edges · 43 communities (36 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `70a7c071`
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
- [[_COMMUNITY_Admin Cola (Triage) View|Admin Cola (Triage) View]]
- [[_COMMUNITY_Once UI Config Types|Once UI Config Types]]
- [[_COMMUNITY_LinterFormatter Config|Linter/Formatter Config]]
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
- [[_COMMUNITY_Community 46|Community 46]]

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

## Communities (43 total, 7 thin omitted)

### Community 0 - "Mecánico MVVM-C (Coordinators)"
Cohesion: 0.07
Nodes (42): MecanicoCoordinator, MecanicoCoordinator, DashboardPage(), FichasPage(), DashboardView(), FichasView(), TABS, TallerView() (+34 more)

### Community 1 - "Auth & Service Locators"
Cohesion: 0.06
Nodes (38): TicketCategoria, TicketCategoria, WORKSHOP_CATEGORIAS, HistorialEntryProps, TicketProps, MOCK_EMPLEADOS, MOCK_HISTORIAL, MOCK_TICKETS (+30 more)

### Community 2 - "Mock/PB Infrastructure"
Cohesion: 0.13
Nodes (14): Mock Mode (NEXT_PUBLIC_USE_MOCK=true), Optimistic Cache Pattern (PbStore write-through), PocketBase Real-time Subscriptions, docker-compose.mock.yml (Mock build config), PbUser, pbUserToEmpleado(), PbEmpleadoRepository, PbHistorialRepository (+6 more)

### Community 3 - "Admin UI Components"
Cohesion: 0.06
Nodes (70): AdminLayoutView(), AdminLayoutViewProps, HamburgerIcon(), NAV, TicketsIcon(), TriageIcon(), AdminLayout(), AdminLayoutVM (+62 more)

### Community 4 - "NPM Dependencies"
Cohesion: 0.05
Nodes (36): dependencies, classnames, convex, cookie, gray-matter, lint-staged, @mdx-js/loader, next (+28 more)

### Community 5 - "Ticket Domain Entity"
Cohesion: 0.33
Nodes (4): BASE, editado, original, t

### Community 6 - "HistorialEntry Domain"
Cohesion: 0.09
Nodes (17): ESTADO_CFG, HistorialView(), HistorialTab, HistorialVM, HistorialTab, AuditTimeline(), AuditTimelineProps, InfoRow() (+9 more)

### Community 7 - "Deployment & Architecture Docs"
Cohesion: 0.07
Nodes (28): Arquitectura de Producción, Backend PocketBase, Paquete Core Domain (@servicar/core), Frontend Next.js, Once UI Framework, 1. Desplegar PocketBase, 2. Desplegar Next.js, 3. Proxy reverso con HTTPS (Caddy — recomendado) (+20 more)

### Community 8 - "Shared Domain + Pages"
Cohesion: 0.07
Nodes (33): ColaView(), ESTADO_ACTIONS, KanbanColumn(), TicketsView(), ColaVM, PendingAction, ColaVM, PendingAction (+25 more)

### Community 9 - "Auth Session Layer"
Cohesion: 0.16
Nodes (15): LoginPage(), getMockSession(), useMockAuth(), useMockCambiarEstado(), useMockCrearTicket(), useMockEditarTicket(), useMockEmpleados(), useMockHistorialByTicket() (+7 more)

### Community 10 - "TypeScript Config"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+15 more)

### Community 11 - "Aggregate Root & DTOs"
Cohesion: 0.11
Nodes (17): 1. Añadir Volumen de Persistencia (Crucial), 2. Configurar Variables de Entorno del Servicio:, Arquitectura en Railway, code:block1 (Usuario (Navegador)), code:dockerfile (FROM alpine:3.19), code:bash (PB_URL=https://tu-servicio-pb.up.railway.app \), Configuración Crítica en Railway para PocketBase:, Guía de Integración y Despliegue en Railway (PocketBase + Next.js) (+9 more)

### Community 13 - "Admin Cola (Triage) View"
Cohesion: 0.12
Nodes (16): provider, useCase, provider, store, Rol, AutenticarDTO, EmpleadoProps, Sesion (+8 more)

### Community 14 - "Once UI Config Types"
Cohesion: 0.05
Nodes (55): NotFound(), sitemap(), Footer(), Header(), Providers(), DYNAMIC_ROUTE_PREFIXES, RouteGuard(), RouteGuardProps (+47 more)

### Community 15 - "Linter/Formatter Config"
Cohesion: 0.12
Nodes (19): files, ignoreUnknown, formatter, enabled, indentStyle, indentWidth, lineWidth, quoteStyle (+11 more)

### Community 17 - "Root Layout & SEO"
Cohesion: 0.05
Nodes (42): Role-based Ticket Ownership (mecánico owns, admin can all), Ticket State Machine (pendiente→aprobado→en_progreso→finalizado), AggregateRoot, isTransicionValida(), TICKET_ESTADO_TRANSITIONS, TicketEstado, CambiarEstadoDTO, CrearTicketDTO (+34 more)

### Community 18 - "Icon Library"
Cohesion: 0.39
Nodes (8): createHistorial(), createTicket(), ensureCollection(), ensureUser(), ensureUsersSchema(), main(), pb, setRules()

### Community 19 - "IAuthSessionService"
Cohesion: 0.33
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
Cohesion: 0.40
Nodes (7): TicketPublicoPage(), ESTADO_CFG, formatDate(), PublicoTicketView(), TagVariant, PublicoTicketVM, usePublicoTicketViewModel()

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

### Community 46 - "Community 46"
Cohesion: 0.08
Nodes (24): 1. Declaración explícita de campos `autodate`, 1. Síntomas y Diagnóstico Inicial, 2. Aplanado de campos `select`, 2. Causas Raíz (El porqué del fallo), 3. Sincronización activa de esquemas en `ensureCollection`, 3. Soluciones Implementadas, 4. Mezcla segura de campos en `users`, 4. Resultados Obtenidos (+16 more)

## Knowledge Gaps
- **215 isolated node(s):** `name`, `private`, `workspaces`, `$schema`, `clientKind` (+210 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Ticket` connect `Root Layout & SEO` to `Mecánico MVVM-C (Coordinators)`, `Auth & Service Locators`, `Admin UI Components`, `Ticket Domain Entity`, `HistorialEntry Domain`, `Deployment & Architecture Docs`, `Shared Domain + Pages`, `Domain Concepts (Docs)`, `Public Ticket Portal`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Why does `ITicketRepository` connect `Root Layout & SEO` to `Auth & Service Locators`, `Mock/PB Infrastructure`, `Admin UI Components`, `Deployment & Architecture Docs`, `Shared Domain + Pages`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `Empleado` connect `Shared Domain + Pages` to `Mecánico MVVM-C (Coordinators)`, `Mock/PB Infrastructure`, `Admin UI Components`, `HistorialEntry Domain`, `Auth Session Layer`, `Root Layout & SEO`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Ticket` (e.g. with `Entidad Ticket` and `Paquete Core Domain (@servicar/core)`) actually correct?**
  _`Ticket` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `workspaces` to the rest of the system?**
  _218 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Mecánico MVVM-C (Coordinators)` be split into smaller, more focused modules?**
  _Cohesion score 0.07192460317460317 - nodes in this community are weakly interconnected._
- **Should `Auth & Service Locators` be split into smaller, more focused modules?**
  _Cohesion score 0.06241519674355495 - nodes in this community are weakly interconnected._