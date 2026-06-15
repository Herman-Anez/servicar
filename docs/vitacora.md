# Vitácora de Desarrollo — Servicar v1

Registro cronológico de decisiones, cambios y estado del proyecto.

---

## 2026-06-13

### Sesión 1 — Análisis y planeación

**Revisado:**
- `react-prototipo/` — UI completa del mecánico (4 vistas + formulario + login)
- `docs/global-vision.md` — reglas de negocio, roles, estados del ticket
- `docs/esquema_de_base_de_datos_convex.ts` — schema Convex planificado
- `next/` — Magic Portfolio de Once UI como plantilla base

**Decisiones tomadas:**
- Usar la carpeta `next/` como base de la app de producción (no crear carpeta nueva)
- Agregar estados `bloqueado` y `urgente` al schema Convex (existían en prototipo, global-vision los dejaba abiertos)
- Panel admin se construye desde cero (el prototipo es solo vista de mecánico)
- Auth: Convex Auth con Password provider (sin OAuth para v1)
- Layout mecánico: bottom nav (portar del prototipo con Once UI). Layout admin: top nav.

**Mapa de estados reconciliado:**
```
Prototipo "En Revisión"  →  pendiente_revision
Prototipo "Activo"       →  en_progreso
Prototipo "Bloqueado"    →  bloqueado (agregado)
Prototipo "Urgente"      →  urgente (agregado)
Prototipo "Finalizado"   →  finalizado
[nuevo]                  →  requiere_cambios
[nuevo]                  →  aprobado
```

---

### Fase 0 — Limpieza del template Once UI ✅

**Eliminado:**
- `src/app/about/`, `src/app/blog/`, `src/app/gallery/`, `src/app/work/`
- `src/app/api/og/`, `src/app/api/rss/`, `src/app/api/authenticate/`, `src/app/api/check-auth/`
- `src/components/about/`, `src/components/blog/`, `src/components/gallery/`, `src/components/work/`
- `src/components/Mailchimp.tsx`, `ProjectCard.tsx`, `mdx.tsx`, `HeadingLink.tsx`

**Reescrito:**
- `src/resources/content.tsx` — solo metadatos de Servicar, sin datos de portfolio
- `src/resources/once-ui.config.ts` — rutas app, tema dark + blue/cyan, border conservative
- `src/resources/index.ts` — exports limpios (sin person, social, newsletter, blog, work, gallery)
- `src/components/index.ts` — sin Mailchimp, ProjectCard, HeadingLink, CustomMDX
- `src/components/Header.tsx` — placeholder con logo SERVICAR + ThemeToggle
- `src/components/Footer.tsx` — minimal, sin social links
- `src/components/RouteGuard.tsx` — rutas Servicar, prefijos `/ticket` y `/admin`
- `src/app/layout.tsx` — sin Header/Footer de portfolio, lang="es"
- `src/app/page.tsx` — redirect a `/login`

**Creado:**
- `src/app/login/page.tsx` — placeholder (después reemplazado con login funcional)

**Instalado:**
- `convex` package (npm)

**Estado final:** `npx tsc --noEmit` sin errores. Dev server arranca en ~700ms.

---

### Capa de mocks para desarrollo local ✅

**Problema:** `npx convex dev --dev-deployment local` requiere login de cuenta Convex aunque el runtime corra en máquina local. El "local" significa que el proceso Convex corre en tu máquina, no que sea sin cuenta.

**Decisión:** capa de mocks con la misma API que Convex. Componentes importan de `@/lib/db` — nunca de `convex/react` directamente. Cuando Convex esté listo, solo cambia `db.ts` y `.env.local`. Componentes: sin tocar.

**Archivos creados:**

`src/lib/mock/data.ts`
- Tipos TypeScript (`MockTicket`, `MockEmpleado`, `MockHistorial`, `MockDraft`) con misma forma que el schema Convex (`_id`, `_creationTime`, etc.)
- 7 estados de ticket cubiertos en seed: `pendiente_revision`, `requiere_cambios`, `aprobado`, `en_progreso`, `bloqueado`, `urgente`, `finalizado`
- 3 empleados seed: Juan Pérez (mecanico), M. Rodriguez (mecanico), Admin Taller (admin)
- 7 tickets seed que cubren todos los estados y casos edge (con/sin `notaAdmin`, con/sin `bahia`)
- `WORKSHOP_CATEGORIAS` — array para el `<Select>` del formulario

`src/lib/mock/store.ts`
- Clase `MockStore` singleton (instancia única importada en toda la app)
- Sistema de suscriptores: `Set<Listener>` + `subscribe(fn) → unsub`. Cada mutación llama `notify()` → re-render automático en todos los componentes suscritos
- `load()` en constructor: intenta leer localStorage, cae a seed si falla o no existe
- `save()` en cada mutación antes de `notify()` — garantiza persistencia aunque la página recargue entre pasos
- `registrarHistorial()` privado — se llama automáticamente desde `crearTicket`, `editarTicket`, `cambiarEstado`. Replica el `internalMutation` de Convex (componentes no acceden directamente)
- `reset()` — restaura seed y borra localStorage, notifica a todos los componentes

