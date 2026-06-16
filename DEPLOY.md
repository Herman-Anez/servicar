# Guía de despliegue — Servicar

## Arquitectura de producción

```
Internet
   │
   ├─── nginx / Caddy (proxy reverso + HTTPS)
   │        │
   │        ├── :3000 → servicar-next   (Next.js)
   │        └── :8090 → servicar-pocketbase (PocketBase)
   │
   └─── VPS (Ubuntu 22.04 / Debian 12)
            ├── Docker + Docker Compose
            └── Volumen persistente para datos de PocketBase
```

## Requisitos

- Docker ≥ 24
- Docker Compose ≥ 2.20
- Dominio apuntando al servidor (para HTTPS)
- Puerto 80/443 abiertos en el firewall

---

## 1. Desplegar PocketBase

PocketBase es el backend. Se despliega primero porque Next.js necesita su URL en tiempo de build.

```bash
# Construir imagen y levantar
docker compose -f docker-compose.pocketbase.yml up -d --build

# Verificar que está corriendo
docker compose -f docker-compose.pocketbase.yml ps
curl http://localhost:8090/api/health
```

### Configuración inicial de PocketBase

1. Abrir el panel de administración en `http://TU_SERVIDOR:8090/_/`
2. Crear la cuenta superadmin (email + contraseña — guárdalos, no se recuperan)
3. Agregar campos a la colección `users`:
   - `nombre` — tipo Text, requerido
   - `rol` — tipo Select, valores: `mecanico`, `admin`, requerido
4. Crear la colección `tickets`:
   - `matricula` — Text, requerido
   - `categoria` — Text, requerido
   - `titulo` — Text, requerido
   - `descripcion` — Text (long)
   - `estado` — Select: `pendiente_revision`, `aprobado`, `requiere_cambios`, `en_progreso`, `urgente`, `bloqueado`, `finalizado`
   - `creadorId` — Text, requerido
   - `notaAdmin` — Text
   - `bahia` — Text
   - `fechaUltimaModificacion` — Number
5. Crear la colección `historial_ediciones`:
   - `ticketId` — Text, requerido
   - `empleadoId` — Text, requerido
   - `tipoAccion` — Select: `CREACION`, `EDICION_TEXTO`, `CAMBIO_ESTADO`
   - `detallesCambio` — JSON

> Alternativamente, usar el script de seed para crear colecciones y datos de prueba:
> ```bash
> PB_URL=http://localhost:8090 \
> PB_ADMIN_EMAIL=admin@ejemplo.com \
> PB_ADMIN_PASS=tu_contraseña \
>   npx tsx persistence/pocketbase/seed.ts
> ```

---

## 2. Desplegar Next.js

`NEXT_PUBLIC_PB_URL` se hornea en el bundle al buildear — debe apuntar a la URL **pública** de PocketBase (la que el navegador del usuario va a llamar, no la interna de Docker).

```bash
# Exportar la variable antes de buildear
export NEXT_PUBLIC_PB_URL=https://pb.tu-dominio.com

# Construir imagen y levantar
docker compose -f docker-compose.next.yml up -d --build

# Verificar
docker compose -f docker-compose.next.yml ps
curl http://localhost:3000/login
```

> Si cambias la URL de PocketBase, hay que reconstruir la imagen Next.js:
> ```bash
> docker compose -f docker-compose.next.yml build --no-cache
> docker compose -f docker-compose.next.yml up -d
> ```

---

## 3. Proxy reverso con HTTPS (Caddy — recomendado)

Caddy obtiene certificados TLS automáticamente vía Let's Encrypt.

```bash
# Instalar Caddy
sudo apt install -y caddy
```

`/etc/caddy/Caddyfile`:
```
app.tu-dominio.com {
    reverse_proxy localhost:3000
}

pb.tu-dominio.com {
    reverse_proxy localhost:8090
}
```

```bash
sudo systemctl reload caddy
```

### Con nginx (alternativa)

`/etc/nginx/sites-available/servicar`:
```nginx
server {
    server_name app.tu-dominio.com;
    location / { proxy_pass http://localhost:3000; proxy_set_header Host $host; }
}

server {
    server_name pb.tu-dominio.com;
    location / { proxy_pass http://localhost:8090; proxy_set_header Host $host; }
}
```
```bash
sudo certbot --nginx -d app.tu-dominio.com -d pb.tu-dominio.com
sudo systemctl reload nginx
```

---

## Variables de entorno

| Variable | Dónde se usa | Descripción |
|---|---|---|
| `NEXT_PUBLIC_PB_URL` | Build de Next.js | URL pública de PocketBase (navegador → PB) |
| `NEXT_PUBLIC_USE_MOCK` | Build de Next.js | `false` en producción. `true` usa localStorage |
| `PB_URL` | Script seed | URL interna de PocketBase (servidor → PB) |
| `PB_ADMIN_EMAIL` | Script seed | Email del superadmin de PocketBase |
| `PB_ADMIN_PASS` | Script seed | Contraseña del superadmin de PocketBase |

---

## Comandos útiles

```bash
# Ver logs
docker compose -f docker-compose.pocketbase.yml logs -f
docker compose -f docker-compose.next.yml logs -f

# Reiniciar un servicio
docker compose -f docker-compose.pocketbase.yml restart pocketbase
docker compose -f docker-compose.next.yml restart next

# Detener todo
docker compose -f docker-compose.pocketbase.yml down
docker compose -f docker-compose.next.yml down

# Backup de datos de PocketBase
docker run --rm \
  -v servicar_pb_data:/pb_data \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/pb_$(date +%Y%m%d).tar.gz /pb_data
```

---

## Actualizar a una nueva versión

```bash
# 1. Traer cambios
git pull

# 2. Reconstruir y reiniciar Next.js
export NEXT_PUBLIC_PB_URL=https://pb.tu-dominio.com
docker compose -f docker-compose.next.yml up -d --build

# 3. Si cambió la versión de PocketBase en pocketbase.Dockerfile
docker compose -f docker-compose.pocketbase.yml up -d --build
# ⚠ Los datos en el volumen pb_data persisten — no se borran al reconstruir
```

---

## Troubleshooting

**`NEXT_PUBLIC_PB_URL requerida`** — la variable no está exportada en el entorno del shell. Ejecutar `export NEXT_PUBLIC_PB_URL=...` antes del build.

**Error 403 al hacer login** — PocketBase rechaza la petición. Verificar que:
- La URL en `NEXT_PUBLIC_PB_URL` es accesible desde el navegador del usuario
- Los campos `nombre` y `rol` existen en la colección `users`
- El usuario tiene email y contraseña correctos

**Next.js no puede conectar a PocketBase** — `NEXT_PUBLIC_PB_URL` apunta a una URL interna de Docker. En producción debe ser la URL pública (con dominio o IP pública del servidor).

**PocketBase no arranca** — revisar permisos del volumen:
```bash
docker compose -f docker-compose.pocketbase.yml logs pocketbase
```
