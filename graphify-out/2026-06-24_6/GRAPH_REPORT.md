# Graph Report - servicar  (2026-06-24)

## Corpus Check
- 182 files · ~53,278 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 999 nodes · 2619 edges · 51 communities (43 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `416a9992`
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
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Admin Cola (Triage) View|Admin Cola (Triage) View]]
- [[_COMMUNITY_Once UI Config Types|Once UI Config Types]]
- [[_COMMUNITY_LinterFormatter Config|Linter/Formatter Config]]
- [[_COMMUNITY_Community 16|Community 16]]
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
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
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
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]

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

## Communities (51 total, 8 thin omitted)

### Community 0 - "Mecánico MVVM-C (Coordinators)"
Cohesion: 0.09
Nodes (39): FichasPage(), DashboardView(), FichasView(), TABS, TallerView(), FichasVM, FichaTab, useFichasViewModel() (+31 more)

### Community 1 - "Auth & Service Locators"
Cohesion: 0.07
Nodes (32): provider, store, TicketCategoria, TicketCategoria, LoginPage(), MOCK_EMPLEADOS, MOCK_HISTORIAL, MOCK_TICKETS (+24 more)

### Community 2 - "Mock/PB Infrastructure"
Cohesion: 0.05
Nodes (44): 1. Arquitectura de Despliegue de Next.js, 2. Contexto de Construcción en Railway (Crucial), 3. Variables de Entorno y Argumentos de Construcción (Build Args), 4. Paso a Paso para Desplegar en Railway, 5. Resolución de Problemas Comunes (Troubleshooting), 6. Despliegue Directo en VPS (Sin Docker / Node.js Nativo), code:block1 (/ (Raíz del Repositorio)), code:bash (PORT=3000 HOSTNAME=0.0.0.0 pm2 start next/.next/standalone/s) (+36 more)

### Community 3 - "Admin UI Components"
Cohesion: 0.05
Nodes (80): AdminLayoutView(), AdminLayoutViewProps, HamburgerIcon(), NAV, TicketsIcon(), TriageIcon(), ColaView(), AdminLayout() (+72 more)

### Community 4 - "NPM Dependencies"
Cohesion: 0.05
Nodes (36): dependencies, classnames, convex, cookie, gray-matter, lint-staged, @mdx-js/loader, next (+28 more)

### Community 5 - "Ticket Domain Entity"
Cohesion: 0.13
Nodes (23): ESTADO_CFG, HistorialView(), ESTADO_ACTIONS, KanbanColumn(), TicketsView(), HistorialTab, HistorialVM, HistorialTab (+15 more)

### Community 6 - "HistorialEntry Domain"
Cohesion: 0.14
Nodes (8): AuditTimelineProps, HistorialEntry, HistorialEntry, MockHistorialRepository, mockHistorialToEntity(), IHistorialRepository, IGetHistorialQuery, GetHistorialQuery

### Community 7 - "Deployment & Architecture Docs"
Cohesion: 0.07
Nodes (28): Arquitectura de Producción, Backend PocketBase, Paquete Core Domain (@servicar/core), Frontend Next.js, Once UI Framework, 1. Desplegar PocketBase, 2. Desplegar Next.js, 3. Proxy reverso con HTTPS (Caddy — recomendado) (+20 more)

### Community 8 - "Shared Domain + Pages"
Cohesion: 0.13
Nodes (11): Empleado, DashboardVM, mockEmpleadoToEntity(), MockEmpleadoRepository, pbUserToEmpleado(), PbEmpleadoRepository, IEmpleadoRepository, IGetEmpleadoByIdQuery (+3 more)

### Community 9 - "Auth Session Layer"
Cohesion: 0.24
Nodes (14): getMockSession(), useMockAuth(), useMockCambiarEstado(), useMockCrearTicket(), useMockEditarTicket(), useMockEmpleados(), useMockHistorialByTicket(), useMockSignIn() (+6 more)

### Community 10 - "TypeScript Config"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+15 more)