`src/lib/mock/hooks.ts`
- `useStoreVersion()` — helper interno: `useReducer` contador + `useEffect` suscripción. Fuerza re-render cuando el store notifica sin exponer estado innecesario
- Queries: `useMockTickets`, `useMockTicketsByEstado`, `useMockTicketsByCreador`, `useMockTicketById`, `useMockEmpleados`, `useMockHistorialByTicket` — todos usan `useStoreVersion()` + lectura síncrona del store
- Mutations: `useMockCrearTicket`, `useMockEditarTicket`, `useMockCambiarEstado` — devuelven función estable con `useCallback(fn, [])`
- Auth: `useMockSignIn` (busca empleado por `authId`, guarda sesión en localStorage), `useMockSignOut` (limpia sesión), `useMockAuth` (lee sesión + resuelve empleado del store)
- Sesión separada del store reactivo (`servicar_mock_session`) — cambio de sesión implica navegación completa, no re-render parcial

`src/lib/db.ts`
- Re-exporta hooks con nombres canónicos (sin prefijo `Mock`): `useAuth`, `useTickets`, `useCrearTicket`, etc.
- Re-exporta tipos renombrados: `MockTicket → Ticket`, `MockEmpleado → Empleado`, etc.
- Re-exporta constantes: `WORKSHOP_CATEGORIAS`, `MOCK_EMPLEADOS`, `mockStore`
- Contiene TODO comentado con el patrón de migración a Convex real

`.env.local`
- `NEXT_PUBLIC_USE_MOCK=true` activo

**Estado:** TypeScript 0 errores. Documentación completa en `docs/desarrollo-local.md`.

---

### Design System — Modern Pulse ✅

**Fuente:** `docs/DESIGN.md` + `docs/htmls/` (5 pantallas con HTML + screenshots).

**Aplicado:**

`src/resources/once-ui.config.ts`
- `theme: "light"` — diseño es light mode
- `brand: "red"` — primary `#B6020C` ≈ diseño `#bc0100` (99% match)
- `accent: "orange"` — secondary `#db3c2a` ≈ `--scheme-orange-500: #DB3400`
- `neutral: "sand"` — neutro cálido, fondo `#fefcf4` ≈ diseño `#fff8f7`
- `border: "rounded"` — shape language 0.5rem base del diseño
- `surface: "filled"` — tonal layering sólido
- Fuentes: `Inter` (heading/body/label) + `JetBrains_Mono` (code)

`src/app/layout.tsx`
- Init script fuerza `data-theme="light"` y sobreescribe localStorage — no depende de preferencia guardada

`src/resources/custom.css`
- Tokens MD3 exactos del DESIGN.md como variables `--sp-*` (primary, surface-*, on-surface, outline, etc.)
- Clases `.sp-card`, `.sp-input`, `.sp-btn-primary`, `.sp-btn-ghost`, `.sp-nav-item` — usadas en login y admin
- Override `--page-background: #fff8f7` y scrollbar warm

`src/app/login/page.tsx` — rediseño completo
- Logo: cuadrado rojo redondeado con icono shield SVG inline
- Inputs con icono izquierdo (email, lock) y focus ring rojo
- Notice de seguridad con verified icon
- Botón "Access System →" con animación hover/active
- Footer: Soporte · Privacidad · Términos + copyright
- Acceso rápido (dev) mantenido abajo del card

`src/app/admin/layout.tsx` — sidebar izquierdo (rediseño completo)
- Sidebar 256px fijo: SERVICAR logo rojo + "Admin Panel", nav con iconos SVG, badge pendientes, botón "New Ticket" rojo al fondo
- Estado activo: texto rojo + borde derecho rojo + fondo rojo translúcido (`.sp-nav-item.active`)
- Top bar: search pill + iconos (bell/settings/help) + divider + avatar iniciales + nombre/rol
- Cierre de sesión al click en avatar
- Sin dependencia de Once UI components — HTML/CSS puro con vars `--sp-*`

---

### Adaptación visual al prototipo HTML ✅

**Fuente:** `docs/htmls/` (bandeja_de_triage, tablero_global_del_taller, detalle_del_ticket_y_auditor_a)

**Vistas admin reescritas:**

`src/app/admin/cola/page.tsx`
- KPI cards 4-col: Pending Triage, Avg Response, Approved Today, Active Mechanics
- Tabla "Recent Requests" con columnas: Ticket ID + timestamp, Matrícula badge (monospace), Categoría pill, Mecánico con avatar inicial, botones Rechazar/Aprobar
- Modal de confirmación con textarea para nota de rechazo
- Sin Once UI components — HTML/CSS puro con `--sp-*` vars

`src/app/admin/tickets/page.tsx`
- Kanban 3 columnas: Activos (dot primary) | Bloqueados (dot error, borde izq rojo) | Finalizados (opacity 0.8)
- Filtros inline: buscar (texto) + categoría (select)
- Banner de seguridad (shield icon)
- Cards con estado transitions como mini-botones en footer de card
- Bloqueados muestran `notaAdmin` en caja de advertencia
- Click en card → `/admin/historial/[id]`

