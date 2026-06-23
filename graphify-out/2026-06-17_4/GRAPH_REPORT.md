# Graph Report - servicar  (2026-06-17)

## Corpus Check
- 167 files · ~46,685 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 774 nodes · 1653 edges · 55 communities (48 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `be30887b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Interfaz y Formularios de Tickets|Interfaz y Formularios de Tickets]]
- [[_COMMUNITY_Casos de Uso y Reglas de Negocio de Tickets|Casos de Uso y Reglas de Negocio de Tickets]]
- [[_COMMUNITY_Configuración de Compilación TypeScript (Next.js)|Configuración de Compilación TypeScript (Next.js)]]
- [[_COMMUNITY_Dominio de Empleados y Control de Acceso|Dominio de Empleados y Control de Acceso]]
- [[_COMMUNITY_Coordinadores y Controladores de Navegación|Coordinadores y Controladores de Navegación]]
- [[_COMMUNITY_Gestión de Sesión e Identidad del Empleado|Gestión de Sesión e Identidad del Empleado]]
- [[_COMMUNITY_Capa de Persistencia Simulada (Mock)|Capa de Persistencia Simulada (Mock)]]
- [[_COMMUNITY_Gestión de Dependencias (package.json)|Gestión de Dependencias (package.json)]]
- [[_COMMUNITY_Reglas de Calidad y Estilo de Código (Biome)|Reglas de Calidad y Estilo de Código (Biome)]]
- [[_COMMUNITY_Mapeo de Rutas de Compilación|Mapeo de Rutas de Compilación]]
- [[_COMMUNITY_Configuración del Formateador de Código|Configuración del Formateador de Código]]
- [[_COMMUNITY_Estructura y Maquetación Principal (Layout)|Estructura y Maquetación Principal (Layout)]]
- [[_COMMUNITY_Configuración del Sistema de Diseño Once UI|Configuración del Sistema de Diseño Once UI]]
- [[_COMMUNITY_Capa de Acceso a Datos de PocketBase|Capa de Acceso a Datos de PocketBase]]
- [[_COMMUNITY_Entidad de Dominio y Modelo de Ticket|Entidad de Dominio y Modelo de Ticket]]
- [[_COMMUNITY_Tipos de Recursos y Catálogo de Iconos|Tipos de Recursos y Catálogo de Iconos]]
- [[_COMMUNITY_Servicios de Autenticación de Sesión|Servicios de Autenticación de Sesión]]
- [[_COMMUNITY_Configuración del Paquete Core|Configuración del Paquete Core]]
- [[_COMMUNITY_Utilidades de Enrutamiento y Datos MDX|Utilidades de Enrutamiento y Datos MDX]]
- [[_COMMUNITY_Panel de Administración y Control de Cola|Panel de Administración y Control de Cola]]
- [[_COMMUNITY_Entorno TypeScript del Core|Entorno TypeScript del Core]]
- [[_COMMUNITY_Componentes Comunes de la Interfaz (CabeceraPie)|Componentes Comunes de la Interfaz (Cabecera/Pie)]]
- [[_COMMUNITY_Glosario y Reglas de Negocio (CLAUDE.mdREADME.md)|Glosario y Reglas de Negocio (CLAUDE.md/README.md)]]
- [[_COMMUNITY_Repositorio de Tickets de PocketBase|Repositorio de Tickets de PocketBase]]
- [[_COMMUNITY_Pruebas Unitarias de la Entidad Ticket|Pruebas Unitarias de la Entidad Ticket]]
- [[_COMMUNITY_Arquitectura de Despliegue y Orquestación Docker|Arquitectura de Despliegue y Orquestación Docker]]
- [[_COMMUNITY_Guardas y Políticas de Seguridad de Rutas|Guardas y Políticas de Seguridad de Rutas]]
- [[_COMMUNITY_Raíz del Monorepo y Espacios de Trabajo|Raíz del Monorepo y Espacios de Trabajo]]
- [[_COMMUNITY_Configuración del Build y Bundler de Next.js|Configuración del Build y Bundler de Next.js]]
- [[_COMMUNITY_Configuración de Calidad del Código con ESLint|Configuración de Calidad del Código con ESLint]]
- [[_COMMUNITY_Configuración del Espacio de Trabajo en VS Code|Configuración del Espacio de Trabajo en VS Code]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]

## God Nodes (most connected - your core abstractions)
1. `Ticket` - 78 edges
2. `Empleado` - 50 edges
3. `MockStore` - 35 edges
4. `TicketEstado` - 35 edges
5. `PbStore` - 29 edges
6. `HistorialEntry` - 28 edges
7. `useStoreReactive()` - 23 edges
8. `TicketCategoria` - 22 edges
9. `ITicketRepository` - 22 edges
10. `compilerOptions` - 17 edges

## Surprising Connections (you probably didn't know these)
- `Ticket` --references--> `Paquete Core Domain (@servicar/core)`  [INFERRED]
  packages/core/src/modules/ticket/domain/entities/ticket.entity.ts → next/README.md
- `PbTicketRepository` --conceptually_related_to--> `Backend PocketBase`  [INFERRED]
  packages/core/src/modules/ticket/infrastructure/persistence/pocketbase/pb-ticket.repository.ts → DEPLOY.md
- `Ticket` --conceptually_related_to--> `Entidad Ticket`  [INFERRED]
  packages/core/src/modules/ticket/domain/entities/ticket.entity.ts → CLAUDE.md
- `TicketCardProps` --references--> `Ticket`  [EXTRACTED]
  next/src/presentation/views/shared/TicketCard.tsx → packages/core/src/modules/ticket/domain/entities/ticket.entity.ts
- `AdminLayoutVM` --references--> `Empleado`  [EXTRACTED]
  next/src/presentation/view-models/admin/useAdminLayout.view-model.ts → packages/core/src/modules/empleado/domain/entities/empleado.entity.ts

## Communities (55 total, 7 thin omitted)

### Community 0 - "Interfaz y Formularios de Tickets"
Cohesion: 0.16
Nodes (10): CambiarEstadoDTO, ICambiarEstadoUseCase, IGetTicketByIdQuery, IGetTicketsPorCreadorQuery, IGetTicketsQuery, ITicketRepository, GetTicketByIdQuery, GetTicketsPorCreadorQuery (+2 more)

### Community 1 - "Casos de Uso y Reglas de Negocio de Tickets"
Cohesion: 0.16
Nodes (11): DashboardPage(), DashboardView(), DashboardVM, useDashboardViewModel(), FilterEstado, FILTROS, TallerVM, ESTADO_CFG (+3 more)

### Community 2 - "Configuración de Compilación TypeScript (Next.js)"
Cohesion: 0.05
Nodes (32): provider, store, MOCK_EMPLEADOS, MOCK_HISTORIAL, MOCK_TICKETS, MockEmpleado, MockHistorial, MockTicket (+24 more)

### Community 3 - "Dominio de Empleados y Control de Acceso"
Cohesion: 0.13
Nodes (9): AggregateRoot, Empleado, pbUserToEmpleado(), PbEmpleadoRepository, IEmpleadoRepository, IGetEmpleadoByIdQuery, IGetEmpleadosQuery, GetEmpleadoByIdQuery (+1 more)

### Community 4 - "Coordinadores y Controladores de Navegación"
Cohesion: 0.05
Nodes (36): dependencies, classnames, convex, cookie, gray-matter, lint-staged, @mdx-js/loader, next (+28 more)

### Community 5 - "Gestión de Sesión e Identidad del Empleado"
Cohesion: 0.08
Nodes (23): 1. Desplegar PocketBase, 2. Desplegar Next.js, 3. Proxy reverso con HTTPS (Caddy — recomendado), Actualizar a una nueva versión, Arquitectura de producción, code:block1 (Internet), code:bash (# 1. Traer cambios), code:bash (docker compose -f docker-compose.pocketbase.yml logs pocketb) (+15 more)

### Community 6 - "Capa de Persistencia Simulada (Mock)"
Cohesion: 0.22
Nodes (6): AdminLayoutView(), AdminLayoutViewProps, NAV, AdminLayout(), AdminLayoutVM, useAdminLayoutViewModel()

### Community 7 - "Gestión de Dependencias (package.json)"
Cohesion: 0.09
Nodes (8): HistorialEntry, HistorialEntryProps, TipoAccion, PbHistorialRepository, IHistorialRepository, IGetHistorialQuery, GetHistorialQuery, Matricula

### Community 8 - "Reglas de Calidad y Estilo de Código (Biome)"
Cohesion: 0.16
Nodes (16): useAuth(), LoginPage(), getMockSession(), useMockAuth(), useMockCambiarEstado(), useMockCrearTicket(), useMockEditarTicket(), useMockEmpleados() (+8 more)

### Community 9 - "Mapeo de Rutas de Compilación"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+15 more)

### Community 10 - "Configuración del Formateador de Código"
Cohesion: 0.10
Nodes (19): files, ignoreUnknown, formatter, enabled, indentStyle, indentWidth, lineWidth, quoteStyle (+11 more)

### Community 11 - "Estructura y Maquetación Principal (Layout)"
Cohesion: 0.17
Nodes (10): Providers(), StoreProvider(), appMeta, home, dataStyle, display, effects, fonts (+2 more)

### Community 12 - "Configuración del Sistema de Diseño Once UI"
Cohesion: 0.16
Nodes (16): body, code, heading, label, DataStyleConfig, DisplayConfig, EffectsConfig, FontsConfig (+8 more)

### Community 13 - "Capa de Acceso a Datos de PocketBase"
Cohesion: 0.14
Nodes (10): ColaVM, PendingAction, AlertBanner(), AlertBannerProps, AlertType, TYPE_CFG, FabButton(), FabButtonProps (+2 more)

### Community 15 - "Tipos de Recursos y Catálogo de Iconos"
Cohesion: 0.14
Nodes (12): IconLibrary, IconName, About, BasePageConfig, Blog, Gallery, Home, IANATimeZone (+4 more)

### Community 16 - "Servicios de Autenticación de Sesión"
Cohesion: 0.25
Nodes (4): MockSessionService, PbSessionService, IAuthSessionService, SessionPayload

### Community 17 - "Configuración del Paquete Core"
Cohesion: 0.15
Nodes (12): dependencies, pocketbase, devDependencies, vitest, main, name, private, scripts (+4 more)

### Community 18 - "Utilidades de Enrutamiento y Datos MDX"
Cohesion: 0.24
Nodes (9): NotFound(), sitemap(), routes, getMDXData(), getMDXFiles(), getPosts(), Metadata, readMDXFile() (+1 more)

### Community 19 - "Panel de Administración y Control de Cola"
Cohesion: 0.12
Nodes (13): provider, useCase, Rol, AutenticarDTO, EmpleadoProps, Sesion, SesionProps, authModule (+5 more)

### Community 20 - "Entorno TypeScript del Core"
Cohesion: 0.22
Nodes (8): compilerOptions, lib, module, moduleResolution, skipLibCheck, strict, target, include

### Community 21 - "Componentes Comunes de la Interfaz (Cabecera/Pie)"
Cohesion: 0.39
Nodes (4): Footer(), Header(), ScrollToHash(), ThemeToggle()

### Community 22 - "Glosario y Reglas de Negocio (CLAUDE.md/README.md)"
Cohesion: 0.25
Nodes (8): Entidad Ticket, Historial de Ediciones Inmutable, Máquina de Estados de Ticket, Modo Offline y Borradores, Rol Administrador, Rol Cliente, Rol Mecánico, Servicar System

### Community 23 - "Repositorio de Tickets de PocketBase"
Cohesion: 0.20
Nodes (4): AdminCoordinator, IAdminCoordinator, IMecanicoCoordinator, IRouter

### Community 24 - "Pruebas Unitarias de la Entidad Ticket"
Cohesion: 0.33
Nodes (4): BASE, editado, original, t

### Community 25 - "Arquitectura de Despliegue y Orquestación Docker"
Cohesion: 0.18
Nodes (6): Arquitectura de Producción, Backend PocketBase, Paquete Core Domain (@servicar/core), Frontend Next.js, Once UI Framework, PbTicketRepository

### Community 26 - "Guardas y Políticas de Seguridad de Rutas"
Cohesion: 0.40
Nodes (4): DYNAMIC_ROUTE_PREFIXES, RouteGuard(), RouteGuardProps, protectedRoutes

### Community 27 - "Raíz del Monorepo y Espacios de Trabajo"
Cohesion: 0.50
Nodes (3): name, private, workspaces

### Community 37 - "Community 37"
Cohesion: 0.17
Nodes (9): isTransicionValida(), TICKET_ESTADO_TRANSITIONS, TicketEstado, TicketProps, IGetTicketsPorEstadoQuery, GetTicketsPorEstadoQuery, r, uc (+1 more)

### Community 38 - "Community 38"
Cohesion: 0.17
Nodes (10): Architecture, Business Rules (from docs), code:block1 (servicar/), code:bash (cd react-prototipo), Convex Schema (planned), Planned Production Stack, Project Overview, react-prototipo (+2 more)

### Community 39 - "Community 39"
Cohesion: 0.17
Nodes (11): Arquitectura, code:bash (pnpm install), code:bash (cd next), code:block3 (src/resources/once-ui.config.ts), code:block4 (src/resources/content.tsx), code:block5 (src/), Inicio rápido, Requisitos (+3 more)

### Community 40 - "Community 40"
Cohesion: 0.29
Nodes (6): ESTADO_CFG, HistorialView(), HistorialTab, HistorialVM, useHistorialViewModel(), HistorialPage()

### Community 41 - "Community 41"
Cohesion: 0.19
Nodes (4): PbUser, PbStore, PbHistorial, PbTicket

### Community 42 - "Community 42"
Cohesion: 0.17
Nodes (14): TicketCategoria, WORKSHOP_CATEGORIAS, EditarTicketPage(), MockDraft, NuevoTicketPage(), EditarTicketView(), NuevoTicketView(), EditarTicketFormState (+6 more)

### Community 43 - "Community 43"
Cohesion: 0.25
Nodes (5): TABS, FichasVM, FichaTab, ViewHeader(), ViewHeaderProps

### Community 44 - "Community 44"
Cohesion: 0.32
Nodes (6): MecanicoLayout(), MecanicoLayoutView(), MecanicoLayoutViewProps, NAV_TABS, MecanicoLayoutVM, useMecanicoLayoutViewModel()

### Community 45 - "Community 45"
Cohesion: 0.36
Nodes (6): Action, useStoreReactive(), empleadoModule, store, ticketModule, EMPTY

### Community 46 - "Community 46"
Cohesion: 0.13
Nodes (7): MecanicoCoordinator, FichasPage(), FichasView(), TallerView(), useFichasViewModel(), useTallerViewModel(), TallerPage()

### Community 47 - "Community 47"
Cohesion: 0.36
Nodes (5): Listener, entityToPbHistorialData(), entityToPbTicketData(), pbHistorialToEntity(), pbTicketToEntity()

### Community 48 - "Community 48"
Cohesion: 0.28
Nodes (5): ESTADO_ACTIONS, TicketsView(), TicketsVM, useTicketsViewModel(), TicketsAdminPage()

### Community 52 - "Community 52"
Cohesion: 0.42
Nodes (4): EditarTicketDTO, TicketCamposEditables, IEditarTicketUseCase, EditarTicketUseCase

### Community 53 - "Community 53"
Cohesion: 0.46
Nodes (3): CrearTicketDTO, ICrearTicketUseCase, CrearTicketUseCase

### Community 54 - "Community 54"
Cohesion: 0.67
Nodes (3): ColaView(), useColaViewModel(), ColaPage()

## Knowledge Gaps
- **194 isolated node(s):** `name`, `private`, `workspaces`, `$schema`, `enabled` (+189 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Ticket` connect `Entidad de Dominio y Modelo de Ticket` to `Interfaz y Formularios de Tickets`, `Casos de Uso y Reglas de Negocio de Tickets`, `Configuración de Compilación TypeScript (Next.js)`, `Dominio de Empleados y Control de Acceso`, `Community 37`, `Gestión de Dependencias (package.json)`, `Community 40`, `Community 42`, `Community 43`, `Community 45`, `Capa de Acceso a Datos de PocketBase`, `Community 47`, `Community 48`, `Community 53`, `Glosario y Reglas de Negocio (CLAUDE.md/README.md)`, `Pruebas Unitarias de la Entidad Ticket`, `Arquitectura de Despliegue y Orquestación Docker`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Why does `Empleado` connect `Dominio de Empleados y Control de Acceso` to `Casos de Uso y Reglas de Negocio de Tickets`, `Configuración de Compilación TypeScript (Next.js)`, `Capa de Persistencia Simulada (Mock)`, `Community 40`, `Reglas de Calidad y Estilo de Código (Biome)`, `Community 42`, `Community 43`, `Community 44`, `Capa de Acceso a Datos de PocketBase`, `Community 45`, `Community 48`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `PbStore` connect `Community 41` to `Dominio de Empleados y Control de Acceso`, `Gestión de Dependencias (package.json)`, `Estructura y Maquetación Principal (Layout)`, `Community 45`, `Community 47`, `Arquitectura de Despliegue y Orquestación Docker`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Ticket` (e.g. with `Entidad Ticket` and `Paquete Core Domain (@servicar/core)`) actually correct?**
  _`Ticket` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `workspaces` to the rest of the system?**
  _196 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Configuración de Compilación TypeScript (Next.js)` be split into smaller, more focused modules?**
  _Cohesion score 0.051251956181533644 - nodes in this community are weakly interconnected._
- **Should `Dominio de Empleados y Control de Acceso` be split into smaller, more focused modules?**
  _Cohesion score 0.1265597147950089 - nodes in this community are weakly interconnected._