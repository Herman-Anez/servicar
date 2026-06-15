# Arquitectura de Módulos — Servicar

Documento técnico de la arquitectura adoptada. Describe el patrón, la estructura de carpetas, las reglas de dependencia, y cómo fluyen los datos desde la UI hasta la persistencia.

---

## Patrón adoptado

Se combinan tres patrones complementarios:

| Patrón | Propósito |
|---|---|
| **DDD** (Domain-Driven Design) | El dominio del negocio es el núcleo. Las reglas viven en entidades y value objects, no en componentes ni en la base de datos. Los Aggregate Roots son los únicos puntos de entrada al aggregate — un repositorio por AR |
| **Hexagonal** (Ports & Adapters) | El dominio define interfaces (puertos). La infraestructura implementa esos puertos (adaptadores). Nunca al revés |
| **MVVM-C** | En la capa de presentación: View (JSX puro), ViewModel (hook de composición), Coordinator (navegación) |

### Regla fundamental de dependencia

```
shared/domain  ←  ticket/domain  ←  ticket/application  ←  ticket/infrastructure
                                                         ←  presentation (MVVM-C)
```

Las flechas indican "depende de". El dominio no importa nada de React, Next.js, ni de la base de datos. Si un archivo en `domain/` tiene `import { useState }`, es un error.

---

## Estructura de carpetas

```
src/
├── modules/
│   ├── shared/
│   │   └── domain/                    ← Shared Kernel
│   │       ├── aggregate-root.ts      ← clase base AggregateRoot (marker)
│   │       ├── ticket-estado.ts
│   │       ├── ticket-categoria.ts
│   │       ├── rol.ts
│   │       └── index.ts
│   │
│   ├── ticket/                        ← Bounded Context: Ticket
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── ticket.entity.ts
│   │   │   │   └── historial-entry.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   └── matricula.vo.ts
│   │   │   ├── ports/                 ← puertos de salida (out)
│   │   │   │   ├── ticket.repository.port.ts
│   │   │   │   └── historial.repository.port.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── application/
│   │   │   ├── dtos/
│   │   │   │   ├── crear-ticket.dto.ts
│   │   │   │   ├── editar-ticket.dto.ts
│   │   │   │   └── cambiar-estado.dto.ts
│   │   │   ├── ports-in/              ← puertos de entrada (in)
│   │   │   │   ├── crear-ticket.use-case.port.ts
│   │   │   │   ├── editar-ticket.use-case.port.ts
│   │   │   │   ├── cambiar-estado.use-case.port.ts
│   │   │   │   ├── get-tickets.query.port.ts
│   │   │   │   ├── get-ticket-by-id.query.port.ts
│   │   │   │   ├── get-tickets-por-estado.query.port.ts
│   │   │   │   ├── get-tickets-por-creador.query.port.ts
│   │   │   │   └── get-historial.query.port.ts
│   │   │   ├── use-cases/
│   │   │   │   ├── crear-ticket.use-case.ts
│   │   │   │   ├── editar-ticket.use-case.ts
│   │   │   │   └── cambiar-estado.use-case.ts
│   │   │   ├── queries/
│   │   │   │   ├── get-tickets.query.ts
│   │   │   │   ├── get-ticket-by-id.query.ts
│   │   │   │   ├── get-tickets-por-estado.query.ts
│   │   │   │   ├── get-tickets-por-creador.query.ts
│   │   │   │   └── get-historial.query.ts
│   │   │   └── index.ts
│   │   │
│   │   └── infrastructure/
│   │       ├── persistence/
│   │       │   └── mock/              ← adaptador actual (localStorage)
│   │       │       ├── mock-ticket.mapper.ts
│   │       │       ├── mock-ticket.repository.ts
│   │       │       └── mock-historial.repository.ts
│   │       │   (futuro: convex/)      ← adaptador Convex — mismo slot
│   │       └── ticket-module.ts       ← service locator / DI manual
│   │
│   └── empleado/                      ← Bounded Context: Empleado ✅
│       ├── domain/
│       │   ├── entities/
│       │   │   └── empleado.entity.ts ← Empleado (reconstitute + getters)
│       │   ├── ports/
│       │   │   └── empleado.repository.port.ts ← IEmpleadoRepository
│       │   └── index.ts
│       ├── application/
│       │   ├── dtos/
│       │   │   └── autenticar-empleado.dto.ts
│       │   ├── ports-in/
│       │   │   ├── autenticar-empleado.use-case.port.ts
│       │   │   ├── get-empleado-by-id.query.port.ts
│       │   │   └── get-empleados.query.port.ts
│       │   ├── use-cases/
│       │   │   └── autenticar-empleado.use-case.ts
│       │   ├── queries/
│       │   │   ├── get-empleado-by-id.query.ts
│       │   │   └── get-empleados.query.ts
│       │   └── index.ts
│       └── infrastructure/
│           ├── persistence/mock/
│           │   ├── mock-empleado.mapper.ts
│           │   └── mock-empleado.repository.ts
│           └── empleado-module.ts     ← service locator
│
├── presentation/                      ← Cross-cutting — Coordinators ✅
│   └── coordinators/
│       ├── interfaces/
│       │   ├── router.port.ts               ← IRouter { push, replace, back }
│       │   ├── admin.coordinator.port.ts    ← IAdminCoordinator
│       │   └── mecanico.coordinator.port.ts ← IMecanicoCoordinator
│       ├── admin.coordinator.ts
│       ├── mecanico.coordinator.ts
│       └── index.ts
│
└── lib/
    └── mock/
        ├── store.ts                   ← MockStore (motor pub/sub + localStorage)
        ├── hooks.ts                   ← hooks React del camino antiguo
        └── data.ts                    ← seed data + re-export tipos desde shared
```