### Community 11 - "Aggregate Root & DTOs"
Cohesion: 0.11
Nodes (19): 1. Añadir Volumen de Persistencia (Crucial), 1. Añadir Volumen de Persistencia (Crucial), 2. Configurar Variables de Entorno del Servicio:, Arquitectura en Railway, code:block1 (Usuario (Navegador)), code:dockerfile (FROM alpine:3.19), code:bash (2026/06/24 18:00:00 Server started at http://0.0.0.0:8080), code:bash (PB_URL=https://tu-servicio-pb.up.railway.app \) (+11 more)

### Community 12 - "Community 12"
Cohesion: 0.19
Nodes (13): HistorialEntryProps, entityToMockHistorial(), entityToMockTicket(), mockTicketToEntity(), MockTicketRepository, actualizado, hist, historial (+5 more)

### Community 13 - "Admin Cola (Triage) View"
Cohesion: 0.11
Nodes (18): provider, useCase, AggregateRoot, Rol, WORKSHOP_CATEGORIAS, isTransicionValida(), TICKET_ESTADO_TRANSITIONS, AutenticarDTO (+10 more)

### Community 14 - "Once UI Config Types"
Cohesion: 0.06
Nodes (54): NotFound(), sitemap(), Footer(), Header(), Providers(), DYNAMIC_ROUTE_PREFIXES, RouteGuard(), RouteGuardProps (+46 more)

### Community 15 - "Linter/Formatter Config"
Cohesion: 0.12
Nodes (19): files, ignoreUnknown, formatter, enabled, indentStyle, indentWidth, lineWidth, quoteStyle (+11 more)

### Community 16 - "Community 16"
Cohesion: 0.09
Nodes (5): Ticket, IGetTicketByIdQuery, IGetTicketsPorEstadoQuery, GetTicketByIdQuery, GetTicketsPorEstadoQuery

### Community 17 - "Root Layout & SEO"
Cohesion: 0.15
Nodes (13): Mock Mode (NEXT_PUBLIC_USE_MOCK=true), Optimistic Cache Pattern (PbStore write-through), PocketBase Real-time Subscriptions, docker-compose.mock.yml (Mock build config), TipoAccion, PbUser, PbHistorialRepository, Listener (+5 more)

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

### Community 27 - "Community 27"
Cohesion: 0.22
Nodes (7): entityToPbHistorialData(), entityToPbTicketData(), pbTicketToEntity(), PbTicketRepository, IGetTicketsPorCreadorQuery, ITicketRepository, GetTicketsPorCreadorQuery

### Community 28 - "Community 28"
Cohesion: 0.18
Nodes (10): Ticket State Machine (pendiente→aprobado→en_progreso→finalizado), CambiarEstadoDTO, CrearTicketDTO, ICambiarEstadoUseCase, ICrearTicketUseCase, r, uc, CambiarEstadoUseCase (+2 more)

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

### Community 47 - "Community 47"
Cohesion: 0.23
Nodes (4): TicketProps, DTO, makeRepo(), Matricula

### Community 48 - "Community 48"
Cohesion: 0.33
Nodes (4): BASE, editado, original, t

### Community 49 - "Community 49"
Cohesion: 0.26
Nodes (9): Role-based Ticket Ownership (mecánico owns, admin can all), EditarTicketDTO, TicketCamposEditables, IEditarTicketUseCase, RF-3: Edición de Tickets (rol-based ownership), makeRepo(), ticketDe(), EditarTicketUseCase (+1 more)

## Knowledge Gaps
- **241 isolated node(s):** `name`, `private`, `workspaces`, `$schema`, `clientKind` (+236 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Ticket` connect `Community 16` to `Mecánico MVVM-C (Coordinators)`, `Auth & Service Locators`, `Admin UI Components`, `Ticket Domain Entity`, `HistorialEntry Domain`, `Deployment & Architecture Docs`, `Shared Domain + Pages`, `Community 12`, `Admin Cola (Triage) View`, `Community 47`, `Community 48`, `Community 49`, `Root Layout & SEO`, `Community 50`, `Domain Concepts (Docs)`, `Public Ticket Portal`, `Community 27`, `Community 28`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Why does `ITicketRepository` connect `Community 27` to `Auth & Service Locators`, `Admin UI Components`, `Ticket Domain Entity`, `Deployment & Architecture Docs`, `Community 12`, `Admin Cola (Triage) View`, `Community 47`, `Community 16`, `Community 49`, `Community 50`, `Root Layout & SEO`, `Community 28`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `Empleado` connect `Shared Domain + Pages` to `Mecánico MVVM-C (Coordinators)`, `Auth & Service Locators`, `Admin UI Components`, `Ticket Domain Entity`, `HistorialEntry Domain`, `Auth Session Layer`, `Admin Cola (Triage) View`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Ticket` (e.g. with `Entidad Ticket` and `Paquete Core Domain (@servicar/core)`) actually correct?**
  _`Ticket` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `workspaces` to the rest of the system?**
  _244 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Mecánico MVVM-C (Coordinators)` be split into smaller, more focused modules?**
  _Cohesion score 0.08525506638714186 - nodes in this community are weakly interconnected._
- **Should `Auth & Service Locators` be split into smaller, more focused modules?**
  _Cohesion score 0.06663141195134849 - nodes in this community are weakly interconnected._