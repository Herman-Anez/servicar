# Graph Report - .  (2026-06-16)

## Corpus Check
- 171 files · ~46,262 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 700 nodes · 1542 edges · 37 communities (32 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 1,250 input · 480 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Raíz del Monorepo y Espacios de Trabajo|Raíz del Monorepo y Espacios de Trabajo]]
- [[_COMMUNITY_Configuración del Formateador de Código|Configuración del Formateador de Código]]
- [[_COMMUNITY_Coordinadores y Controladores de Navegación|Coordinadores y Controladores de Navegación]]
- [[_COMMUNITY_Mapeo de Rutas de Compilación|Mapeo de Rutas de Compilación]]
- [[_COMMUNITY_Configuración de Calidad del Código con ESLint|Configuración de Calidad del Código con ESLint]]
- [[_COMMUNITY_Configuración del Build y Bundler de Next.js|Configuración del Build y Bundler de Next.js]]
- [[_COMMUNITY_Configuración del Espacio de Trabajo en VS Code|Configuración del Espacio de Trabajo en VS Code]]
- [[_COMMUNITY_Casos de Uso y Reglas de Negocio de Tickets|Casos de Uso y Reglas de Negocio de Tickets]]
- [[_COMMUNITY_Capa de Persistencia Simulada (Mock)|Capa de Persistencia Simulada (Mock)]]
- [[_COMMUNITY_Gestión de Dependencias (package.json)|Gestión de Dependencias (package.json)]]
- [[_COMMUNITY_Panel de Administración y Control de Cola|Panel de Administración y Control de Cola]]
- [[_COMMUNITY_Reglas de Calidad y Estilo de Código (Biome)|Reglas de Calidad y Estilo de Código (Biome)]]
- [[_COMMUNITY_Estructura y Maquetación Principal (Layout)|Estructura y Maquetación Principal (Layout)]]
- [[_COMMUNITY_Servicios de Autenticación de Sesión|Servicios de Autenticación de Sesión]]
- [[_COMMUNITY_Utilidades de Enrutamiento y Datos MDX|Utilidades de Enrutamiento y Datos MDX]]
- [[_COMMUNITY_Tipos de Recursos y Catálogo de Iconos|Tipos de Recursos y Catálogo de Iconos]]
- [[_COMMUNITY_Configuración del Sistema de Diseño Once UI|Configuración del Sistema de Diseño Once UI]]
- [[_COMMUNITY_Componentes Comunes de la Interfaz (CabeceraPie)|Componentes Comunes de la Interfaz (Cabecera/Pie)]]
- [[_COMMUNITY_Guardas y Políticas de Seguridad de Rutas|Guardas y Políticas de Seguridad de Rutas]]
- [[_COMMUNITY_Gestión de Sesión e Identidad del Empleado|Gestión de Sesión e Identidad del Empleado]]
- [[_COMMUNITY_Configuración del Paquete Core|Configuración del Paquete Core]]
- [[_COMMUNITY_Entorno TypeScript del Core|Entorno TypeScript del Core]]
- [[_COMMUNITY_Interfaz y Formularios de Tickets|Interfaz y Formularios de Tickets]]
- [[_COMMUNITY_Pruebas Unitarias de la Entidad Ticket|Pruebas Unitarias de la Entidad Ticket]]
- [[_COMMUNITY_Configuración de Compilación TypeScript (Next.js)|Configuración de Compilación TypeScript (Next.js)]]
- [[_COMMUNITY_Dominio de Empleados y Control de Acceso|Dominio de Empleados y Control de Acceso]]
- [[_COMMUNITY_Capa de Acceso a Datos de PocketBase|Capa de Acceso a Datos de PocketBase]]
- [[_COMMUNITY_Repositorio de Tickets de PocketBase|Repositorio de Tickets de PocketBase]]
- [[_COMMUNITY_Entidad de Dominio y Modelo de Ticket|Entidad de Dominio y Modelo de Ticket]]
- [[_COMMUNITY_Glosario y Reglas de Negocio (CLAUDE.mdREADME.md)|Glosario y Reglas de Negocio (CLAUDE.md/README.md)]]
- [[_COMMUNITY_Arquitectura de Despliegue y Orquestación Docker|Arquitectura de Despliegue y Orquestación Docker]]

## God Nodes (most connected - your core abstractions)
1. `Ticket` - 76 edges
2. `Empleado` - 49 edges
3. `MockStore` - 35 edges
4. `TicketEstado` - 35 edges
5. `PbStore` - 28 edges
6. `HistorialEntry` - 28 edges
7. `TicketCategoria` - 22 edges
8. `ITicketRepository` - 22 edges
9. `useStoreReactive()` - 21 edges
10. `compilerOptions` - 17 edges