---

## Capas en detalle

### 1. Shared Kernel (`modules/shared/domain/`)

Tipos puros que pertenecen al lenguaje ubicuo del dominio. No tienen lógica compleja, solo definiciones que todos los módulos comparten.

| Archivo | Contenido |
|---|---|
| `aggregate-root.ts` | `abstract class AggregateRoot` — marker. Los ARs la extienden; comunica que esa clase es el único punto de entrada a su aggregate y tiene repositorio propio |
| `ticket-estado.ts` | `TicketEstado` (union type) + `TICKET_ESTADO_TRANSITIONS` (mapa de transiciones válidas) + `isTransicionValida()` |
| `ticket-categoria.ts` | `TicketCategoria` (union type) + `WORKSHOP_CATEGORIAS` (array label/value para formularios) |
| `rol.ts` | `Rol` (`"mecanico" \| "admin"`) |

**Regla:** ningún archivo fuera de `shared/` redefine estos tipos. Todo importa desde `@/modules/shared/domain`.

---

### 2. Domain (`modules/ticket/domain/`)

El núcleo del sistema. Contiene las reglas de negocio reales. **Cero dependencias externas** — ni React, ni Next.js, ni Convex, ni localStorage.

#### Aggregate Roots

**`Ticket extends AggregateRoot`** — AR del bounded context Ticket.

```typescript
// Creación — valida, construye, emite HistorialEntry CREACION en pendingHistorial
const ticket = Ticket.create({ matricula, categoria, titulo, descripcion, creadorId });

// Reconstitución desde persistencia — sin validación, pendingHistorial vacío
const ticket = Ticket.reconstitute(props);

// Transición de estado — lanza si inválida; emite CAMBIO_ESTADO en pendingHistorial
const actualizado = ticket.cambiarEstado("aprobado", empleadoId);
const rechazado   = ticket.cambiarEstado("requiere_cambios", empleadoId, "Falta foto");

// Edición — emite EDICION_TEXTO en pendingHistorial
const editado = ticket.editar({ titulo: "Nuevo título" }, empleadoId);

// Historial pendiente — leído por ITicketRepository.save() para persistir en una sola operación
ticket.pendingHistorial // readonly HistorialEntry[]
```

Reglas que el dominio enforcea:
- `matricula`, `titulo`, `descripcion` son obligatorios al crear
- `cambiarEstado` rechaza transiciones no listadas en `TICKET_ESTADO_TRANSITIONS`
- `cambiarEstado("requiere_cambios")` exige `notaAdmin` no vacío
- Todas las operaciones mutantes devuelven **nueva instancia** (inmutabilidad)
- El AR es el único que crea `HistorialEntry` — garantiza que nunca falta un registro de auditoría

**`Empleado extends AggregateRoot`** — AR del bounded context Empleado. Solo `reconstitute()` (en producción vendrán de Convex Auth). Sin `pendingHistorial` — Empleado no tiene historial de negocio propio.

**`HistorialEntry`** — entidad interna del aggregate Ticket. Inmutable. Solo creada por `Ticket`. Nunca se edita ni elimina. Accedida desde fuera únicamente vía `IHistorialRepository.getByTicket()` (read model).

#### Value Objects

**`Matricula`** — envuelve un string. Valida que no esté vacío y normaliza a uppercase. En el futuro puede agregar validación de formato (regex de matrículas venezolanas) sin cambiar nada más.