`src/app/admin/historial/[id]/page.tsx`
- Banner de encriptación (trust banner)
- Layout 2 cols: main (1fr) + sidebar (320px)
- Main: header card (ID badge, status badge, titulo, desc, grid matrícula/cat/técnico) + nota admin warning + tabs Detalles/Historial
- Sidebar: Información de Gestión (fecha creación, tiempo transcurrido, técnico card) + acciones (Editar Ticket, Marcar Finalizado)
- Timeline historial: dot con icono por tipo de acción + card con autor, timestamp, descripción del cambio

**Vistas mecánico — ajustes de color:**

`src/app/(mecanico)/layout.tsx`
- Toggle online/offline: `var(--brand-*)` → `var(--sp-*)` inline
- Bottom nav active: `var(--brand-strong)` → `var(--sp-primary)`
- Badge offline: `var(--danger-strong)` → `var(--sp-error)`
- Logo dot: `var(--brand-strong)` → `var(--sp-primary)`

`src/app/(mecanico)/dashboard/page.tsx` / `taller/page.tsx` / `fichas/page.tsx` / `offline/page.tsx`
- FABs: `var(--brand-strong)` → `var(--sp-primary)`, sombra rgba en lugar de `var(--brand-alpha-medium)`
- Filter chips active: → `var(--sp-primary)` + `#bc010015`
- Tabs fichas active: → `var(--sp-primary)` + `#bc010010`
- Botón sync/publicar: → `var(--sp-primary)`
- Botón corregir: → `#ffdad4` / `#930100`

`src/app/ticket/nuevo/page.tsx`
- Submit button: `var(--brand-strong)` → `var(--sp-primary)`

**Estado:** 0 errores TypeScript. Todas las rutas 200 OK.

---

### Logo nuevo ✅

**Contexto:** Logo original (`servicar.svg` del react-prototipo) tenía texto RIF visible en SVG y baja calidad al renderizar en `<img>`. Se usaba hack de `overflow:hidden` + height extra para recortar el RIF.

**Decisión:** Usuario creó logos nuevos generados via potrace (bitmap → SVG):
- `next/public/servicar-logo.svg` — versión principal (fill `#ff0000`, fondo transparente con letras en positivo), viewBox 1800×705 (ratio 2.55:1), scale 0.04
- `next/public/servicar-logo-2.svg` — versión invertida (para uso sobre fondos oscuros)

**Implementado en 3 puntos:**

| Ubicación | Tamaño |
|-----------|--------|
| `src/app/login/page.tsx` | 260×102px, centrado en branding header |
| `src/app/admin/layout.tsx` | 180×71px, sidebar superior |
| `src/app/(mecanico)/layout.tsx` | 100×39px, top bar compacto |

Sin hack de clip — nuevo SVG no tiene texto RIF.

---

### Eliminación de modo offline ✅

Funcionalidad offline postergada para entrega futura. Eliminado:

- `src/app/(mecanico)/offline/page.tsx` + directorio
- `src/lib/online.ts`, `src/lib/drafts.ts`
- Tab "Offline" del bottom nav en `(mecanico)/layout.tsx`
- Toggle online/offline del top bar
- Rama borrador en `ticket/nuevo/page.tsx` — siempre publica directo
- Card "Borradores Offline" del dashboard → reemplazada con "Mis Tickets" (total propio)
- Ruta `/offline` de `once-ui.config.ts`

---

### Página Home ✅

`src/app/page.tsx` reemplaza el redirect directo a `/login`. Pantalla de entrada con animación dramática inspirada en PS2:

**Secuencia de animación:**
1. Pantalla negra (`#000000`)
2. Fondo transiciona negro → rojo oscuro → `#ff0000` en 1.4s
3. Logo (`/servicar-logo-blanco.svg`) cae desde escala 5× con blur → impacta con rebote elástico (5 keyframes de overshoot) a los 0.4s
4. Flash blanco + `drop-shadow` glow sobre el logo al momento del impacto (1.1s)
5. Botón "Ingresar" sube desde abajo con bounce a los 1.8s → navega a `/login`

Layout override: `position: fixed; inset: 0; z-index: 9999` para romper los wrappers de Once UI y cubrir toda la pantalla.

---

### Bugs de navegación y sesión ✅

**Bug 1 — 404 en raíz**

`http://localhost:3000/` mostraba 404 aunque `src/app/page.tsx` tiene `redirect("/login")`.

Causa: `RouteGuard` verifica cada ruta contra el objeto `routes` de `once-ui.config.ts`. La raíz `"/"` no estaba listada → RouteGuard renderizaba `<NotFound />` antes de que el redirect server-side ejecutara.

Fix: agregar `"/": true` a `routes` en `once-ui.config.ts`.

---

**Bug 2 — `router.replace` durante render**

```
Cannot update a component (Router) while rendering a different component (LoginPage)
at LoginPage src/app/login/page.tsx:48
```

Causa: `LoginPage` llamaba `router.replace(...)` directamente en el cuerpo del componente (render phase) al detectar sesión activa. React prohíbe setState/side effects durante render.

Fix: mover la redirección a `useEffect([isAuthenticated, empleado, router])`.

---

**Bug 3 — No se podía cerrar sesión**

