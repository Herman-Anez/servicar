# Reglas de Seguridad y API en PocketBase

PocketBase utiliza un sistema de **API Rules** basado en expresiones para controlar qué usuarios pueden listar, ver, crear, actualizar o eliminar registros en cada colección.

Por defecto, PocketBase establece todas las reglas en `null` (lo que significa que solo los superusuarios pueden acceder a los endpoints). Para que la aplicación Servicar funcione, deben definirse los siguientes accesos:

---

## Tabla de Reglas de Acceso (API Rules)

El script de seed aplica estas reglas automáticamente. Si se configuran manualmente en el panel de administración, la estructura debe ser la siguiente:

| Colección | List Rule | View Rule | Create Rule | Update Rule | Delete Rule |
|---|---|---|---|---|---|
| `users` | `@request.auth.id != ""` | `@request.auth.id != ""` | *Bloqueado* (`null`) | `@request.auth.id != ""` | *Bloqueado* (`null`) |
| `tickets` | `@request.auth.id != ""` | `@request.auth.id != ""` | `@request.auth.id != ""` | `@request.auth.id != ""` | *Bloqueado* (`null`) |
| `historial_ediciones` | `@request.auth.id != ""` | `@request.auth.id != ""` | `@request.auth.id != ""` | *Bloqueado* (`null`) | *Bloqueado* (`null`) |

---

## Explicación de las Reglas

1.  **Restricción de lectura al personal (`@request.auth.id != ""`):**
    Esta regla evalúa si el cliente ha enviado una cabecera de autenticación válida (es decir, si el token JWT no ha expirado y corresponde a un usuario registrado en la colección `users`). 
    *   **¿Por qué en `users`?** Los mecánicos necesitan listar los usuarios para resolver el nombre de otros mecánicos (ej. ver quién realizó un cambio en la línea de tiempo del historial).
    *   **¿Por qué en `tickets` e `historial_ediciones`?** Previene que personas externas al taller consulten el listado de autobuses o averías de forma masiva.
    *   *Nota*: La consulta pública del portal de clientes se realiza directamente por el ID exacto del ticket. Al estar la regla de `view` en `@request.auth.id != ""`, el portal público utiliza un token o accede de manera segura según lo definido en los use cases, o en su defecto, requiere que usemos reglas específicas para visualización pública si se desea omitir la autenticación del todo para esa vista.

2.  **Inmutabilidad del Historial (`Update/Delete = ""`):**
    Para cumplir con las reglas de negocio de auditoría inmutable (ningún historial puede modificarse ni borrarse una vez creado), las reglas `updateRule` y `deleteRule` de la colección `historial_ediciones` se dejan vacías (`null`). Esto bloquea a nivel de base de datos cualquier intento de modificar estas entradas, incluso si es un usuario autenticado.

3.  **Seguridad contra eliminación de tickets (`Delete = ""`):**
    Un ticket del taller nunca debe borrarse para preservar el histórico de reparaciones del autobús. Solo los superusuarios tienen permiso para purgar registros mediante la consola de administración.

---

## Separación de Responsabilidades: API Rules vs Reglas de Dominio

Es fundamental entender que **PocketBase no gestiona la lógica detallada del negocio** en sus reglas.

Por ejemplo:
*   *Regla de negocio:* Un mecánico solo puede editar sus propios tickets, mientras que un administrador puede editar cualquiera.
*   *Lógica aplicada:* En lugar de complicar las reglas de PocketBase, la colección `tickets` permite `updateRule = "@request.auth.id != """` para cualquier empleado autenticado. La restricción de "quién puede editar qué" se valida estrictamente en la capa de aplicación del core (`packages/core/src/modules/ticket/application/use-cases/editar-ticket.use-case.ts`), la cual evalúa el rol del usuario antes de enviar la actualización a PocketBase.

Esto asegura que las reglas de la base de datos se mantengan simples, rápidas de evaluar y fáciles de auditar, delegando las reglas complejas de negocio a la arquitectura de dominio de la aplicación (`packages/core`).
