# Desarrollo Local — Capa de Mocks

## Contexto

`npx convex dev --dev-deployment local` requiere login de cuenta Convex aunque el runtime corra en la máquina local. No es offline puro: el setup inicial necesita autenticación en sus servidores.

Para desarrollo de UI sin ninguna dependencia externa se implementó una **capa de mocks** que replica la API de Convex con estado en memoria + localStorage. Cuando el backend Convex esté listo, el swap es de dos líneas — los componentes no cambian.

---

## Archivos

```
next/src/lib/
├── db.ts                ← punto de entrada único — aquí importan TODOS los componentes
└── mock/
    ├── data.ts          ← tipos TypeScript + constantes seed
    ├── store.ts         ← MockStore: estado reactivo en memoria + localStorage
    └── hooks.ts         ← hooks React con misma firma que Convex
```

---

## `mock/data.ts` — Tipos y seed data

Define los tipos que replican el schema Convex (misma forma, mismos campos `_id`, `_creationTime`). Estos tipos son los que exporta `db.ts` hacia los componentes.

### Tipos

```typescript
type TicketEstado =
  | "pendiente_revision"   // recién creado, esperando triage del admin
  | "requiere_cambios"     // admin rechazó — mecánico debe corregir
  | "aprobado"             // admin aprobó — visible en listado global
  | "en_progreso"          // trabajo activo en taller
  | "bloqueado"            // detenido (falta pieza, bloqueado por tercero)
  | "urgente"              // requiere atención inmediata
  | "finalizado";          // trabajo completado

type TicketCategoria =
  | "incidencia" | "reparacion" | "reclamo" | "mantenimiento"
  | "aceite" | "frenos" | "neumaticos" | "otros";

type Rol = "mecanico" | "admin";
```

### Interfaces

```typescript
interface MockTicket {
  _id: string;
  _creationTime: number;       // timestamp ms — igual que Convex
  matricula: string;           // placa del bus — campo obligatorio (Regla 1)
  categoria: TicketCategoria;
  titulo: string;
  descripcion: string;
  estado: TicketEstado;
  creadorId: string;           // ref a MockEmpleado._id
  fechaUltimaModificacion: number;
  notaAdmin?: string;          // nota de rechazo del admin
  bahia?: string;              // bahía de trabajo asignada
}

interface MockEmpleado {
  _id: string;
  nombre: string;
  email: string;
  rol: Rol;
  identificadorAutenticacion: string;  // equivale a userId de Convex Auth
}

interface MockHistorial {
  _id: string;
  _creationTime: number;
  ticketId: string;
  empleadoId: string;
  tipoAccion: "CREACION" | "CAMBIO_ESTADO" | "EDICION_TEXTO";
  detallesCambio?: string;  // JSON stringificado con el diff
}

interface MockDraft {  // solo localStorage, nunca va al store
  id: string;
  matricula: string;
  categoria: TicketCategoria;
  titulo: string;
  descripcion: string;
  guardadoEn: string;
}
```

### Seed data

**Empleados (3):**
| `_id` | nombre | rol | `identificadorAutenticacion` |
|-------|--------|-----|------------------------------|
| `emp_juan` | Juan Pérez | mecanico | `auth_juan` |
| `emp_rodriguez` | M. Rodriguez | mecanico | `auth_rodriguez` |
| `emp_admin` | Admin Taller | admin | `auth_admin` |

**Tickets (7) — todos los estados cubiertos:**
| `_id` | matrícula | estado | creador |
|-------|-----------|--------|---------|
| `tk_001` | 4829-KXL | `en_progreso` | emp_juan |
| `tk_002` | 1122-CMM | `bloqueado` | emp_rodriguez |
| `tk_003` | 9901-BBD | `finalizado` | emp_juan |
| `tk_004` | 3312-HGT | `urgente` | emp_juan |
| `tk_005` | VOLVO-FH16 | `requiere_cambios` + `notaAdmin` | emp_juan |
| `tk_006` | SCANIA-R500 | `requiere_cambios` + `notaAdmin` | emp_juan |
| `tk_007` | MERCEDES-ACTROS | `pendiente_revision` | emp_juan |

**Historial (2):** ticket `tk_001` — CREACION + CAMBIO_ESTADO (pendiente → en_progreso por admin).

**`WORKSHOP_CATEGORIAS`:** array de `{ value, label }` para poblar el `<Select>` del formulario.