## Surprising Connections (you probably didn't know these)
- `PbTicketRepository` --conceptually_related_to--> `Backend PocketBase`  [INFERRED]
  packages/core/src/modules/ticket/infrastructure/persistence/pocketbase/pb-ticket.repository.ts → DEPLOY.md
- `Ticket` --references--> `Paquete Core Domain (@servicar/core)`  [INFERRED]
  packages/core/src/modules/ticket/domain/entities/ticket.entity.ts → next/README.md
- `Ticket` --conceptually_related_to--> `Entidad Ticket`  [INFERRED]
  packages/core/src/modules/ticket/domain/entities/ticket.entity.ts → CLAUDE.md
- `AdminLayoutVM` --references--> `Empleado`  [EXTRACTED]
  next/src/presentation/view-models/admin/useAdminLayout.view-model.ts → packages/core/src/modules/empleado/domain/entities/empleado.entity.ts
- `HistorialVM` --references--> `Ticket`  [EXTRACTED]
  next/src/presentation/view-models/admin/useHistorial.view-model.ts → packages/core/src/modules/ticket/domain/entities/ticket.entity.ts

## Communities (37 total, 5 thin omitted)

### Community 27 - "Raíz del Monorepo y Espacios de Trabajo"
Cohesion: 0.50
Nodes (3): name, private, workspaces

### Community 10 - "Configuración del Formateador de Código"
Cohesion: 0.10
Nodes (19): $schema, vcs, enabled, clientKind, useIgnoreFile, files, ignoreUnknown, formatter (+11 more)

### Community 4 - "Coordinadores y Controladores de Navegación"
Cohesion: 0.05
Nodes (36): name, version, scripts, dev, export, build, biome-write, start (+28 more)

### Community 9 - "Mapeo de Rutas de Compilación"
Cohesion: 0.08
Nodes (23): compilerOptions, typeRoots, lib, allowJs, skipLibCheck, strict, noEmit, esModuleInterop (+15 more)

### Community 1 - "Casos de Uso y Reglas de Negocio de Tickets"
Cohesion: 0.06
Nodes (48): Action, EditarTicketFormState, EditarTicketViewState, EditarTicketVM, useEditarTicketViewModel(), NuevoTicketFormState, EMPTY, NuevoTicketVM (+40 more)

### Community 6 - "Capa de Persistencia Simulada (Mock)"
Cohesion: 0.08
Nodes (12): AdminLayoutVM, useAdminLayoutViewModel(), TicketsVM, useTicketsViewModel(), AdminCoordinator, ESTADO_ACTIONS, TicketsView(), NAV (+4 more)

### Community 7 - "Gestión de Dependencias (package.json)"
Cohesion: 0.09
Nodes (8): HistorialTab, HistorialVM, useHistorialViewModel(), ESTADO_CFG, HistorialView(), HistorialPage(), PbHistorialRepository, HistorialEntry

### Community 19 - "Panel de Administración y Control de Cola"
Cohesion: 0.24
Nodes (5): PendingAction, ColaVM, useColaViewModel(), ColaView(), ColaPage()

### Community 8 - "Reglas de Calidad y Estilo de Código (Biome)"
Cohesion: 0.16
Nodes (14): useStoreVersion(), getMockSession(), useMockAuth(), useMockTickets(), useMockTicketsByEstado(), useMockTicketsByCreador(), useMockTicketById(), useMockEmpleados() (+6 more)

### Community 11 - "Estructura y Maquetación Principal (Layout)"
Cohesion: 0.17
Nodes (10): StoreProvider(), Providers(), home, appMeta, display, fonts, style, dataStyle (+2 more)

### Community 16 - "Servicios de Autenticación de Sesión"
Cohesion: 0.25
Nodes (4): MockSessionService, SessionPayload, IAuthSessionService, PbSessionService

### Community 18 - "Utilidades de Enrutamiento y Datos MDX"
Cohesion: 0.24
Nodes (9): NotFound(), sitemap(), Team, Metadata, getMDXFiles(), readMDXFile(), getMDXData(), getPosts() (+1 more)

### Community 15 - "Tipos de Recursos y Catálogo de Iconos"
Cohesion: 0.14
Nodes (12): IANATimeZone, Person, Newsletter, Social, BasePageConfig, Home, About, Blog (+4 more)

