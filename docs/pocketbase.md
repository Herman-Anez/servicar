# PocketBase — Guía de configuración y operación

Referencia para operar PocketBase en el proyecto Servicar.

---

## Conexión

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_PB_URL` | `http://192.168.0.222:8090` (browser + SSE) |
| `PB_URL` | `http://192.168.0.222:8090` (seed / server-side) |
| Panel admin | `http://192.168.0.222:8090/_/` |

Para volver al mock local: `NEXT_PUBLIC_USE_MOCK=true` en `next/.env.local`.

---

## Versión y API

PocketBase **v0.23+** eliminó `/api/admins/`. Diferencias clave respecto a versiones anteriores:

```typescript
// ❌ v0.22 y anteriores
await pb.admins.authWithPassword(email, pass);

// ✅ v0.23+
await pb.collection("_superusers").authWithPassword(email, pass);
```

El seed y todos los scripts usan la API v0.23+.

---

## Colecciones

### `users` (auth collection — nativa de PocketBase)

Campos nativos: `id`, `email`, `created`, `updated`, `emailVisibility`, `verified`.

Campos personalizados añadidos manualmente desde el panel admin (o via seed):

| Campo | Tipo | Valores |
|---|---|---|
| `nombre` | text | nombre completo del empleado |
| `rol` | select | `mecanico` \| `admin` |

**Importante:** estos campos deben existir en la colección antes de correr el seed. Si se resetea PocketBase hay que recrearlos (o correr el seed que los escribe vía `update`).

### `tickets`

| Campo | Tipo | Requerido |
|---|---|---|
| `matricula` | text | ✅ |
| `categoria` | select | ✅ — valores: `mantenimiento`, `frenos`, `aceite`, `neumaticos`, `electrico`, `carroceria`, `otros` |
| `titulo` | text | ✅ |
| `descripcion` | text | ✅ |
| `estado` | select | ✅ — valores: `pendiente_revision`, `aprobado`, `requiere_cambios`, `en_progreso`, `urgente`, `bloqueado`, `finalizado` |
| `creadorId` | text | ✅ — ID del usuario en `users` |
| `fechaUltimaModificacion` | number | ✅ — timestamp Unix ms |
| `notaAdmin` | text | — |
| `bahia` | text | — |

### `historial_ediciones`

| Campo | Tipo | Requerido |
|---|---|---|
| `ticketId` | text | ✅ |
| `empleadoId` | text | ✅ |
| `tipoAccion` | select | ✅ — valores: `CREACION`, `CAMBIO_ESTADO`, `EDICION_TEXTO` |
| `detallesCambio` | text | — JSON stringificado con contexto del cambio |

---

## API Rules

Configuradas por el seed. Deben aplicarse manualmente si se resetea PocketBase o si el seed no corre la sección de rules.

| Colección | listRule | viewRule | createRule | updateRule | deleteRule |
|---|---|---|---|---|---|
| `users` | auth | auth | `""` (superuser) | auth | `""` (superuser) |
| `tickets` | auth | auth | auth | auth | `""` (superuser) |
| `historial_ediciones` | auth | auth | auth | `""` (superuser) | `""` (superuser) |

`auth` = `@request.auth.id != ""`

**Por qué:** PocketBase por defecto setea `listRule=null` en todas las colecciones (solo superusers). Sin estas reglas, `PbStore.init()` lanza 403 al intentar listar usuarios regulares.

**Autorización de negocio** (quién puede editar qué ticket, qué estados puede cambiar un mecánico) se maneja en los use cases de `@servicar/core`, no en las reglas de PocketBase.

Para aplicar manualmente desde el panel admin: cada colección → API Rules → pegar `@request.auth.id != ""` en List y View.

---

## Seed

**Archivo:** `packages/core/seed.ts`

```bash
# Desde la raíz del workspace
PB_URL=http://192.168.0.222:8090 \
PB_ADMIN_EMAIL=<superuser_email> \
PB_ADMIN_PASS=<superuser_pass> \
  npx tsx packages/core/seed.ts
```

**Qué hace:**
1. Autentica como superuser
2. Asegura que existan las colecciones `tickets` e `historial_ediciones` (crea si no existen)
3. **Setea API rules** en `users`, `tickets`, `historial_ediciones`
4. Crea 3 usuarios si no existen (idempotente por email):
   - `juan.perez@servicar.com` — mecánico
   - `m.rodriguez@servicar.com` — mecánico
   - `admin@servicar.com` — admin
   - Password todos: `Password1234!`
