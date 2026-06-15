/**
 * Seed script — crea colecciones, empleados, tickets e historial en PocketBase.
 *
 * Uso:
 *   PB_URL=http://127.0.0.1:8090 PB_ADMIN_EMAIL=admin@test.com PB_ADMIN_PASS=password \
 *     npx tsx persistence/pocketbase/seed.ts
 *
 * Requisitos:
 *   1. PocketBase corriendo
 *   2. Una cuenta de superuser/admin creada en PocketBase
 *   3. La colección `users` con campos `nombre` (text) y `rol` (select)
 *      → agregar esos campos desde Admin UI antes de correr el seed
 */

import PocketBase from "pocketbase";
import type { TicketEstado, TicketCategoria } from "@servicar/core";

const PB_URL         = process.env.PB_URL          ?? "http://127.0.0.1:8090";
const ADMIN_EMAIL    = process.env.PB_ADMIN_EMAIL   ?? "herman.a.a.v@gmail.com";
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASS    ?? "00000000";

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Falta PB_ADMIN_EMAIL y/o PB_ADMIN_PASS");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Schema de colecciones
// ---------------------------------------------------------------------------

const TICKET_ESTADOS  = ["pendiente_revision","aprobado","requiere_cambios","en_progreso","bloqueado","urgente","finalizado"];
const TICKET_CATS     = ["mantenimiento","frenos","aceite","neumaticos","electrico","otros"];
const TIPO_ACCION     = ["CREACION","CAMBIO_ESTADO","EDICION_TEXTO"];

async function ensureCollections(pb: PocketBase) {
  // Verificar cuáles existen
  const existing = await pb.collections.getFullList();
  const names = new Set(existing.map((c) => c.name));

  if (!names.has("tickets")) {
    await pb.collections.create({
      name: "tickets",
      type: "base",
      schema: [
        { name: "matricula",               type: "text",   required: true,  options: {} },
        { name: "categoria",               type: "select", required: true,  options: { maxSelect: 1, values: TICKET_CATS } },
        { name: "titulo",                  type: "text",   required: true,  options: {} },
        { name: "descripcion",             type: "text",   required: true,  options: {} },
        { name: "estado",                  type: "select", required: true,  options: { maxSelect: 1, values: TICKET_ESTADOS } },
        { name: "creadorId",               type: "text",   required: true,  options: {} },
        { name: "fechaUltimaModificacion", type: "number", required: true,  options: {} },
        { name: "notaAdmin",               type: "text",   required: false, options: {} },
        { name: "bahia",                   type: "text",   required: false, options: {} },
      ],
    });
    console.log("  + colección `tickets` creada");
  } else {
    console.log("  ~ colección `tickets` ya existe");
  }

  if (!names.has("historial_ediciones")) {
    await pb.collections.create({
      name: "historial_ediciones",
      type: "base",
      schema: [
        { name: "ticketId",       type: "text",   required: true,  options: {} },
        { name: "empleadoId",     type: "text",   required: true,  options: {} },
        { name: "tipoAccion",     type: "select", required: true,  options: { maxSelect: 1, values: TIPO_ACCION } },
        { name: "detallesCambio", type: "text",   required: false, options: {} },
      ],
    });
    console.log("  + colección `historial_ediciones` creada");
  } else {
    console.log("  ~ colección `historial_ediciones` ya existe");
  }
}

// ---------------------------------------------------------------------------
// Datos de seed
// ---------------------------------------------------------------------------

const EMPLEADOS = [
  { email: "juan.perez@servicar.com",  password: "Password1234!", nombre: "Juan Pérez",   rol: "mecanico" },
  { email: "m.rodriguez@servicar.com", password: "Password1234!", nombre: "M. Rodriguez", rol: "mecanico" },
  { email: "admin@servicar.com",       password: "Password1234!", nombre: "Admin Taller", rol: "admin"    },
] as const;

interface SeedTicket {
  matricula: string;
  categoria: TicketCategoria;
  titulo: string;
  descripcion: string;
  estado: TicketEstado;
  creadorEmail: string;
  fechaUltimaModificacion: number;
  notaAdmin?: string;
  bahia?: string;
}