### Community 12 - "Configuración del Sistema de Diseño Once UI"
Cohesion: 0.16
Nodes (16): DisplayConfig, RoutesConfig, ProtectedRoutesConfig, FontsConfig, StyleConfig, DataStyleConfig, EffectsConfig, MailchimpConfig (+8 more)

### Community 21 - "Componentes Comunes de la Interfaz (Cabecera/Pie)"
Cohesion: 0.39
Nodes (4): Header(), ThemeToggle(), Footer(), ScrollToHash()

### Community 26 - "Guardas y Políticas de Seguridad de Rutas"
Cohesion: 0.40
Nodes (4): RouteGuardProps, DYNAMIC_ROUTE_PREFIXES, RouteGuard(), protectedRoutes

### Community 5 - "Gestión de Sesión e Identidad del Empleado"
Cohesion: 0.12
Nodes (13): authModule, provider, useCase, EmpleadoProps, PbAuthProvider, SesionProps, Sesion, IAuthProvider (+5 more)

### Community 17 - "Configuración del Paquete Core"
Cohesion: 0.15
Nodes (12): name, version, private, main, types, scripts, test, test:watch (+4 more)

### Community 20 - "Entorno TypeScript del Core"
Cohesion: 0.22
Nodes (8): compilerOptions, target, lib, module, moduleResolution, strict, skipLibCheck, include

### Community 0 - "Interfaz y Formularios de Tickets"
Cohesion: 0.05
Nodes (37): DTO, r, uc, Listener, TicketEstado, TICKET_ESTADO_TRANSITIONS, isTransicionValida(), pbTicketToEntity() (+29 more)

### Community 24 - "Pruebas Unitarias de la Entidad Ticket"
Cohesion: 0.33
Nodes (4): BASE, t, original, editado

### Community 2 - "Configuración de Compilación TypeScript (Next.js)"
Cohesion: 0.05
Nodes (31): store, provider, t, result, id, hist, e, fn (+23 more)

### Community 3 - "Dominio de Empleados y Control de Acceso"
Cohesion: 0.11
Nodes (11): pbUserToEmpleado(), PbEmpleadoRepository, mockEmpleadoToEntity(), MockEmpleadoRepository, Empleado, IEmpleadoRepository, GetEmpleadosQuery, GetEmpleadoByIdQuery (+3 more)

### Community 13 - "Capa de Acceso a Datos de PocketBase"
Cohesion: 0.19
Nodes (4): PbUser, PbStore, PbTicket, PbHistorial

### Community 22 - "Glosario y Reglas de Negocio (CLAUDE.md/README.md)"
Cohesion: 0.25
Nodes (8): Servicar System, Rol Mecánico, Rol Administrador, Rol Cliente, Entidad Ticket, Historial de Ediciones Inmutable, Máquina de Estados de Ticket, Modo Offline y Borradores

### Community 25 - "Arquitectura de Despliegue y Orquestación Docker"
Cohesion: 0.40
Nodes (5): Arquitectura de Producción, Backend PocketBase, Frontend Next.js, Once UI Framework, Paquete Core Domain (@servicar/core)

## Knowledge Gaps
- **156 isolated node(s):** `name`, `private`, `workspaces`, `$schema`, `enabled` (+151 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Ticket` connect `Entidad de Dominio y Modelo de Ticket` to `Interfaz y Formularios de Tickets`, `Casos de Uso y Reglas de Negocio de Tickets`, `Configuración de Compilación TypeScript (Next.js)`, `Dominio de Empleados y Control de Acceso`, `Capa de Persistencia Simulada (Mock)`, `Gestión de Dependencias (package.json)`, `Panel de Administración y Control de Cola`, `Glosario y Reglas de Negocio (CLAUDE.md/README.md)`, `Repositorio de Tickets de PocketBase`, `Pruebas Unitarias de la Entidad Ticket`, `Arquitectura de Despliegue y Orquestación Docker`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Why does `Empleado` connect `Dominio de Empleados y Control de Acceso` to `Casos de Uso y Reglas de Negocio de Tickets`, `Panel de Administración y Control de Cola`, `Capa de Persistencia Simulada (Mock)`, `Gestión de Dependencias (package.json)`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `MockStore` connect `Configuración de Compilación TypeScript (Next.js)` to `Dominio de Empleados y Control de Acceso`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Ticket` (e.g. with `Entidad Ticket` and `Paquete Core Domain (@servicar/core)`) actually correct?**
  _`Ticket` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `workspaces` to the rest of the system?**
  _158 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Configuración del Formateador de Código` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Coordinadores y Controladores de Navegación` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._