```typescript
const m = new Matricula("4829-kxl"); // lanza si vacío
m.value   // "4829-KXL"
m.equals(new Matricula("4829-KXL")) // true
```

#### Puertos de salida (`domain/ports/`)

Interfaces que el dominio define y que la infraestructura debe implementar. El dominio solo conoce la interfaz, nunca la implementación concreta.

```typescript
// ITicketRepository — un repositorio por AR
getAll(): Ticket[]
getById(id: string): Ticket | null
getByEstado(estado: TicketEstado): Ticket[]
getByCreador(creadorId: string): Ticket[]
save(ticket: Ticket): void  // persiste ticket + drena ticket.pendingHistorial

// IHistorialRepository — read model (solo lectura)
// HistorialEntry solo se ESCRIBE a través de ITicketRepository.save()
getByTicket(ticketId: string): HistorialEntry[]
```

---

### 3. Application (`modules/ticket/application/`)

Orquesta el dominio. Cada caso de uso hace exactamente una cosa. No tiene lógica de negocio propia — esa vive en el dominio. No sabe nada de React ni de cómo se persisten los datos.

#### DTOs (Data Transfer Objects)

Contratos de entrada para cada operación. Son interfaces planas sin comportamiento.

```typescript
interface CrearTicketDTO   { matricula, categoria, titulo, descripcion, creadorId, bahia? }
interface EditarTicketDTO  { ticketId, empleadoId, campos: TicketCamposEditables }
interface CambiarEstadoDTO { ticketId, empleadoId, nuevoEstado, notaAdmin? }
```

#### Puertos de entrada (`application/ports-in/`)

Interfaces que los use cases y queries implementan. La capa de presentación (ViewModels) solo conoce estas interfaces — nunca instancia directamente un `CrearTicketUseCase`.

```typescript
interface ICrearTicketUseCase   { execute(dto: CrearTicketDTO): string }
interface IEditarTicketUseCase  { execute(dto: EditarTicketDTO): void }
interface ICambiarEstadoUseCase { execute(dto: CambiarEstadoDTO): void }

interface IGetTicketsQuery           { execute(): Ticket[] }
interface IGetTicketByIdQuery        { execute(id: string): Ticket | null }
interface IGetTicketsPorEstadoQuery  { execute(estado: TicketEstado): Ticket[] }
interface IGetTicketsPorCreadorQuery { execute(creadorId: string): Ticket[] }
interface IGetHistorialQuery         { execute(ticketId: string): HistorialEntry[] }
```

#### Use Cases

Cada clase recibe sus dependencias por constructor (inyección de dependencias). Los use cases de mutación **solo reciben `ITicketRepository`** — el historial se persiste automáticamente al guardar el AR (el ticket lleva el `pendingHistorial` consigo).

```typescript
// Ejemplo: CambiarEstadoUseCase
class CambiarEstadoUseCase implements ICambiarEstadoUseCase {
  constructor(private ticketRepo: ITicketRepository) {}   // solo ticketRepo

  execute(dto: CambiarEstadoDTO): void {
    const ticket = this.ticketRepo.getById(dto.ticketId);
    // AR valida transición Y emite HistorialEntry internamente
    const actualizado = ticket.cambiarEstado(dto.nuevoEstado, dto.empleadoId, dto.notaAdmin);
    // save() persiste ticket + drena actualizado.pendingHistorial
    this.ticketRepo.save(actualizado);
  }
}
```

`IHistorialRepository` solo aparece en **queries** (`GetHistorialQuery`), no en use cases de mutación.

#### Queries

Lectura pura. No mutan estado. Misma estructura que use cases pero sin historial.

---

### 4. Infrastructure (`modules/ticket/infrastructure/`)

Todo lo que depende del mundo exterior: base de datos, frameworks, librerías de terceros. Implementa los puertos que el dominio define.

#### Adaptador de persistencia: Mock

Mientras no exista Convex real, `MockTicketRepository` e `MockHistorialRepository` implementan los puertos del dominio usando `MockStore` (localStorage + pub/sub).

El **mapper** convierte entre el formato flat del store (`_id`, `_creationTime`) y las entidades de dominio (`id`, `creationTime`):

```typescript
mockTicketToEntity(raw: MockTicket): Ticket        // MockTicket → Ticket (reconstitute)
entityToMockTicket(ticket: Ticket): MockTicket      // Ticket → MockTicket
entityToMockHistorial(entry: HistorialEntry): MockHistorial
```

`MockTicketRepository.save()` persiste el ticket **y** drena `ticket.pendingHistorial`:

```typescript
save(ticket: Ticket): void {
  this.store.upsertTicket(entityToMockTicket(ticket));
  for (const entry of ticket.pendingHistorial) {
    this.store.appendHistorial(entityToMockHistorial(entry));
  }
}
```

`MockHistorialRepository` es **solo lectura** — solo implementa `getByTicket()`.

**Para migrar a Convex:** crear `ConvexTicketRepository implements ITicketRepository` en `persistence/convex/`. Solo se cambia `ticket-module.ts` — el resto del sistema no se toca.

#### Service Locator (`ticket-module.ts`)

Único lugar donde se instancian las clases concretas. Ensambla repositorios + use cases y los expone tipados como interfaces:

```typescript
export const ticketModule = {
  crearTicket:          ICrearTicketUseCase,
  editarTicket:         IEditarTicketUseCase,
  cambiarEstado:        ICambiarEstadoUseCase,
  getTickets:           IGetTicketsQuery,
  getTicketById:        IGetTicketByIdQuery,
  getTicketsPorEstado:  IGetTicketsPorEstadoQuery,
  getTicketsPorCreador: IGetTicketsPorCreadorQuery,
  getHistorial:         IGetHistorialQuery,
};
```

Los ViewModels importan `ticketModule` y llaman `ticketModule.crearTicket.execute(dto)`.

---

### 5. Presentation — MVVM-C (`src/presentation/`) ✅ Completo

#### Coordinators ✅

Viven en `src/presentation/coordinators/` — fuera de cualquier módulo porque las rutas admin cruzan tanto el contexto de ticket como el de empleado.

**Decisión de diseño clave:** los coordinators reciben `IRouter` (interfaz mínima propia) en lugar de `AppRouterInstance` de Next.js. Esto permite construir un `AdminCoordinator` en tests sin instanciar el router de Next.

```typescript
// interfaces/router.port.ts
interface IRouter { push(href: string): void; replace(href: string): void; back(): void; }

// admin.coordinator.ts
export class AdminCoordinator implements IAdminCoordinator {
  constructor(private readonly router: IRouter) {}

  goToCola()                         { this.router.push("/admin/cola"); }
  goToHistorial(ticketId: string)    { this.router.push(`/admin/historial/${ticketId}`); }
  goToNuevoTicket()                  { this.router.push("/ticket/nuevo"); }
  goToEditarTicket(ticketId: string) { this.router.push(`/ticket/${ticketId}/editar`); }
  goToTickets()                      { this.router.push("/admin/tickets"); }
  goToLogin()                        { this.router.replace("/login"); }
  goBack()                           { this.router.back(); }
}
```

La page instancia el coordinator con `useRouter()` como adaptador de `IRouter`:

```typescript
// app/admin/cola/page.tsx (futuro thin shell)
export default function ColaPage() {
  const router = useRouter(); // Next.js router satisface IRouter sin casting
  const coordinator = useMemo(() => new AdminCoordinator(router), [router]);
  const vm = useColaViewModel(coordinator);
  return <ColaView {...vm} />;
}
```

`MecanicoCoordinator` sigue el mismo patrón con rutas: `goToDashboard`, `goToTaller`, `goToFichas`, `goToNuevoTicket`, `goToEditarTicket(id)`, `goToLogin`, `goBack`.

#### View ✅

Componentes React puramente presentacionales. Reciben props, emiten eventos. Sin hooks de datos, sin lógica de negocio. Importan tipos del dominio (`Ticket`, `Empleado`, `TicketEstado`) pero nunca llaman a módulos ni a `mockStore`.

```
presentation/views/
├── shared/EstadoChip.tsx
├── admin/  AdminLayoutView, ColaView, TicketsView, HistorialView
├── mecanico/ MecanicoLayoutView, DashboardView, TallerView, FichasView
└── ticket/ NuevoTicketView, EditarTicketView
```

#### ViewModel ✅

Hook React que: llama `useStoreReactive()` para reactivity, resuelve sesión via `getMockSession()` + `empleadoModule`, orquesta `ticketModule`, transforma y devuelve el estado como interfaz plana para la View.

```typescript
// Patrón estándar
export function useColaViewModel(coordinator: IAdminCoordinator): ColaVM {
  useStoreReactive();                                              // suscripción al store
  const session  = getMockSession();
  const empleado = session ? empleadoModule.getEmpleadoById.execute(session.empleadoId) : null;
  const cola     = ticketModule.getTicketsPorEstado.execute("pendiente_revision");
  return {
    empleado, cola,
    onDecision: (id, decision) =>
      ticketModule.cambiarEstado.execute({ ticketId: id, empleadoId: empleado!.id, nuevoEstado: decision }),
    onVerHistorial: (id) => coordinator.goToHistorial(id),
  };
}
```