const TICKETS: SeedTicket[] = [
  {
    matricula: "4829-KXL", categoria: "mantenimiento",
    titulo: "Revisión Motor", descripcion: "Revisión general del motor, filtros y fluidos.",
    estado: "en_progreso", creadorEmail: "juan.perez@servicar.com",
    fechaUltimaModificacion: new Date("2026-06-02T13:35:00Z").getTime(), bahia: "Bahía 01",
  },
  {
    matricula: "1122-CMM", categoria: "frenos",
    titulo: "Frenos", descripcion: "Revisión y cambio de pastillas de freno delanteras.",
    estado: "bloqueado", creadorEmail: "m.rodriguez@servicar.com",
    fechaUltimaModificacion: new Date("2026-06-01T14:30:00Z").getTime(),
  },
  {
    matricula: "9901-BBD", categoria: "aceite",
    titulo: "Cambio de Aceite", descripcion: "Cambio de aceite sintético y filtro.",
    estado: "finalizado", creadorEmail: "juan.perez@servicar.com",
    fechaUltimaModificacion: new Date("2023-10-01T10:00:00Z").getTime(),
  },
  {
    matricula: "3312-HGT", categoria: "neumaticos",
    titulo: "Neumáticos", descripcion: "Cambio de neumáticos delanteros y balance.",
    estado: "urgente", creadorEmail: "juan.perez@servicar.com",
    fechaUltimaModificacion: new Date("2026-06-02T15:00:00Z").getTime(), bahia: "Bahía 03",
  },
  {
    matricula: "VOLVO-FH16", categoria: "frenos",
    titulo: "Frenos y Pastillas", descripcion: "Revisión de pastillas de freno — requiere fotos nítidas.",
    estado: "requiere_cambios", creadorEmail: "juan.perez@servicar.com",
    fechaUltimaModificacion: new Date("2026-06-02T13:35:00Z").getTime(), bahia: "Bahía 04",
    notaAdmin: "Las fotos de las pastillas de freno están borrosas. No se puede validar el espesor.",
  },
  {
    matricula: "SCANIA-R500", categoria: "otros",
    titulo: "Bomba Hidráulica", descripcion: "Reemplazo de bomba hidráulica principal.",
    estado: "requiere_cambios", creadorEmail: "juan.perez@servicar.com",
    fechaUltimaModificacion: new Date("2026-06-02T11:35:00Z").getTime(),
    notaAdmin: "Falta el número de serie de la bomba hidráulica reemplazada.",
  },
  {
    matricula: "MERCEDES-ACTROS", categoria: "otros",
    titulo: "Amortiguadores", descripcion: "Revisión y reemplazo de amortiguadores traseros.",
    estado: "pendiente_revision", creadorEmail: "juan.perez@servicar.com",
    fechaUltimaModificacion: new Date("2026-06-02T09:15:00Z").getTime(),
  },
];

// ---------------------------------------------------------------------------

async function main() {
  const pb = new PocketBase(PB_URL);
  pb.autoCancellation(false);

  await pb.collection("_superusers").authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
  console.log(`✓ Conectado a ${PB_URL} como admin\n`);

  // 1. Colecciones
  console.log("→ Verificando colecciones...");
  await ensureCollections(pb);

  // 2. Empleados (users)
  console.log("\n→ Creando empleados...");
  const emailToId: Record<string, string> = {};

  for (const emp of EMPLEADOS) {
    try {
      const record = await pb.collection("users").create({
        email:           emp.email,
        password:        emp.password,
        passwordConfirm: emp.password,
        nombre:          emp.nombre,
        rol:             emp.rol,
        emailVisibility: true,
      });
      emailToId[emp.email] = record.id;
      console.log(`  + ${emp.nombre} (${record.id})`);
    } catch (e: unknown) {
      const raw = JSON.stringify(e);
      if (raw.includes("email") && raw.includes("unique")) {
        const existing = await pb.collection("users").getFirstListItem(`email="${emp.email}"`);
        emailToId[emp.email] = existing.id;
        console.log(`  ~ ya existe: ${emp.nombre} (${existing.id})`);
      } else {
        throw e;
      }
    }
  }

  // 3. Tickets
  console.log("\n→ Creando tickets...");
  const ticketIds: string[] = [];

  for (const t of TICKETS) {
    const creadorId = emailToId[t.creadorEmail];
    if (!creadorId) throw new Error(`creadorEmail no registrado: ${t.creadorEmail}`);

    const record = await pb.collection("tickets").create({
      matricula:               t.matricula,
      categoria:               t.categoria,
      titulo:                  t.titulo,
      descripcion:             t.descripcion,
      estado:                  t.estado,
      creadorId,
      fechaUltimaModificacion: t.fechaUltimaModificacion,
      ...(t.notaAdmin && { notaAdmin: t.notaAdmin }),
      ...(t.bahia    && { bahia:     t.bahia }),
    });
    ticketIds.push(record.id);
    console.log(`  + ${t.titulo} [${t.estado}]`);
  }

  // 4. Historial
  console.log("\n→ Creando historial...");
  const juanId  = emailToId["juan.perez@servicar.com"];
  const adminId = emailToId["admin@servicar.com"];

  await pb.collection("historial_ediciones").create({
    ticketId:       ticketIds[0],
    empleadoId:     juanId,
    tipoAccion:     "CREACION",
    detallesCambio: JSON.stringify({ estado_nuevo: "pendiente_revision" }),
  });
  await pb.collection("historial_ediciones").create({
    ticketId:       ticketIds[0],
    empleadoId:     adminId,
    tipoAccion:     "CAMBIO_ESTADO",
    detallesCambio: JSON.stringify({ estado_anterior: "pendiente_revision", estado_nuevo: "en_progreso" }),
  });
  console.log("  + 2 entradas de historial");

  console.log("\n✅ Seed completo.");
  console.log(`   Empleados: ${Object.keys(emailToId).length}`);
  console.log(`   Tickets:   ${ticketIds.length}`);
  console.log(`   Historial: 2`);
  console.log(`\n   Credenciales de ejemplo:`);
  console.log(`   • Mecánico: juan.perez@servicar.com / Password1234!`);
  console.log(`   • Admin:    admin@servicar.com / Password1234!`);
}

main().catch((err) => {
  console.error("\n❌ Error en seed:", err?.data ?? err?.message ?? err);
  process.exit(1);
});
