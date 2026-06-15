# `@servicar/persistence-pocketbase`

Implementación de la capa de persistencia de Servicar usando [PocketBase](https://pocketbase.io) como backend y servicio de autenticación.

Este paquete implementa los ports `ITicketRepository`, `IEmpleadoRepository` e `IHistorialRepository` de `@servicar/core`, reemplazando al mock en memoria cuando hay un servicio PocketBase disponible.

---

## Arquitectura general

```
PocketBase (HTTP / WebSocket)
        │
   ┌────▼────┐
   │ PbStore │  ← caché snapshot + suscripciones real-time
   └────┬────┘
        │ lee/escribe cache
        ▼
 PbTicketRepository      ─── implementa ITicketRepository
 PbHistorialRepository   ─── implementa IHistorialRepository
 PbEmpleadoRepository    ─── implementa IEmpleadoRepository
        │
        │ mapean tipos PB ↔ entidades de dominio
        ▼
 Ticket / HistorialEntry / Empleado   (@servicar/core)
```

El patrón clave es **snapshot cache**: al arrancar la app se carga todo el estado desde PocketBase de una vez, y a partir de ese momento el store mantiene ese snapshot actualizado en tiempo real vía subscripciones SSE. Los repositorios leen del snapshot (síncrono desde el punto de vista del dominio) y las escrituras van a PocketBase primero y luego actualizan el snapshot localmente.

---

## Colecciones PocketBase requeridas

Debes crear estas colecciones en el panel de administración de PocketBase antes de arrancar:

### `users` (colección de auth nativa)

Añadir dos campos extra:

| Campo   | Tipo   | Valores            |
|---------|--------|--------------------|
| `nombre`| text   | obligatorio        |
| `rol`   | select | `mecanico`, `admin`|

La autenticación usa email + contraseña nativa de PocketBase.

### `tickets`

| Campo                    | Tipo   | Notas                          |
|--------------------------|--------|--------------------------------|
| `matricula`              | text   | obligatorio                    |
| `categoria`              | select | ver `TicketCategoria` en core  |
| `titulo`                 | text   | obligatorio                    |
| `descripcion`            | text   | obligatorio                    |
| `estado`                 | select | ver `TicketEstado` en core     |
| `creadorId`              | text   | ID del usuario creador         |
| `fechaUltimaModificacion`| number | timestamp Unix en ms           |
| `notaAdmin`              | text   | opcional                       |
| `bahia`                  | text   | opcional                       |

> `id` y `created` los gestiona PocketBase automáticamente. El dominio usa el `id` de PB como identificador canónico del ticket.

### `historial_ediciones`

| Campo           | Tipo   | Notas                                         |
|-----------------|--------|-----------------------------------------------|
| `ticketId`      | text   | ID del ticket al que pertenece                |
| `empleadoId`    | text   | ID del usuario que realizó la acción          |
| `tipoAccion`    | select | `CREACION`, `CAMBIO_ESTADO`, `EDICION_TEXTO`  |
| `detallesCambio`| json   | opcional, objeto serializado como string      |

Esta colección es **solo lectura** para el dominio — nunca se borra ni se modifica una entrada existente.

---

## Módulos del paquete

### `pb-client.ts` — Singleton de PocketBase

```typescript
import { getPocketBase } from "@servicar/persistence-pocketbase";

const pb = getPocketBase("http://localhost:8090");
// Llamadas posteriores sin argumento devuelven la misma instancia
const pb2 = getPocketBase(); // misma instancia
```

`getPocketBase(url?)` crea la instancia de `PocketBase` y la reutiliza durante toda la vida del proceso. La URL por defecto es `http://127.0.0.1:8090` (desarrollo local). En producción pasa la URL de tu instancia:

```typescript
const pb = getPocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
```

---

### `PbStore` — Caché snapshot con real-time

Es el núcleo del módulo. Actúa como un almacén en memoria que:

1. Se **inicializa** cargando todos los datos de PocketBase en paralelo.
2. Se **mantiene actualizado** via subscripciones SSE de PocketBase (sin polling).
3. **Notifica** a los suscriptores React cuando cambia algo.
4. Expone **lecturas síncronas** (desde caché) y **escrituras asíncronas** (a PocketBase).

#### Ciclo de vida

```typescript
import { getPocketBase, PbStore } from "@servicar/persistence-pocketbase";

const pb = getPocketBase("http://localhost:8090");
const pbStore = new PbStore(pb);

// 1. Inicializar (una sola vez, al arrancar la app)
await pbStore.init();

// 2. Usar (a través de los repositorios)
const tickets = pbStore.getTickets(); // síncrono, desde caché

// 3. Destruir (al cerrar la app / desmontar)
await pbStore.destroy(); // cancela las subscripciones SSE
```

#### Qué hace `init()`

```
init()
 ├── getFullList("tickets")           ─┐
 ├── getFullList("users")              ├─ en paralelo
 └── getFullList("historial_ediciones")─┘
          │
          ▼ guarda en memoria
 subscribe("tickets", "*")       → actualiza cache y notifica
 subscribe("historial_ediciones", "*") → actualiza cache y notifica
          │
          ▼
 notify() → todos los listeners React re-renderizan
```

El `await` de `init()` resuelve cuando los tres `getFullList` han terminado y las subscripciones SSE están activas. A partir de ese momento el estado local siempre está a un evento de distancia del servidor.

#### Reactividad con React

`subscribe(fn)` registra un callback que se llama cada vez que el store cambia. En `next/`, el hook `useStoreReactive` usa esto para incrementar un `refreshKey` que fuerza re-fetch en los `useEffect` de los view models:

```typescript
// next/src/presentation/hooks/useStoreReactive.ts
export function useStoreReactive(): number {
  const [key, increment] = useReducer((x) => x + 1, 0);
  useEffect(() => mockStore.subscribe(increment), []);
  return key;
}
```

Para usar `PbStore` en lugar de `MockStore`, basta con cambiar la importación en ese hook.

#### Lecturas síncronas disponibles

| Método                         | Retorna              | Descripción                            |
|-------------------------------|----------------------|----------------------------------------|
| `getTickets()`                | `PbTicket[]`         | Todos los tickets                      |
| `getTicketById(id)`           | `PbTicket \| null`   | Ticket por ID                          |
| `getTicketsByEstado(estado)`  | `PbTicket[]`         | Filtrado por estado                    |
| `getTicketsByCreador(id)`     | `PbTicket[]`         | Filtrado por creador                   |
| `getUsers()`                  | `PbUser[]`           | Todos los usuarios                     |
| `getUserById(id)`             | `PbUser \| null`     | Usuario por ID                         |
| `getHistorialByTicket(ticketId)` | `PbHistorial[]`   | Entradas ordenadas por fecha           |

#### Escrituras asíncronas

| Método                          | Descripción                                              |
|--------------------------------|----------------------------------------------------------|
| `upsertTicket(id, data)`       | Crea o actualiza un ticket en PB y en caché              |
| `appendHistorial(data)`        | Crea una entrada de historial en PB y en caché           |

Las escrituras actualizan la caché inmediatamente (actualización optimista) y también disparan la subscripción SSE, que puede generar una segunda actualización (idempotente ya que filtra por ID).

---

### `PbAuthService` — Autenticación

```typescript
import { getPocketBase, PbAuthService } from "@servicar/persistence-pocketbase";

const pb = getPocketBase();
const auth = new PbAuthService(pb);

// Login
const result = await auth.login("juan@servicar.com", "contraseña");
// result: { empleadoId, nombre, rol, token }

// Estado
auth.isAuthenticated   // boolean
auth.currentEmpleadoId // string | null (ID del usuario autenticado)

// Logout
auth.logout();
```

Tras un `login` exitoso, el SDK de PocketBase guarda el token automáticamente en `pb.authStore`. Todas las llamadas posteriores al SDK incluyen ese token en los headers.

El `empleadoId` retornado por `login` es el ID nativo de PocketBase del usuario. Este mismo ID es el que usan `IEmpleadoRepository.getById()` y `getByAuthId()` — en PocketBase son la misma cosa.

---

### `PbTicketRepository` — Repositorio de tickets

Implementa `ITicketRepository` de `@servicar/core`. Todas las operaciones leen de la caché de `PbStore` y las escrituras pasan por el store.

```typescript
import { PbTicketRepository } from "@servicar/persistence-pocketbase";

const repo = new PbTicketRepository(pbStore);

// Lecturas (retornan Promise pero resuelven instantáneamente desde caché)
const tickets = await repo.getAll();
const ticket  = await repo.getById("tk_1718400000000");
const cola    = await repo.getByEstado("pendiente_revision");
const mios    = await repo.getByCreador("empleado_abc123");

// Escritura
// ticket.pendingHistorial contiene las entradas de historial generadas
// por la operación de dominio (ej. cambiarEstado, editar, crear).
// save() persiste el ticket Y drena el historial pendiente.
await repo.save(ticket);
```

El flujo de `save()` es:

```
save(ticket)
 ├── upsertTicket(ticket.id, data)          → PocketBase tickets collection
 └── for each entry in ticket.pendingHistorial:
       appendHistorial(entryData)            → PocketBase historial_ediciones
```

---

### `PbHistorialRepository` — Repositorio de historial

Implementa `IHistorialRepository`. Solo lectura — las escrituras las hace `PbTicketRepository.save()`.

```typescript
const historialRepo = new PbHistorialRepository(pbStore);
const historial = await historialRepo.getByTicket("tk_1718400000000");
// → HistorialEntry[] ordenado por fecha, del más antiguo al más nuevo
```

---

### `PbEmpleadoRepository` — Repositorio de empleados

Implementa `IEmpleadoRepository`. Los empleados no se crean/modifican desde la app (eso se hace en el panel de PocketBase), así que este repositorio es solo lectura.

```typescript
const empleadoRepo = new PbEmpleadoRepository(pbStore);

const todos   = await empleadoRepo.getAll();
const por_id  = await empleadoRepo.getById("abc123");
const por_auth = await empleadoRepo.getByAuthId("abc123"); // mismo que getById
```

`getByAuthId(authId)` es idéntico a `getById(authId)` porque en PocketBase el ID del registro de usuario **es** el ID de autenticación.

---

### Mappers

Los mappers traducen entre el formato de PocketBase (JSON plano) y las entidades de dominio inmutables de `@servicar/core`.

#### `pb-ticket.mapper.ts`

| Función                | Dirección            |
|------------------------|----------------------|
| `pbTicketToEntity`     | `PbTicket` → `Ticket`|
| `entityToPbTicketData` | `Ticket` → datos para PB (sin `id` ni `created`) |
| `pbHistorialToEntity`  | `PbHistorial` → `HistorialEntry` |
| `entityToPbHistorialData` | `HistorialEntry` → datos para PB |

Nota importante sobre `creationTime`: el mapper usa `new Date(raw.created).getTime()` para convertir el timestamp ISO de PocketBase a milisegundos Unix. Esto significa que `Ticket.creationTime` refleja el timestamp del servidor, no el del cliente.

#### `pb-empleado.mapper.ts`

| Función           | Dirección           |
|-------------------|---------------------|
| `pbUserToEmpleado`| `PbUser` → `Empleado`|

El campo `Empleado.authId` se asigna al mismo valor que `Empleado.id` (el ID de PocketBase), ya que en este backend son la misma cosa.

---

## Cómo conectarlo en Next.js

Actualmente `next/src/modules/*/infrastructure/` usa el mock. Para cambiar a PocketBase:

### 1. Reemplazar los módulos de DI

```typescript
// next/src/modules/ticket/infrastructure/ticket-module.ts
import { getPocketBase, PbStore, PbTicketRepository, PbHistorialRepository } from "@servicar/persistence-pocketbase";
import {
  CrearTicketUseCase, EditarTicketUseCase, CambiarEstadoUseCase,
  GetTicketsQuery, GetTicketByIdQuery, GetTicketsPorEstadoQuery,
  GetTicketsPorCreadorQuery, GetHistorialQuery,
} from "@servicar/core";

const pb = getPocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
export const pbStore = new PbStore(pb);

const ticketRepo    = new PbTicketRepository(pbStore);
const historialRepo = new PbHistorialRepository(pbStore);

export const ticketModule = {
  crearTicket:          new CrearTicketUseCase(ticketRepo),
  editarTicket:         new EditarTicketUseCase(ticketRepo),
  cambiarEstado:        new CambiarEstadoUseCase(ticketRepo),
  getTickets:           new GetTicketsQuery(ticketRepo),
  getTicketById:        new GetTicketByIdQuery(ticketRepo),
  getTicketsPorEstado:  new GetTicketsPorEstadoQuery(ticketRepo),
  getTicketsPorCreador: new GetTicketsPorCreadorQuery(ticketRepo),
  getHistorial:         new GetHistorialQuery(historialRepo),
};
```

### 2. Inicializar el store al arrancar

En un Server Component o en `app/layout.tsx`, llama a `init()` antes de que los clientes necesiten datos:

```typescript
// Opción A: en un Server Component que envuelve la app
import { pbStore } from "@/modules/ticket/infrastructure/ticket-module";
await pbStore.init();
```

### 3. Actualizar `useStoreReactive`

Cambia la importación del store en el hook de reactividad:

```typescript
// next/src/presentation/hooks/useStoreReactive.ts
import { pbStore } from "@/modules/ticket/infrastructure/ticket-module";

export function useStoreReactive(): number {
  const [key, increment] = useReducer((x) => x + 1, 0);
  useEffect(() => pbStore.subscribe(increment), []);
  return key;
}
```

### 4. Variable de entorno

```bash
# .env.local
NEXT_PUBLIC_POCKETBASE_URL=http://localhost:8090
```

---

## Diferencias clave respecto al mock

| Aspecto              | `MockStore`                     | `PbStore`                             |
|---------------------|---------------------------------|---------------------------------------|
| Persistencia        | `localStorage` del navegador    | PocketBase (PostgreSQL o SQLite)      |
| Datos iniciales     | `MOCK_EMPLEADOS` / `MOCK_TICKETS` en código | Colecciones de PocketBase          |
| Tiempo real         | `notify()` local tras cada mutación | SSE de PocketBase + `notify()`    |
| IDs                 | `tk_${timestamp}` generados en dominio | mismos IDs, pasados como custom ID a PB |
| Auth                | `getMockSession()` en localStorage | `PbAuthService.login()` → token JWT |
| Multi-usuario       | No (localStorage es por pestaña) | Sí (el servidor es la fuente de verdad) |

---

## Arrancar PocketBase en desarrollo

```bash
# Descargar el binario desde https://pocketbase.io/docs/
./pocketbase serve

# Panel de administración → http://127.0.0.1:8090/_/
# Crear colecciones tickets, historial_ediciones, y añadir campos a users
```