Causa: `clearMockSession()` en `src/lib/mock/hooks.ts` borraba el item de `localStorage` pero no notificaba al store. `useMockAuth()` reactiva su estado a través de `useStoreVersion()` que escucha `mockStore.subscribe()`. Sin `notify()`, los componentes no re-renderizaban y el layout seguía viendo la sesión como activa.

Fix: añadir `mockStore.notify()` al final de `clearMockSession()`, y cambiar `private notify()` → `notify()` en `MockStore` para permitir la llamada externa.

---

### Responsive design — Panel Admin ✅

**Referencia:** `next/.agents` — reglas de Once UI (no `<div>`, tokens, breakpoints `s`/`m`/`l`). Las páginas admin existían con divs inline; se aplicó responsive de forma quirúrgica sin reescribir toda la estructura.

**`src/app/admin/layout.tsx`**
- `useState(false)` para `sidebarOpen`
- `<style>` block con clases CSS:
  - `.admin-sidebar` — en mobile: `transform: translateX(-100%)`, transición 0.25s
  - `.admin-sidebar.open` — visible al toggle
  - `.admin-overlay` — backdrop semitransparente z-index 49 (mobile only)
  - `.admin-content` — `margin-left: 0` en mobile, `256px` en desktop
  - `.admin-hamburger` — hidden en desktop, `display: flex` en mobile (≤768px)
  - `.admin-search`, `.admin-username` — ocultos en mobile
  - `.admin-main` — padding 40px → 20px 16px en mobile
- Sidebar cierra automáticamente al cambiar de ruta (`useEffect([pathname])`)

**`src/app/admin/cola/page.tsx`**
- `.kpi-grid`: 4 cols → 2 cols (≤900px) → 1 col (≤480px)

**`src/app/admin/tickets/page.tsx`**
- `.kanban-grid`: 3 cols → 1 col (≤900px)

**`src/app/admin/historial/[id]/page.tsx`**
- `.historial-main`: `1fr 320px` → 1 col (≤768px)
- `.historial-info`: `repeat(3,1fr)` → 1 col (≤768px)

**Bug extra corregido:** overlay del dropdown de perfil (mecánico) tenía `z-index: 40` > dropdown `z-index: 10` → clicks en "Cerrar Sesión" interceptados por overlay. Fix: overlay bajado a `z-index: 5`.

---

### Responsive design — segunda pasada ✅

Fixes quirúrgicos sobre páginas admin después de la primera pasada de responsive.

**`src/app/admin/historial/[id]/page.tsx`**
- Header card: `flex justify-between` sin wrap causaba overflow del título + badge de estado en mobile → reemplazado con clase `.historial-card-header` (`flex-wrap: wrap; gap: 16px`)
- `h1` reducido: 26px → 20px en ≤768px via `.historial-title`

**`src/app/admin/tickets/page.tsx`**
- `h2` "Operational Overview": 32px → 22px en ≤600px via `.tickets-h2`
- Input de búsqueda `width: 180px` fijo → 120px en ≤600px via `.tickets-search`
- Filter row movido a clase `.tickets-filter` con `flex-wrap: wrap`

**`src/app/admin/cola/page.tsx`**
- `h2` "Bandeja de Triage": 32px → 22px en ≤600px via `.cola-h2`
- Estado vacío: `padding: 64` → `padding: 40px 24px`

**`docs/estetica.md`** — creado. Documenta: filosofía visual Modern Pulse, tokens `--sp-*`, tipografía, logo (dos variantes + tamaños por contexto), clases `.sp-*`, patrones por contexto (home, admin, mecánico, chips de estado), configuración Once UI.

---

---

## 2026-06-14

### Internacionalización — textos a español ✅

Todos los textos visibles en inglés traducidos al español en todas las páginas:

| Archivo | Cambios |
|---|---|
| `admin/cola/page.tsx` | "Pending Triage"→"En Triage", "Avg. Response"→"Tiempo Prom.", "Approved Today"→"Aprobados Hoy", "Active Mechanics"→"Mecánicos Activos", badges STEADY→ESTABLE, HIGH→ALTO, ONLINE→ACTIVOS, "Workshop"→"Taller", "Recent Requests"→"Solicitudes Recientes", "TOTAL PENDING"→"TOTAL PENDIENTES", "Ticket ID"→"N° Ticket", timestamps "X ago"→"hace X", "New Ticket"→"Nuevo Ticket" |
| `admin/tickets/page.tsx` | "Workshop"→"Taller", "Ticket Dashboard"→"Panel de Tickets", "Operational Overview"→"Resumen Operacional", live badge traducido |
| `admin/layout.tsx` | "New Ticket"→"Nuevo Ticket" |
| `login/page.tsx` | "Access System"→"Acceder al Sistema" |
| `not-found.tsx` | "Page Not Found"→"Página No Encontrada" + mensaje traducido |

---

### Responsive `/admin/cola` ✅

La tabla de triage no era responsive en mobile. Causa doble: el wrapper `.sp-card` tenía `overflow: hidden` inline que impedía el scroll horizontal interno, y la tabla de 5 columnas era demasiado ancha para pantallas pequeñas.

