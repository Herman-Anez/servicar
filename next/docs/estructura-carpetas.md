# Estructura de Carpetas — Servicar Next.js

Guía de referencia rápida. Explica qué vive en cada segmento, qué reglas aplica, y por qué está ahí.

---

## Vista general

```
src/
├── modules/        ← Dominio + Aplicación + Infraestructura (DDD + Hexagonal)
├── presentation/   ← MVVM-C: Views, ViewModels, Coordinators
├── app/            ← Next.js App Router: thin shells únicamente
├── lib/            ← Capa mock legacy (camino antiguo)
├── components/     ← Componentes Once UI del template (no tocar)
├── resources/      ← Configuración Once UI, tokens CSS, contenido
├── types/          ← Tipos globales del template
└── utils/          ← Utilidades del template
```

---

## `src/modules/` — El núcleo del sistema

Contiene todo el código que modelea el negocio. Tres sub-zonas por módulo: `domain`, `application`, `infrastructure`. La regla de oro:

> **Las dependencias solo apuntan hacia adentro.** `infrastructure` conoce `application`. `application` conoce `domain`. `domain` no conoce a nadie.

---

### `modules/shared/domain/` — Shared Kernel

Tipos y contratos que **todos los módulos comparten**. Ningún módulo los redefine; todos los importan desde `@/modules/shared/domain`.

```
shared/domain/
├── aggregate-root.ts     ← clase base abstracta AggregateRoot (marker)
├── ticket-estado.ts      ← TicketEstado union + máquina de estados + isTransicionValida()
├── ticket-categoria.ts   ← TicketCategoria union + WORKSHOP_CATEGORIAS (para <Select>)
├── rol.ts                ← Rol union: "mecanico" | "admin"
└── index.ts              ← barrel — único punto de importación
```

**`aggregate-root.ts`** — clase abstracta vacía. Extenderla comunica que esa clase es el único punto de entrada a su aggregate y tiene repositorio propio. Sin lógica; solo intención.

**`ticket-estado.ts`** — define el grafo de transiciones válidas (`pendiente_revision → aprobado`, etc.) y la función `isTransicionValida()` que el dominio usa para rechazar transiciones ilegales.

---

### `modules/ticket/` — Bounded Context: Ticket

Todo lo relacionado con la entidad central del sistema.

#### `domain/` — Las reglas del negocio

```
ticket/domain/
├── entities/
│   ├── ticket.entity.ts            ← Ticket (Aggregate Root)
│   └── historial-entry.entity.ts  ← HistorialEntry (entidad interna del aggregate)
├── value-objects/
│   └── matricula.vo.ts             ← Matricula (valida y normaliza)
├── ports/                          ← interfaces que infraestructura debe implementar
│   ├── ticket.repository.port.ts   ← ITicketRepository
│   └── historial.repository.port.ts ← IHistorialRepository (solo lectura)
└── index.ts
```

**`ticket.entity.ts`** — Aggregate Root. Extiende `AggregateRoot`. Toda mutación del sistema de tickets pasa por aquí:
- `Ticket.create(params)` — valida campos obligatorios, asigna estado inicial `pendiente_revision`, emite entrada `CREACION` en `pendingHistorial`
- `ticket.cambiarEstado(nuevoEstado, empleadoId, notaAdmin?)` — valida la transición contra la máquina de estados, emite entrada `CAMBIO_ESTADO` en `pendingHistorial`
- `ticket.editar(campos, empleadoId)` — emite entrada `EDICION_TEXTO` en `pendingHistorial`
- `Ticket.reconstitute(props)` — reconstruye desde persistencia sin validar (ya fue validado al crear)
- `ticket.pendingHistorial` — lista de `HistorialEntry` generados por la última operación; el repositorio los drena al guardar

**`historial-entry.entity.ts`** — Registro inmutable de auditoría. Solo `Ticket` lo crea. Nunca se modifica ni se elimina. Accedido desde fuera únicamente como lectura vía `IHistorialRepository`.