5. **Borra todos los tickets e historial existentes** y recrea:
   - 1 ticket `pendiente_revision` por mecánico
   - 1 entrada `CREACION` en historial por ticket

**Idempotencia:** usuarios → skip si existen. Tickets e historial → siempre borra y recrea (estado limpio garantizado).

---

## Integración con el código

### Singleton PocketBase

`packages/core/src/modules/shared/infrastructure/pocketbase/pb-client.ts`

```typescript
export function getPocketBase(url?: string): PocketBase {
  // singleton — una sola instancia por proceso
}
```

Se instancia en `next/src/lib/store.ts` y `next/src/lib/auth/index.ts` usando `NEXT_PUBLIC_PB_URL`.

**No llamar `getPocketBase()` en múltiples lugares con URLs distintas** — el singleton retorna la primera instancia creada.

### PbStore

`packages/core/src/modules/shared/infrastructure/pocketbase/pb-store.ts`

Snapshot cache con subscripciones SSE. Flujo:
1. `StoreProvider` (en `next/src/app/layout.tsx`) llama `store.init()` al montar la app
2. `init()` verifica `pb.authStore.isValid` antes de hacer fetch (evita 403 pre-login)
3. Carga `tickets`, `users`, `historial_ediciones` en paralelo
4. Activa subscripciones SSE para actualizaciones en tiempo real
5. `pb.authStore.onChange` → recarga datos al login, limpia al logout

### Flujo de autenticación

```
LoginPage
  → authModule.autenticar.execute({ email, password })
      → PbAuthProvider.autenticar()
          → pb.collection("users").authWithPassword(email, password)
          → retorna { empleadoId: pb.authStore.model.id, rol }
  → authSession.setSession({ empleadoId })   ← PbSessionService: no-op (pb.authStore ya tiene el token)
  → pb.authStore.onChange dispara → PbStore.init() carga datos
```

### Mock vs PocketBase

Controlado por `NEXT_PUBLIC_USE_MOCK` en `.env.local`:

| Archivo | Mock | PocketBase |
|---|---|---|
| `next/src/lib/store.ts` | `mockStore` | `new PbStore(getPocketBase(...))` |
| `next/src/lib/auth/index.ts` | `MockSessionService` | `PbSessionService` |
| `next/src/modules/ticket/infrastructure/ticket-module.ts` | `MockTicketRepository` | `PbTicketRepository` |
| `next/src/modules/empleado/infrastructure/empleado-module.ts` | `MockEmpleadoRepository` | `PbEmpleadoRepository` |
| `next/src/modules/auth/infrastructure/auth-module.ts` | `MockAuthProvider` | `PbAuthProvider` |

---

## Operaciones comunes

### Resetear datos (mantener usuarios)
```bash
npx tsx packages/core/seed.ts  # borra tickets/historial, recrea
```

### Ver logs de PocketBase
Depende de cómo esté corriendo. Si es un binario directo, los logs van a stdout. Si es Docker, `docker logs <container>`.

### Crear superuser adicional
Desde el panel admin: `/_/` → Settings → Admins → Add admin.

### Agregar campo nuevo a una colección
1. Panel admin → colección → Edit → Add field
2. Actualizar el mapper correspondiente en `packages/core/src/modules/*/infrastructure/persistence/pocketbase/`
3. Si es campo requerido, actualizar el seed

### Mirar subscripciones SSE activas
En el panel admin: Logs → filter por `realtime`.

---

## Troubleshooting

| Error | Causa | Fix |
|---|---|---|
| `403 Only superusers can perform this action` | `listRule=null` en colección | Correr seed (setea rules) o aplicar rules manualmente |
| `400 Failed to authenticate` | Credenciales de superuser incorrectas | Verificar en panel `/_/` → Settings |
| `401 The request requires valid record authorization token` | Token expirado o no hay sesión | El `PbSessionService.getSession()` retorna null — flow de login normal |
| SSE no actualiza la UI | `PbStore` no llamó `init()` | Verificar que `StoreProvider` esté en el layout y `NEXT_PUBLIC_USE_MOCK=false` |
| Tickets no aparecen tras login | `PbStore.init()` corre antes de que `authStore` esté listo | El listener `pb.authStore.onChange` maneja esto — verificar que el login llame `authWithPassword` y no solo `setSession` |