**Fix implementado:**
- Eliminado `overflow: hidden` del wrapper card
- Tabla envuelta en `className="triage-table"` (visible solo en desktop >640px)
- Añadida vista mobile `className="triage-mobile"` (visible solo en ≤640px): cards apilados por ticket con matrícula badge, categoría pill, mecánico, y botones Rechazar/Aprobar a ancho completo
- CSS media query en `colaStyles` controla la visibilidad de cada vista

---

### Arquitectura DDD + Hexagonal + MVVM-C ✅

**Decisión:** refactorizar la codebase hacia arquitectura mantenible antes de conectar Convex. Se adopta la combinación:
- **DDD** — dominio es el núcleo, reglas en entidades, no en componentes
- **Hexagonal** — puertos en dominio, adaptadores en infraestructura. Cambio de mock→Convex sin tocar dominio ni aplicación
- **MVVM-C** — en presentación: View (JSX puro), ViewModel (hook de composición), Coordinator (navegación desacoplada del router)

Documentación completa en `docs/arquitectura-modulos.md` y `docs/ddd-hexagonal-refactor.md`.

---

### Fase 0 — Shared Kernel ✅

Creado `src/modules/shared/domain/`:

| Archivo | Contenido |
|---|---|
| `ticket-estado.ts` | `TicketEstado` + `TICKET_ESTADO_TRANSITIONS` + `isTransicionValida()` — state machine del ticket |
| `ticket-categoria.ts` | `TicketCategoria` + `WORKSHOP_CATEGORIAS` |
| `rol.ts` | `Rol` |
| `index.ts` | barrel |

`lib/mock/data.ts` ahora importa desde shared en vez de redefinir los tipos.  
`lib/db.ts` expone `TICKET_ESTADO_TRANSITIONS` e `isTransicionValida` como parte de la API pública.  
Ninguna page se rompe — `lib/db.ts` sigue siendo el escudo. TypeScript: 0 errores.

---

### Fase 1 — Dominio Ticket ✅

Creado `src/modules/ticket/domain/`. Cero dependencias de React/Next.js.

**Entidades:**
- `Ticket` — agregado raíz. Factory `create()` valida campos obligatorios y construye con estado inicial `pendiente_revision`. `cambiarEstado()` valida transición con `isTransicionValida` y exige `notaAdmin` al ir a `requiere_cambios`. Inmutable: todos los métodos devuelven nueva instancia.
- `HistorialEntry` — inmutable tras creación. Nunca se edita ni elimina.

**Value Objects:**
- `Matricula` — valida no-vacía, normaliza a uppercase. Extensible para validación de formato.

**Puertos de salida (`domain/ports/`):**
- `ITicketRepository` — `getAll`, `getById`, `getByEstado`, `getByCreador`, `save`
- `IHistorialRepository` — `getByTicket`, `save`

---

### Fase 2 — Capa de Aplicación ✅

Creado `src/modules/ticket/application/`. Cero dependencias de React/Next.js.

**DTOs:** `CrearTicketDTO`, `EditarTicketDTO`, `CambiarEstadoDTO`.

**Puertos de entrada (`ports-in/`):** interfaces que la presentación usará. Los ViewModels dependen de `ICrearTicketUseCase`, nunca de la clase concreta `CrearTicketUseCase`.

**Use Cases (implementan sus ports-in):**
- `CrearTicketUseCase` — `Ticket.create()` + `HistorialEntry.create()` + save ambos
- `EditarTicketUseCase` — `ticket.editar()` + historial `EDICION_TEXTO`
- `CambiarEstadoUseCase` — `ticket.cambiarEstado()` (dominio lanza si transición inválida) + historial `CAMBIO_ESTADO`

**Queries (implementan sus ports-in):**
`GetTicketsQuery`, `GetTicketByIdQuery`, `GetTicketsPorEstadoQuery`, `GetTicketsPorCreadorQuery`, `GetHistorialQuery`.

Todos reciben sus repositorios por constructor — testeables sin DOM ni localStorage.

---

### Fase 3 — Adaptadores de Persistencia Mock ✅

Creado `src/modules/ticket/infrastructure/`.

**Cambios a `MockStore`:**
- `export class MockStore` (antes `class MockStore` — no exportada)
- Añadido `upsertTicket(ticket)` — inserta o reemplaza, sin historial. Llama `save()` + `notify()`
- Añadido `appendHistorial(entry)` — append raw, sin lógica extra

**Mapper** (`mock-ticket.mapper.ts`): convierte `MockTicket` ↔ `Ticket` y `MockHistorial` ↔ `HistorialEntry`. Solo mapea `_id`→`id` y `_creationTime`→`creationTime`.

**Repositorios:**
- `MockTicketRepository implements ITicketRepository` — delega a `mockStore`, mapea con mapper
- `MockHistorialRepository implements IHistorialRepository` — ídem

**Service Locator** (`ticket-module.ts`): único punto donde se instancian clases concretas. Expone `ticketModule` con todos los use cases y queries tipados como interfaces (ports-in). Para migrar a Convex: crear `ConvexTicketRepository`, reemplazar 2 líneas en este archivo.

---

### Documentación arquitectura ✅