**`matricula.vo.ts`** — Value Object. Sin `id`, se compara por valor. Valida que no esté vacío y normaliza a uppercase. Si en el futuro se agrega validación de formato de placa venezolana, solo cambia aquí.

**`ticket.repository.port.ts`** — `ITicketRepository`: interfaz que el dominio define y la infraestructura implementa. El método `save(ticket)` es responsable de persistir tanto el ticket como el `pendingHistorial` que lleva consigo. Un repositorio por Aggregate Root.

**`historial.repository.port.ts`** — `IHistorialRepository`: solo `getByTicket(ticketId)`. Es un read model — la escritura ocurre dentro de `ITicketRepository.save()`.

#### `application/` — Orquestación sin lógica de negocio

```
ticket/application/
├── dtos/
│   ├── crear-ticket.dto.ts     ← { matricula, categoria, titulo, descripcion, creadorId, bahia? }
│   ├── editar-ticket.dto.ts    ← { ticketId, empleadoId, campos: TicketCamposEditables }
│   └── cambiar-estado.dto.ts   ← { ticketId, empleadoId, nuevoEstado, notaAdmin? }
├── ports-in/                   ← interfaces que los ViewModels consumen
│   ├── crear-ticket.use-case.port.ts
│   ├── editar-ticket.use-case.port.ts
│   ├── cambiar-estado.use-case.port.ts
│   ├── get-tickets.query.port.ts
│   ├── get-ticket-by-id.query.port.ts
│   ├── get-tickets-por-estado.query.port.ts
│   ├── get-tickets-por-creador.query.port.ts
│   └── get-historial.query.port.ts
├── use-cases/
│   ├── crear-ticket.use-case.ts    ← Ticket.create() → ticketRepo.save()
│   ├── editar-ticket.use-case.ts   ← ticket.editar() → ticketRepo.save()
│   └── cambiar-estado.use-case.ts  ← ticket.cambiarEstado() → ticketRepo.save()
├── queries/
│   ├── get-tickets.query.ts
│   ├── get-ticket-by-id.query.ts
│   ├── get-tickets-por-estado.query.ts
│   ├── get-tickets-por-creador.query.ts
│   └── get-historial.query.ts
└── index.ts
```

**`dtos/`** — contratos de entrada planos (interfaces sin comportamiento). Definen qué datos necesita cada operación. Los ViewModels construyen DTOs y los pasan a los use cases.

**`ports-in/`** — interfaces de lo que esta capa expone hacia afuera. Los ViewModels dependen de `ICrearTicketUseCase`, nunca de `CrearTicketUseCase`. Esto permite intercambiar implementaciones sin tocar la presentación.

**`use-cases/`** — operaciones de escritura. Cada uno recibe solo `ITicketRepository` por constructor (el historial viaja dentro del ticket). Sin lógica de negocio propia: la validación la hace el dominio, la persistencia la hace el repositorio.

**`queries/`** — operaciones de solo lectura. Devuelven entidades de dominio o colecciones. Los que necesitan historial reciben `IHistorialRepository`.

#### `infrastructure/` — El mundo exterior

```
ticket/infrastructure/
├── persistence/
│   └── mock/                        ← adaptador actual: localStorage + pub/sub
│       ├── mock-ticket.mapper.ts    ← convierte MockTicket ↔ Ticket, MockHistorial ↔ HistorialEntry
│       ├── mock-ticket.repository.ts   ← implementa ITicketRepository
│       └── mock-historial.repository.ts ← implementa IHistorialRepository (solo getByTicket)
└── ticket-module.ts                 ← service locator: ensambla repos + use cases
```

**`mock-ticket.mapper.ts`** — traduce el formato flat del store (`_id`, `_creationTime`) al formato del dominio (`id`, `creationTime`) y viceversa. Aísla la diferencia de nomenclatura entre la persistencia y el dominio.

