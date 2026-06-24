# Resolución de Problemas: Esquema y Ordenamiento en PocketBase (v0.23+)

Este documento detalla el diagnóstico, las causas raíz y las soluciones técnicas aplicadas para resolver el error `ClientResponseError 400` que impedía el inicio de sesión y la visualización de los tickets en la aplicación.

---

## 1. Síntomas y Diagnóstico Inicial

### El Error en Consola:
Al cargar la página de login (o ingresar credenciales), la consola del navegador y del servidor Next.js arrojaban el siguiente error repetidamente:

```bash
[browser] ClientResponseError 400: Something went wrong while processing your request.
    at async PbStore._doInit (../packages/core/src/modules/shared/infrastructure/pocketbase/pb-store.ts:58:43)
```

El error ocurría en la inicialización de la caché reactiva (`PbStore._doInit`) al ejecutar las tres consultas en paralelo (`Promise.all`):
*   Petición de tickets: `this.pb.collection("tickets").getFullList({ sort: "-created" })`
*   Petición de historial: `this.pb.collection("historial_ediciones").getFullList({ sort: "+created" })`

### Pruebas con `curl`:
Para aislar el problema, realizamos peticiones directas al servidor de PocketBase (`192.168.0.222:8090`) con un token autenticado:

1.  **Petición con ordenamiento (`sort=-created`)**:
    *   *Resultado:* `HTTP/1.1 400 Bad Request`.
    *   *Cuerpo:* `{"data":{},"message":"Something went wrong while processing your request.","status":400}`.
2.  **Petición sin ordenamiento**:
    *   *Resultado:* `HTTP/1.1 200 OK`.
    *   *Cuerpo:* `{"items":[{"collectionId":"pbc_3306545694","collectionName":"tickets","id":"24f14yuxdg9v52s"}],"page":1,...}`.

#### Hallazgo Clave:
El listado de registros respondía exitosamente pero **solo devolvía el `id`, `collectionId` y `collectionName`**. No existía ninguna de las columnas requeridas por el negocio (`matricula`, `titulo`, `estado`, etc.) ni tampoco los campos del sistema (`created` y `updated`).

---

## 2. Causas Raíz (El porqué del fallo)

### Causa A: El cambio de comportamiento de `created` y `updated` en v0.23+
En versiones anteriores de PocketBase, `created` y `updated` eran campos de sistema fijos e inamovibles. En la versión v0.23+, **se convirtieron en campos opcionales de tipo `autodate` dentro del esquema**.
*   **Comportamiento de reemplazo:** Al actualizar o crear una colección mediante la API enviando un listado de campos, PocketBase realiza un reemplazo absoluto. Si omites los campos `created` y `updated` en el payload de actualización, **PocketBase los elimina físicamente de la tabla SQLite**.
*   **Consecuencia:** Al no existir la columna `created` en la base de datos, cualquier query que intentara ordenar por fecha (`sort=-created`) fallaba inmediatamente con un error `400` por "campo de ordenamiento inválido".

### Causa B: Uso de la propiedad obsoleta `schema`
El script de seed original creaba las colecciones enviando la propiedad `schema` en el JSON. PocketBase v0.23+ migró su API para utilizar la propiedad **`fields`**. Al recibir `schema`, el servidor de PocketBase v0.23+ simplemente ignoraba el bloque, creando una colección "en blanco" que solo contenía el `id`.

### Causa C: Configuración anidada en campos `select`
Los campos de tipo `select` en `seed.ts` definían sus opciones mediante `{ name: "...", type: "select", options: { values: [...] } }`. En v0.23+, las opciones de selección (como `values` y `maxSelect`) se aplanaron y ahora deben declararse en el primer nivel del objeto del campo.

### Causa D: Omisión de actualizaciones en colecciones existentes
La función `ensureCollection` en el script original de seed tenía un bloque de control simple:
```typescript
try {
  await pb.collections.getOne(name);
  console.log(`  collection exists: ${name}`);
} catch {
  // Solo creaba si no existía
}
```
Si la colección ya existía en el panel de PocketBase (aunque estuviese vacía o mal configurada), el seed no realizaba ninguna acción de actualización. Por lo tanto, el esquema corrupto persistía indefinidamente.

### Causa E: Riesgo de sobreescritura en `users`
La función `ensureUsersSchema` ejecutaba un `pb.collections.update` enviando únicamente `{ fields: toAdd }` (que contenía solo `nombre` y `rol`). Si este código se ejecutaba en una base de datos limpia, el comportamiento de reemplazo de PocketBase **habría borrado todos los campos de autenticación por defecto de la colección `users`** (como `email`, `password`, etc.), corrompiendo el sistema de usuarios.

---

## 3. Soluciones Implementadas

Modificamos el archivo [`packages/core/seed.ts`](file:///home/hermandev/Documents/proyectos/1/servicar/packages/core/seed.ts) aplicando las siguientes correcciones:

### 1. Declaración explícita de campos `autodate`
Añadimos los campos `created` y `updated` al listado de campos de todas las colecciones para asegurar su persistencia y permitir ordenamiento:
```typescript
{ name: "created", type: "autodate", onCreate: true, onUpdate: false },
{ name: "updated", type: "autodate", onCreate: true, onUpdate: true }
```

### 2. Aplanado de campos `select`
Aplanamos los campos `categoria`, `estado` y `tipoAccion` eliminando el objeto `options` e insertando las propiedades directamente en el primer nivel:
```typescript
{ 
  name: "categoria", 
  type: "select", 
  required: true, 
  maxSelect: 1, 
  values: ["mantenimiento", "frenos", "aceite", "neumaticos", "electrico", "carroceria", "otros"] 
}
```

### 3. Sincronización activa de esquemas en `ensureCollection`
Reescribimos la función para que, si la colección existe, obtenga su ID y llame a `pb.collections.update` para forzar la sincronización de todas las columnas:
```typescript
async function ensureCollection(name: string, fields: object[]): Promise<void> {
  let exists = false;
  let colId = "";
  try {
    const col = await pb.collections.getOne(name);
    exists = true;
    colId = col.id;
  } catch {}

  if (exists) {
    console.log(`  collection exists: ${name}. Updating fields to ensure consistency...`);
    await pb.collections.update(colId, { name, type: "base", fields });
  } else {
    await pb.collections.create({ name, type: "base", fields });
  }
}
```

### 4. Mezcla segura de campos en `users`
Corregimos `ensureUsersSchema` para concatenar los campos pre-existentes de la colección con los campos nuevos antes de llamar al método `update`, evitando la pérdida de columnas nativas:
```typescript
const newFields = [...existing, ...toAdd];
await pb.collections.update(col.id, { fields: newFields });
```

### 5. Logging detallado de errores
Añadimos bloques `try/catch` específicos en la creación y actualización de colecciones para volcar el JSON exacto de error devuelto por la API de PocketBase (ej. `err.response?.data`), facilitando la depuración rápida de fallos de validación en consola.

---

## 4. Resultados Obtenidos
*   **Ejecución Exitosa del Seed:** Las colecciones se actualizaron y poblaron correctamente sin ningún error de validación.
*   **Recuperación de Campos:** Las consultas a `tickets` e `historial_ediciones` ahora devuelven la totalidad de las propiedades configuradas de forma estructurada.
*   **Ordenamiento Funcional:** La petición con `sort=-created` responde con `200 OK`, lo que elimina por completo el error `400` y permite a la aplicación frontend iniciar sesión y cargar la bandeja de taller de manera fluida.