Creado `docs/arquitectura-modulos.md`. Cubre:
- Tabla de patrones adoptados (DDD / Hexagonal / MVVM-C) con propósito de cada uno
- Regla fundamental de dependencia (diagrama de capas)
- Árbol de carpetas completo anotado
- Detalle de cada capa con ejemplos de código reales del proyecto
- Flujo end-to-end: "admin aprueba ticket" — paso a paso desde click hasta localStorage
- Reglas para contribuir (qué nunca debe cruzar capas, señales de alarma)
- Tabla de estado de implementación

---

---

### Fase 4 — Módulo Empleado ✅

Creado `src/modules/empleado/`.

**Dominio (`domain/`):**
- `Empleado` — entidad. Solo `reconstitute()` (empleados no se crean desde la app, vienen de Convex Auth en producción). Getters: `id`, `nombre`, `email`, `rol`, `authId`.
- `IEmpleadoRepository` — `getAll`, `getById`, `getByAuthId`.

**Aplicación (`application/`):**
- `AutenticarEmpleadoDTO` — `{ authId: string }`
- `IAutenticarEmpleadoUseCase`, `IGetEmpleadoByIdQuery`, `IGetEmpleadosQuery` — ports-in
- `AutenticarEmpleadoUseCase` — delega a `repo.getByAuthId(dto.authId)`, devuelve `Empleado | null`
- `GetEmpleadoByIdQuery`, `GetEmpleadosQuery` — queries simples

**Infraestructura (`infrastructure/`):**
- `mock-empleado.mapper.ts` — `MockEmpleado → Empleado` (mapea `_id→id`, `identificadorAutenticacion→authId`)
- `MockEmpleadoRepository implements IEmpleadoRepository` — delega a `mockStore.getEmpleados/getEmpleadoById/getEmpleadoByAuth`
- `empleado-module.ts` — service locator: singleton `empleadoModule` con `autenticarEmpleado`, `getEmpleados`, `getEmpleadoById`

TypeScript: 0 errores.

---

---

### Fase 5 — Coordinators (MVVM-C) ✅

Creado `src/presentation/coordinators/`. Cross-cutting — fuera de cualquier módulo específico porque coordinators de admin necesitan navegar a rutas de ticket y viceversa.

**Decisión de diseño:** coordinators reciben `IRouter` (interfaz mínima con `push/replace/back`) en lugar de `AppRouterInstance` directamente. ViewModels dependen de `IAdminCoordinator`/`IMecanicoCoordinator` (interfaces), no de las clases concretas. Testeable sin DOM ni router real.

**Archivos:**

| Archivo | Contenido |
|---|---|
| `interfaces/router.port.ts` | `IRouter { push, replace, back }` — desacopla de Next.js |
| `interfaces/admin.coordinator.port.ts` | `IAdminCoordinator` — 7 métodos de navegación admin |
| `interfaces/mecanico.coordinator.port.ts` | `IMecanicoCoordinator` — 7 métodos de navegación mecánico |
| `admin.coordinator.ts` | `AdminCoordinator implements IAdminCoordinator` |
| `mecanico.coordinator.ts` | `MecanicoCoordinator implements IMecanicoCoordinator` |
| `index.ts` | barrel |

**Rutas encapsuladas:**

AdminCoordinator: `goToCola`, `goToTickets`, `goToHistorial(id)`, `goToNuevoTicket`, `goToEditarTicket(id)`, `goToLogin`, `goBack`

MecanicoCoordinator: `goToDashboard`, `goToTaller`, `goToFichas`, `goToNuevoTicket`, `goToEditarTicket(id)`, `goToLogin`, `goBack`

TypeScript: 0 errores.

---

### Fases 6–8 — Capa de Presentación (MVVM-C) ✅

Migración completa de todas las pages a patrón View + ViewModel + thin shell.

**Shared:**
- `src/presentation/hooks/useStoreReactive.ts` — `useReducer` + `useEffect(mockStore.subscribe)` para reactivity sin `lib/db`
- `src/presentation/views/shared/EstadoChip.tsx` — chip puro, importa `TicketEstado` del shared kernel

**Admin:**

| Sección | ViewModel | View | Thin Shell |
|---|---|---|---|
| Layout | `useAdminLayoutViewModel` | `AdminLayoutView` | `app/admin/layout.tsx` ✅ |
| Cola (triage) | `useColaViewModel` | `ColaView` | `app/admin/cola/page.tsx` ✅ |
| Tickets | `useTicketsViewModel` | `TicketsView` | `app/admin/tickets/page.tsx` ✅ |
| Historial | `useHistorialViewModel` | `HistorialView` | `app/admin/historial/[id]/page.tsx` ✅ |

**Mecánico:**

| Sección | ViewModel | View | Thin Shell |
|---|---|---|---|
| Layout | `useMecanicoLayoutViewModel` | `MecanicoLayoutView` | `app/(mecanico)/layout.tsx` ✅ |
| Dashboard | `useDashboardViewModel` | `DashboardView` | `app/(mecanico)/dashboard/page.tsx` ✅ |
| Taller | `useTallerViewModel` | `TallerView` | `app/(mecanico)/taller/page.tsx` ✅ |
| Fichas | `useFichasViewModel` | `FichasView` | `app/(mecanico)/fichas/page.tsx` ✅ |

