# Convex — Referencia del Proyecto Servicar

## ¿Qué es Convex?

Backend-as-a-Service (BaaS) que provee base de datos reactiva, funciones del servidor (queries/mutations/actions) y autenticación, todo en TypeScript. No hay REST API manual: los componentes React se suscriben directamente a queries y llaman mutations tipadas.

## Setup inicial

```bash
cd next/
npx convex dev   # Primera vez: crea proyecto en dashboard.convex.dev y genera convex/_generated/
```

Esto crea:
- `convex/` — carpeta con tus funciones del servidor
- `.env.local` con `NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud`

Arrancar en desarrollo (dos terminales):
```bash
# Terminal 1
npx convex dev

# Terminal 2
npm run dev
```

## Estructura de carpetas Convex

```
next/convex/
├── _generated/      # Auto-generado, no editar
│   ├── api.d.ts
│   ├── dataModel.d.ts
│   └── server.d.ts
├── schema.ts        # Definición de tablas y tipos
├── tickets.ts       # Queries y mutations de tickets
├── historial.ts     # Mutation de audit log (solo interna)
└── empleados.ts     # Query de perfil por auth ID
```

## Schema (`convex/schema.ts`)

Ver archivo completo en `docs/esquema_de_base_de_datos_convex.ts`. Estados del ticket para v1:

```typescript
estado: v.union(
  v.literal("pendiente_revision"),  // recién creado por mecánico
  v.literal("requiere_cambios"),    // admin rechazó, mecánico debe corregir
  v.literal("aprobado"),            // admin aprobó, pasa al listado global
  v.literal("en_progreso"),         // trabajo activo en taller
  v.literal("bloqueado"),           // detenido (falta pieza, etc.)
  v.literal("urgente"),             // requiere atención inmediata
  v.literal("finalizado")           // trabajo completado
)
```

## Patrón de uso en componentes React

### Leer datos (useQuery)

```typescript
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Se actualiza en tiempo real automáticamente
const tickets = useQuery(api.tickets.listarPorCreador, { creadorId });
```

### Escribir datos (useMutation)

```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const crear = useMutation(api.tickets.crear);

await crear({
  matricula: "ABC-1234",
  categoria: "incidencia",
  titulo: "Falla de frenos",
  descripcion: "...",
});
// El historial_ediciones se escribe internamente desde la mutation
```

### Autenticación (useConvexAuth)

```typescript
import { useConvexAuth } from "convex/react";

const { isAuthenticated, isLoading } = useConvexAuth();
```

## Mutations internas vs expuestas

- **Expuestas** (`query`, `mutation`): llamables desde el cliente React
- **Internas** (`internalMutation`): solo llamables desde otras funciones del servidor

`historial.registrarCambio` es `internalMutation` — se llama desde `tickets.crear`, `tickets.cambiarEstado`, etc., nunca desde el cliente.

## Reglas críticas (del dominio)

1. Toda mutation que modifique un ticket DEBE llamar `ctx.runMutation(internal.historial.registrarCambio, {...})` antes de retornar.
2. `historial_ediciones` no tiene mutations de update ni delete expuestas — inmutable por diseño.
3. La query pública `obtenerPorId` (para el portal cliente) debe filtrar tickets con estado `pendiente_revision` o `requiere_cambios` — esos no son visibles al público.

## Convex Auth

Usamos **Convex Auth** con provider `Password` (email + contraseña). No OAuth para v1.

```bash
npm install @convex-dev/auth
npx @convex-dev/auth
```

Configuración en `convex/auth.ts`:
```typescript
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
});
```

El campo `empleados.identificadorAutenticacion` guarda el `userId` de Convex Auth para vincular sesión con perfil de empleado.

## Variables de entorno

```env
# .env.local (generado por `npx convex dev`)
NEXT_PUBLIC_CONVEX_URL=https://xxxx.convex.cloud

# Para Convex Auth (agregar manualmente)
JWT_PRIVATE_KEY=...
JWKS=...
SITE_URL=http://localhost:3000
```

## Seed de datos de prueba

Correr desde dashboard.convex.dev → Functions → `empleados:seed`, o crear `convex/seed.ts` con `internalMutation` y ejecutar via `npx convex run seed:run`.

Usuarios de prueba v1:
| nombre | email | rol |
|--------|-------|-----|
| Juan Pérez | juan.perez@servicar.com | mecanico |
| M. Rodriguez | m.rodriguez@servicar.com | mecanico |
| Admin Taller | admin@servicar.com | admin |

## Links útiles

- Dashboard: https://dashboard.convex.dev
- Docs Convex: https://docs.convex.dev
- Convex Auth: https://labs.convex.dev/auth