---

## `mock/store.ts` — MockStore

Clase singleton que centraliza todo el estado de la app durante desarrollo. Resuelve dos problemas: persistencia entre recargas y reactividad entre componentes.

### Patrón de suscripciones (reactividad)

```
componente monta
    └── useStoreVersion() → mockStore.subscribe(rerender)
                                        │
mutación ocurre                        │ Set<Listener>
    └── store.crearTicket()            │
             └── store.notify() ───────┘──→ rerender() en cada componente suscrito
                                            → React lee estado nuevo del store
                                            → UI actualizada
componente desmonta
    └── cleanup: listeners.delete(fn)
```

`notify()` es síncrono — no hay debounce ni batch. Cada mutación dispara un re-render inmediato en todos los componentes que usan hooks del store.

### Persistencia localStorage

Al construirse, el store intenta leer de localStorage (datos de sesión anterior). Si no existe o está corrupto, usa el seed de `data.ts`.

```typescript
constructor() {
  this.tickets  = this.load("servicar_mock_tickets",   MOCK_TICKETS);
  this.empleados = MOCK_EMPLEADOS;  // inmutable en v1 — no persiste
  this.historial = this.load("servicar_mock_historial", MOCK_HISTORIAL);
}
```

Cada mutación llama `this.save(key, data)` antes de `this.notify()` — el orden garantiza que si la página recarga entre los dos pasos, los datos están guardados.

### Keys de localStorage
| key | contenido |
|-----|-----------|
| `servicar_mock_tickets` | array `MockTicket[]` serializado |
| `servicar_mock_historial` | array `MockHistorial[]` serializado |
| `servicar_mock_session` | `{ empleadoId: string }` (manejado por `hooks.ts`) |

### Audit log automático

`registrarHistorial()` es privado. Se llama internamente desde cada mutación, igual que el `internalMutation` en Convex:

```typescript
crearTicket(data)     → registrarHistorial(id, creadorId, "CREACION",      { estado_nuevo })
editarTicket(...)     → registrarHistorial(id, empleadoId, "EDICION_TEXTO", { campos cambiados })
cambiarEstado(...)    → registrarHistorial(id, empleadoId, "CAMBIO_ESTADO", { anterior, nuevo, nota })
```

Los componentes nunca llaman `registrarHistorial` directamente — replica la Regla 5 del dominio (inmutabilidad del historial).

### API del store

```typescript
// Tickets
mockStore.getTickets()                          → MockTicket[]
mockStore.getTicketsByEstado(estado)            → MockTicket[]
mockStore.getTicketsByCreador(creadorId)        → MockTicket[]
mockStore.getTicketById(id)                     → MockTicket | null
mockStore.crearTicket(data)                     → string (nuevo _id)
mockStore.editarTicket(id, empleadoId, data)    → void
mockStore.cambiarEstado(id, empleadoId, estado, notaAdmin?) → void

// Empleados
mockStore.getEmpleados()                        → MockEmpleado[]
mockStore.getEmpleadoById(id)                   → MockEmpleado | null
mockStore.getEmpleadoByAuth(authId)             → MockEmpleado | null

// Historial
mockStore.getHistorialByTicket(ticketId)        → MockHistorial[] (ordenado por fecha asc)

// Suscripción
mockStore.subscribe(fn)                         → () => void (unsub)

// Utilidades
mockStore.reset()                               → void (restaura seed, borra localStorage)
```

---

## `mock/hooks.ts` — Hooks React

### `useStoreVersion()` — el motor de reactividad

```typescript
function useStoreVersion() {
  const [, rerender] = useReducer((x: number) => x + 1, 0);
  useEffect(() => mockStore.subscribe(rerender), []);
}
```

Incrementa un contador interno cada vez que el store notifica. React ve el estado cambiado y re-renderiza el componente. El valor del contador no se usa — solo importa que cambió.

### Sesión mock (auth)

La sesión se guarda en `localStorage` bajo `servicar_mock_session: { empleadoId }`. No está en el store reactivo porque un cambio de sesión implica navegación completa — no se necesita re-render parcial.

```typescript
// Funciones auxiliares (no son hooks)
getMockSession()          → { empleadoId } | null
setMockSession(id)        → void
clearMockSession()        → void
```

`useMockAuth()` lee la sesión en cada render y resuelve el empleado del store. Si la sesión no existe o el empleado no se encuentra, `isAuthenticated = false`.