#### Page (thin shell) ✅

```typescript
// app/admin/cola/page.tsx — 6 líneas
export default function ColaPage() {
  const router = useRouter();
  const coordinator = useMemo(() => new AdminCoordinator(router), [router]);
  const vm = useColaViewModel(coordinator);
  return <ColaView {...vm} />;
}
```

---

## Flujo completo de una operación

### Ejemplo: Admin aprueba un ticket desde `/admin/cola`

```
1. Usuario hace click en "Aprobar"
   └─ ColaView llama props.onAprobar(ticketId)

2. ViewModel ejecuta el use case
   └─ ticketModule.cambiarEstado.execute({ ticketId, empleadoId, nuevoEstado: "aprobado" })

3. CambiarEstadoUseCase (solo recibe ITicketRepository)
   ├─ ticketRepo.getById(ticketId)
   │   └─ MockTicketRepository → mockStore.getTicketById() → Ticket.reconstitute()
   ├─ ticket.cambiarEstado("aprobado", empleadoId)
   │   ├─ isTransicionValida("pendiente_revision", "aprobado") → true ✓
   │   ├─ construye nueva instancia Ticket con estado "aprobado"
   │   └─ agrega HistorialEntry CAMBIO_ESTADO a _pendingHistorial del nuevo Ticket
   └─ ticketRepo.save(actualizado)
       ├─ mockStore.upsertTicket(ticket)          → localStorage
       ├─ mockStore.appendHistorial(entry)        → localStorage (por cada pendingHistorial)
       └─ mockStore.notify()

4. mockStore.notify()
   └─ todos los useStoreReactive() re-renderizan → UI actualizada
```

---

## Reglas para contribuir

### Lo que NUNCA debe cruzar las capas

| Desde | Hacia | Prohibido |
|---|---|---|
| `domain/` | `application/` | Importar use cases desde entidades |
| `domain/` | `infrastructure/` | Importar MockStore, React, Next.js |
| `application/` | `infrastructure/` | Importar implementaciones concretas de repositorios |
| `application/` | `presentation/` | Importar hooks React, componentes |
| Presentación | `domain/` directamente | Saltarse la capa de aplicación |

### Lo que SÍ debe importarse como interfaz

- Los ViewModels importan `ICrearTicketUseCase`, no `CrearTicketUseCase`
- Los use cases reciben `ITicketRepository`, no `MockTicketRepository`
- Las pages importan `ticketModule` / `empleadoModule`, no usan `mockStore` directamente
- Los ViewModels reciben `IAdminCoordinator` o `IMecanicoCoordinator`, no las clases concretas

### Señal de alarma

Si un archivo en `domain/` o `application/` necesita:
- `"use client"` → error: esas capas son framework-agnósticas
- `import { useRouter }` → error: la navegación pertenece al Coordinator
- `import { mockStore }` → error: solo `ticket-module.ts` conoce la implementación concreta

---

## Estado actual de implementación

| Capa | Estado | Notas |
|---|---|---|
| `shared/domain` | ✅ Completo | Incluye `AggregateRoot` marker |
| `ticket/domain` | ✅ Completo | `Ticket` y `Empleado` extienden `AggregateRoot`; `Ticket` emite `pendingHistorial` |
| `ticket/application` | ✅ Completo | Use cases de mutación solo reciben `ITicketRepository`; `IHistorialRepository` solo en queries |
| `ticket/infrastructure/persistence/mock` | ✅ Completo | `MockTicketRepository.save()` drena `pendingHistorial`; `MockHistorialRepository` solo lectura |
| `empleado/domain` | ✅ Completo | `Empleado extends AggregateRoot` |
| `empleado/application` | ✅ Completo | `AutenticarEmpleadoUseCase` + 2 queries |
| `empleado/infrastructure/persistence/mock` | ✅ Completo | |
| `presentation/coordinators` | ✅ Completo | `AdminCoordinator` + `MecanicoCoordinator` + interfaces |
| `presentation/hooks` | ✅ Completo | `useStoreReactive` |
| `presentation/views` | ✅ Completo | Admin (Cola/Tickets/Historial/Layout) + Mecánico (Dashboard/Taller/Fichas/Layout) + Ticket (Nuevo/Editar) + shared `EstadoChip` |
| `presentation/view-models` | ✅ Completo | Un ViewModel por página/layout |
| Pages → thin shells | ✅ Completo | Todas las pages migradas; `lib/db` solo queda en `login/page.tsx` |