**Ticket:**

| Sección | ViewModel | View | Thin Shell |
|---|---|---|---|
| Nuevo | `useNuevoTicketViewModel` | `NuevoTicketView` | `app/ticket/nuevo/page.tsx` ✅ |
| Editar | `useEditarTicketViewModel` | `EditarTicketView` | `app/ticket/[id]/editar/page.tsx` ✅ |

**Decisiones clave:**
- Thin shell pattern: `useMemo(() => new Coordinator(router), [router])` + ViewModel hook + View component
- Auth en ViewModels: `getMockSession()` + `empleadoModule.getEmpleadoById.execute()` — sin `useAuth()` de `lib/db`
- Auth guard en thin shells vía `useEffect` → `coordinator.goToLogin()` si no hay sesión
- `setSidebarOpen((p) => !p)` → `setSidebarOpen(!sidebarOpen)` — VM interface es `(v: boolean) => void`
- `EditarTicketViewModel` usa `viewState: "loading" | "forbidden" | "finalizado" | "form"` para los 4 estados del formulario de edición
- `FILTROS` y `FilterEstado` exportados desde el ViewModel (no redefinidos en la View)
- `WORKSHOP_CATEGORIAS` importado de `@/modules/shared/domain` directamente (ya no de `lib/db`)
- Dominio usa `ticket.id` / `ticket.creationTime` (sin underscore) — todas las Views migradas

TypeScript: 0 errores.

---

### Refactor — Aggregate Root estricto ✅

**Problema:** `HistorialEntry` tenía `IHistorialRepository.save()` propio — use cases coordinaban ticket + historial por separado (violación del principio "un repositorio por AR").

**Cambios:**

`shared/domain/aggregate-root.ts` — nueva clase base `abstract AggregateRoot`. Marker que comunica la intención; `Ticket` y `Empleado` la extienden.

`Ticket extends AggregateRoot` — ahora es el único creador de `HistorialEntry`:
- `create()` → emite entrada `CREACION` en `_pendingHistorial`
- `cambiarEstado(nuevoEstado, empleadoId, notaAdmin?)` → emite `CAMBIO_ESTADO` (firma cambió para incluir `empleadoId`)
- `editar(campos, empleadoId)` → emite `EDICION_TEXTO` (firma cambió para incluir `empleadoId`)
- `get pendingHistorial()` → `readonly HistorialEntry[]`

`IHistorialRepository` — `save()` eliminado. Solo queda `getByTicket()`. Es un **read model**, no un puerto de escritura.

`MockTicketRepository.save()` — ahora drena `ticket.pendingHistorial`:
```typescript
save(ticket: Ticket): void {
  this.store.upsertTicket(entityToMockTicket(ticket));
  for (const entry of ticket.pendingHistorial) {
    this.store.appendHistorial(entityToMockHistorial(entry));
  }
}
```

`MockHistorialRepository` — eliminado `save()`. Solo `getByTicket()`.

Use cases de mutación (`CrearTicket`, `EditarTicket`, `CambiarEstado`) — eliminado `historialRepo` del constructor. Ahora cada uno solo recibe `ITicketRepository`. 3 líneas de cuerpo.

`ticket-module.ts` — use cases de mutación ya no reciben `historialRepo` en el constructor.

`Empleado extends AggregateRoot` — marcado.

**Resultado:** garantía de dominio que nunca puede existir una mutación de ticket sin su entrada de historial correspondiente — el AR lo hace atómico. TypeScript: 0 errores.

---

### Migración admin views a Once UI ✅

Las 4 vistas admin (que usaban HTML/CSS puro con `--sp-*`) migradas a componentes Once UI.

**Componentes Once UI usados:** `Column`, `Row`, `Text`, `Heading`, `Icon`, `IconButton`, `Avatar`, `Tag`

**SpacingToken constraint:** Once UI solo acepta valores discretos (`"0"|"1"|"2"|"4"|"8"|"12"|"16"|"20"|"24"|"32"|"40"|"48"|"56"|"64"|"80"|"104"|"128"|"160"`). Valores inválidos como `"6"`, `"10"`, `"14"`, `"28"` reemplazados por aproximación más cercana.

| Vista | Cambios clave |
|---|---|
| `AdminLayoutView` | Sidebar: `Column as="aside"`. Header: `Row as="header" position="sticky"`. Avatar para iniciales: `<Avatar value={empleado.nombre} size="s" onClick={onLogout} />`. Iconos: `<IconButton icon="bell|settings|help" size="s" variant="ghost" />` |
| `ColaView` | KPI cards: `Column border="neutral-alpha-weak" radius="m" padding="16"`. Badges matrícula: `<Tag variant="neutral" label={ticket.matricula} size="s" />`. Avatar mecánico: `<Avatar value={creador?.nombre} size="xs" />` |
| `TicketsView` | Kanban: `Column gap="12"`. Columnas: `Column background="neutral-alpha-weak" radius="m"`. Cards: `Column background="page" radius="m" padding="16"` |
| `HistorialView` | Timeline: `Column position="relative"` + `Row gap="14"` por entrada. Badges de estado: `Tag` con variantes `neutral|brand|warning|danger|success` |