### Hooks de query

Todos siguen el mismo patrón: suscribirse al store + leer datos síncronos.

```typescript
export function useMockTickets() {
  useStoreVersion();           // re-render cuando el store muta
  return mockStore.getTickets(); // lectura síncrona — sin loading state
}
```

No hay estado de carga (`isLoading`) en los queries mock porque la lectura es síncrona. Convex real sí tiene estado de carga — si esto es un problema para testing de UI, agregar `undefined` como valor inicial.

### Hooks de mutation

Devuelven una función estable con `useCallback(fn, [])`. El componente la llama directamente — no hay `async/await` necesario en modo mock (el store muta síncronamente).

```typescript
const crearTicket = useCrearTicket();
crearTicket({ matricula, categoria, titulo, descripcion, creadorId });
// → store muta → notify() → todos los useQuery re-renderizan
```

En Convex real, las mutations son `async`. Para compatibilidad futura, los componentes pueden usar `await` aunque el mock sea síncrono — no rompe nada.

---

## `db.ts` — Punto de entrada único

Re-exporta todo con los nombres canónicos (sin prefijo `Mock`). Los componentes importan de aquí, nunca de `./mock/*` directamente.

```typescript
// Hooks
export { useMockAuth       as useAuth        } from "./mock/hooks";
export { useMockTickets    as useTickets     } from "./mock/hooks";
export { useMockCrearTicket as useCrearTicket } from "./mock/hooks";
// ... etc

// Tipos
export type { MockTicket   as Ticket   } from "./mock/data";
export type { MockEmpleado as Empleado } from "./mock/data";
// ... etc

// Constantes
export { WORKSHOP_CATEGORIAS, MOCK_EMPLEADOS } from "./mock/data";
export { mockStore } from "./mock/store";  // solo para reset/debug
```

---

## Uso en componentes

```typescript
// Importar SIEMPRE de @/lib/db
import {
  useAuth,
  useTickets,
  useTicketsByCreador,
  useCambiarEstado,
  type Ticket,
  type TicketEstado,
} from "@/lib/db";

export default function WorkshopsView() {
  const { empleado } = useAuth();
  const tickets = useTickets();                              // todos
  // const tickets = useTicketsByCreador(empleado!._id);    // solo los míos
  const cambiarEstado = useCambiarEstado();

  const handleFinalizar = (id: string) => {
    cambiarEstado(id, empleado!._id, "finalizado");
    // → store muta → notify() → este componente y cualquier otro que
    //   use useTickets() se re-renderizan automáticamente
  };
}
```

---

## Variables de entorno

```env
# .env.local
NEXT_PUBLIC_USE_MOCK=true    # desarrollo sin Convex
# NEXT_PUBLIC_USE_MOCK=false # Convex real (requiere NEXT_PUBLIC_CONVEX_URL)
```

---

## Reset de datos

```typescript
import { mockStore } from "@/lib/db";
mockStore.reset();
// Borra servicar_mock_tickets y servicar_mock_historial de localStorage
// Restaura los 7 tickets + 2 historial del seed original
// Notifica a todos los componentes suscritos → UI actualiza sola
```

---

## Migración a Convex real

Cuando el backend Convex esté listo (Fase 1-2):

**1.** Crear `src/lib/convex/hooks.ts` con los hooks reales:
```typescript
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useTickets() {
  return useQuery(api.tickets.listarTodos) ?? [];
}
export function useCrearTicket() {
  return useMutation(api.tickets.crear);
}
// ... etc — mismos nombres, mismas firmas
```

**2.** Actualizar `db.ts` para condicionar por env:
```typescript
// En db.ts — los componentes no tocan nada
if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
  export * from "./mock/hooks";
} else {
  export * from "./convex/hooks";
}
```

**3.** Cambiar `.env.local`:
```env
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_CONVEX_URL=https://xxxx.convex.cloud
```

Los componentes no cambian — misma API, distinto origen.

---

## Opción alternativa: Convex con cuenta gratuita

Si se prefiere usar Convex real desde el principio:

```bash
# Crear cuenta en dashboard.convex.dev (gratis)
# Luego, una sola vez:
npx convex dev --configure new --dev-deployment local
# Login interactivo en browser → después corre local sin cloud queries
```

Post-setup el runtime Convex corre en la máquina local. Latencia cero, sin dependencia de red en el día a día.