**`mock-ticket.repository.ts`** — implementa `ITicketRepository`. El método `save()` persiste el ticket en el store y luego itera `ticket.pendingHistorial` para persistir cada entrada de historial. Llama `mockStore.notify()` al final para disparar re-renders reactivos.

**`mock-historial.repository.ts`** — implementa `IHistorialRepository`. Solo `getByTicket()`. No tiene `save()` — la escritura es responsabilidad de `MockTicketRepository`.

**`ticket-module.ts`** — único archivo donde se instancian clases concretas. Construye repositorios mock, los inyecta en use cases y queries, y expone todo tipado como interfaces (ports-in). Para migrar a Convex: crear `ConvexTicketRepository`, reemplazar dos líneas aquí. Nada más cambia.

```typescript
export const ticketModule = {
  crearTicket:   new CrearTicketUseCase(ticketRepo)  as ICrearTicketUseCase,
  editarTicket:  new EditarTicketUseCase(ticketRepo)  as IEditarTicketUseCase,
  cambiarEstado: new CambiarEstadoUseCase(ticketRepo) as ICambiarEstadoUseCase,
  getTickets:    new GetTicketsQuery(ticketRepo)       as IGetTicketsQuery,
  getHistorial:  new GetHistorialQuery(historialRepo)  as IGetHistorialQuery,
  // ...
};
```

---

### `modules/empleado/` — Bounded Context: Empleado

Misma estructura de tres capas. Aggregate Root `Empleado` — más simple que Ticket porque los empleados no se crean desde la app (vienen de Convex Auth en producción).

```
empleado/
├── domain/
│   ├── entities/
│   │   └── empleado.entity.ts         ← Empleado (Aggregate Root, solo reconstitute)
│   ├── ports/
│   │   └── empleado.repository.port.ts ← IEmpleadoRepository: getAll, getById, getByAuthId
│   └── index.ts
├── application/
│   ├── dtos/
│   │   └── autenticar-empleado.dto.ts  ← { authId: string }
│   ├── ports-in/
│   │   ├── autenticar-empleado.use-case.port.ts
│   │   ├── get-empleado-by-id.query.port.ts
│   │   └── get-empleados.query.port.ts
│   ├── use-cases/
│   │   └── autenticar-empleado.use-case.ts  ← repo.getByAuthId(dto.authId)
│   ├── queries/
│   │   ├── get-empleado-by-id.query.ts
│   │   └── get-empleados.query.ts
│   └── index.ts
└── infrastructure/
    ├── persistence/mock/
    │   ├── mock-empleado.mapper.ts    ← mapea _id→id, identificadorAutenticacion→authId
    │   └── mock-empleado.repository.ts
    └── empleado-module.ts             ← service locator
```

**`empleado.entity.ts`** — `Empleado extends AggregateRoot`. Solo `reconstitute()` — no hay `create()` porque empleados se gestionan en Convex Auth, no en la app. Getters: `id`, `nombre`, `email`, `rol`, `authId`.

**`mock-empleado.mapper.ts`** — la diferencia de nomenclatura es más significativa aquí: `MockEmpleado` usa `_id` e `identificadorAutenticacion`, el dominio usa `id` y `authId`.

**`empleado-module.ts`** — expone `empleadoModule.autenticarEmpleado`, `empleadoModule.getEmpleados`, `empleadoModule.getEmpleadoById`.

---

## `src/presentation/` — Capa de Presentación (MVVM-C)

Cross-cutting: vive fuera de cualquier bounded context porque los coordinators admin navegan a rutas de ambos contextos.