**Iconos agregados a `src/resources/icons.ts`:** `bell` (HiOutlineBell), `settings` (HiOutlineCog6Tooth), `help` (HiOutlineQuestionMarkCircle).

---

## 2026-06-15

### Monorepo — `@servicar/core` ✅

**Motivación:** desacoplar el código de dominio de Next.js para que una futura app Vue (u otro framework) pueda reusar dominio + aplicación sin copiar código.

**Estructura creada:**

```
servicar/                           ← nuevo workspace root
├── package.json                    ← { "workspaces": ["packages/*", "next"] }
└── packages/
    └── core/
        ├── package.json            ← { "name": "@servicar/core", "main": "./src/index.ts" }
        ├── tsconfig.json
        └── src/
            ├── index.ts            ← barrel de todo el dominio/aplicación
            └── modules/
                ├── shared/domain/
                ├── ticket/domain/ + application/
                └── empleado/domain/ + application/
```

**Qué se movió:** todo `next/src/modules/*/domain/` y `next/src/modules/*/application/` → `packages/core/src/modules/*/`. Imports internos `@/modules/` reemplazados con rutas relativas.

**Qué quedó en `next/src/modules/`:** solo infraestructura.
```
next/src/modules/
├── ticket/infrastructure/   ← repositorios mock + ticket-module.ts
└── empleado/infrastructure/ ← repositorio mock + empleado-module.ts
```

**Resolución TypeScript:** alias de path en `next/tsconfig.json` (sin necesidad de `npm install`):
```json
"@servicar/core": ["../packages/core/src/index.ts"]
```
TypeScript resuelve sin `npm install` — no se necesita symlink durante desarrollo.

**Errores corregidos al final:**
- `ticket-module.ts` y `empleado-module.ts` usaban `from "../application"` (carpeta borrada). Cambiado a `from "@servicar/core"` con named type imports (`type ICrearTicketUseCase`, etc.).
- TypeScript: 0 errores en todo el proyecto.

---

### Monorepo — `@servicar/persistence-mock` ✅

**Motivación:** los repositorios mock, mappers y `MockStore` vivían dispersos entre `next/src/lib/mock/` y `next/src/modules/*/infrastructure/persistence/`. Moverlos a raíz del monorepo permite agregar `persistence/convex/` en paralelo sin tocar `next/`.

**Estructura creada:**

```
servicar/
├── package.json   ← workspaces: ["packages/*", "persistence/*", "next"]
└── persistence/
    └── mock/      ← @servicar/persistence-mock
        ├── package.json
        ├── tsconfig.json  (alias @servicar/core → ../../packages/core/src/index.ts)
        └── src/
            ├── index.ts        ← barrel
            ├── data.ts         ← MockTicket, MockEmpleado, MockHistorial, seed arrays
            ├── store.ts        ← MockStore + singleton mockStore (sin "use client")
            ├── ticket/
            │   ├── mock-ticket.mapper.ts
            │   ├── mock-ticket.repository.ts
            │   └── mock-historial.repository.ts
            └── empleado/
                ├── mock-empleado.mapper.ts
                └── mock-empleado.repository.ts
```

**Eliminado de `next/`:**
- `src/lib/mock/store.ts`
- `src/lib/mock/data.ts`
- `src/modules/ticket/infrastructure/persistence/` (directorio completo)
- `src/modules/empleado/infrastructure/persistence/` (directorio completo)

**Permanece en `next/`:**
- `src/lib/mock/hooks.ts` — React hooks (único archivo que necesita `"use client"`)
- `src/modules/ticket/infrastructure/ticket-module.ts` — service locator
- `src/modules/empleado/infrastructure/empleado-module.ts` — service locator

**Imports actualizados:**

| Archivo | Antes | Después |
|---|---|---|
| `ticket-module.ts` | `@/lib/mock/store` + `./persistence/mock/*` | `@servicar/persistence-mock` |
| `empleado-module.ts` | `@/lib/mock/store` + `./persistence/mock/*` | `@servicar/persistence-mock` |
| `lib/mock/hooks.ts` | `./store`, `./data` | `@servicar/persistence-mock` |
| `lib/db.ts` | `./mock/data`, `./mock/store` | `@servicar/persistence-mock` |
| `presentation/hooks/useStoreReactive.ts` | `@/lib/mock/store` | `@servicar/persistence-mock` |

**Alias agregado a `next/tsconfig.json`:**
```json
"@servicar/persistence-mock": ["../persistence/mock/src/index.ts"]
```

Para agregar Convex: crear `persistence/convex/` con `ConvexTicketRepository`, cambiar 2 imports en service locators. Dominio, aplicación y UI sin tocar.

TypeScript: 0 errores.

---

## Próximo

### Convex (futuro)
- [ ] Crear `persistence/convex/` con `ConvexTicketRepository` y `ConvexEmpleadoRepository`
- [ ] Reemplazar import en `ticket-module.ts` y `empleado-module.ts` — 2 líneas cada uno
- [ ] Dominio (`@servicar/core`) y UI sin tocar

### Funcionalidades pendientes
- [ ] Portal cliente `/ticket/[id]` — público, sin auth
- [ ] Offline/drafts → sync a Convex