```
presentation/
├── coordinators/
│   ├── interfaces/
│   │   ├── router.port.ts               ← IRouter { push, replace, back }
│   │   ├── admin.coordinator.port.ts    ← IAdminCoordinator (7 métodos)
│   │   └── mecanico.coordinator.port.ts ← IMecanicoCoordinator (7 métodos)
│   ├── admin.coordinator.ts             ← AdminCoordinator implements IAdminCoordinator
│   ├── mecanico.coordinator.ts          ← MecanicoCoordinator implements IMecanicoCoordinator
│   └── index.ts
├── hooks/
│   └── useStoreReactive.ts              ← suscripción al store para re-renders
├── view-models/
│   ├── admin/
│   │   ├── useAdminLayout.view-model.ts
│   │   ├── useCola.view-model.ts
│   │   ├── useTickets.view-model.ts
│   │   └── useHistorial.view-model.ts
│   ├── mecanico/
│   │   ├── useMecanicoLayout.view-model.ts
│   │   ├── useDashboard.view-model.ts
│   │   ├── useTaller.view-model.ts
│   │   └── useFichas.view-model.ts
│   └── ticket/
│       ├── useNuevoTicket.view-model.ts
│       └── useEditarTicket.view-model.ts
└── views/
    ├── shared/
    │   └── EstadoChip.tsx               ← chip de estado reutilizable
    ├── admin/
    │   ├── AdminLayoutView.tsx
    │   ├── ColaView.tsx
    │   ├── TicketsView.tsx
    │   └── HistorialView.tsx
    ├── mecanico/
    │   ├── MecanicoLayoutView.tsx
    │   ├── DashboardView.tsx
    │   ├── TallerView.tsx
    │   └── FichasView.tsx
    └── ticket/
        ├── NuevoTicketView.tsx
        └── EditarTicketView.tsx
```

#### `coordinators/`

Encapsulan todas las decisiones de navegación. El resto del sistema nunca llama `router.push(...)` directamente — siempre usa un método del coordinator.

**`interfaces/router.port.ts`** — `IRouter` es la interfaz mínima `{ push, replace, back }`. Los coordinators la reciben en el constructor en vez del `AppRouterInstance` de Next.js. Esto los hace testeables sin instanciar el router real.

**`admin.coordinator.ts` / `mecanico.coordinator.ts`** — implementan sus interfaces respectivas. Cada método es una línea: `goToCola() { this.router.push("/admin/cola"); }`. Si una ruta cambia, solo cambia aquí.

#### `hooks/`

**`useStoreReactive.ts`** — hook compartido por todos los ViewModels. Se suscribe a `mockStore` y fuerza un re-render cuando el store notifica un cambio. Vive en `presentation/` (no en `lib/mock/`) para que cuando llegue Convex se reemplace por un hook de `useQuery` en un solo archivo.

#### `view-models/`

Un ViewModel por página o layout. Cada uno sigue el mismo patrón:

```typescript
export function useColaViewModel(coordinator: IAdminCoordinator): ColaVM {
  useStoreReactive()                                    // 1. reactivity
  const session  = getMockSession()                    // 2. sesión
  const empleado = empleadoModule.getEmpleadoById...   // 3. resolver empleado
  const cola     = ticketModule.getTickets...           // 4. datos
  return { empleado, cola, onDecision: (...) => ... }  // 5. interfaz plana para la View
}
```

El ViewModel nunca importa componentes React. La View nunca importa módulos ni el store.

#### `views/`

Componentes React puramente presentacionales. Reciben props, emiten eventos vía callbacks. Sin `useEffect`, sin llamadas a módulos, sin navegación directa.

**`shared/EstadoChip.tsx`** — único componente reutilizable entre admin y mecánico. Recibe `TicketEstado` y devuelve el chip con el color y label correspondiente.

Los subdirectorios `admin/`, `mecanico/`, `ticket/` agrupan las Views por contexto de uso.

---

## `src/app/` — Next.js App Router (thin shells)

Las pages son la capa más delgada posible. Su único trabajo es:
1. Instanciar el coordinator con `useMemo(() => new XxxCoordinator(useRouter()), [router])`
2. Llamar al ViewModel correspondiente
3. Renderizar la View

```
app/
├── layout.tsx                    ← root layout (Once UI providers)
├── page.tsx                      ← animación intro → redirige a /login
├── login/page.tsx                ← único page que aún usa lib/db (sin MVVM-C)
├── not-found.tsx
├── admin/
│   ├── layout.tsx                ← thin shell: AdminCoordinator + useAdminLayoutViewModel
│   ├── cola/page.tsx             ← thin shell: useColaViewModel + ColaView
│   ├── tickets/page.tsx          ← thin shell: useTicketsViewModel + TicketsView
│   └── historial/[id]/page.tsx   ← thin shell: useHistorialViewModel + HistorialView
├── (mecanico)/
│   ├── layout.tsx                ← thin shell: MecanicoCoordinator + useMecanicoLayoutViewModel
│   ├── dashboard/page.tsx        ← thin shell
│   ├── taller/page.tsx           ← thin shell
│   └── fichas/page.tsx           ← thin shell
└── ticket/
    ├── nuevo/page.tsx            ← thin shell
    └── [id]/editar/page.tsx      ← thin shell
```

El grupo `(mecanico)` sin paréntesis en la URL agrupa las rutas del mecánico bajo un layout compartido sin afectar la URL.

---

## `src/lib/` — Capa mock legacy

```
lib/
├── mock/
│   ├── store.ts    ← MockStore: motor de datos en memoria + localStorage + pub/sub
│   ├── data.ts     ← tipos MockTicket/MockEmpleado/MockHistorial + seed data
│   └── hooks.ts    ← hooks React del camino antiguo + getMockSession/clearMockSession
└── db.ts           ← facade: re-exporta hooks y tipos con nombres canónicos
```

**`store.ts`** — clase `MockStore` (singleton). Almacena tickets, empleados e historial en memoria, persiste en `localStorage`, y notifica a suscriptores con `notify()`. Es el motor reactivo que reemplaza a Convex durante desarrollo.

**`data.ts`** — tipos con nomenclatura de Convex (`_id`, `_creationTime`) y seed data con 7 tickets y 3 empleados que cubren todos los estados y casos edge.

**`hooks.ts`** — hooks del camino antiguo (`useMockTickets`, `useMockAuth`, etc.). Los ViewModels nuevos no los importan; solo los usan componentes del camino antiguo (`login/page.tsx`). También exporta `getMockSession()` y `clearMockSession()` — sí los usan los ViewModels nuevos (son utilidades de sesión, no hooks reactivos del store).

**`db.ts`** — re-exporta con nombres limpios (sin prefijo `Mock`). Cuando llegue Convex real, este archivo cambia internamente y los componentes que lo usan no se tocan.

---

## `src/resources/` — Configuración Once UI

```
resources/
├── once-ui.config.ts   ← tema, fuentes, rutas registradas, breakpoints
├── custom.css          ← tokens --sp-* del design system Modern Pulse
├── content.tsx         ← metadatos de la app (nombre, descripción)
├── icons.ts            ← registro de iconos custom
└── index.ts            ← barrel
```

**`custom.css`** — define las variables `--sp-primary: #bc0100`, `--sp-background: #fff8f7`, etc. También las clases `.sp-card`, `.sp-btn-primary`, `.sp-nav-item` que usan las páginas admin (que no usan componentes Once UI).

---

## Regla de importación resumida

| Desde | Puede importar de |
|---|---|
| `domain/` | `shared/domain` únicamente |
| `application/` | `domain/` del mismo módulo + `shared/domain` |
| `infrastructure/` | `application/` + `domain/` del mismo módulo + `lib/mock/` |
| `presentation/view-models/` | `modules/*/infrastructure/*-module` + `modules/*/domain` + `lib/mock/hooks` (solo `getMockSession`) + `presentation/hooks` + `presentation/coordinators` |
| `presentation/views/` | `modules/*/domain` (tipos) + `presentation/view-models` (interfaces) + `presentation/views/shared` |
| `app/**/page.tsx` | `presentation/` + `next/navigation` |
