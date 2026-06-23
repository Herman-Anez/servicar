/**
 * Seed script for PocketBase.
 *
 * Usage:
 *   PB_URL=http://localhost:8090 PB_ADMIN_EMAIL=<email> PB_ADMIN_PASS=<pass> \
 *     npx tsx packages/core/seed.ts
 *
 * Creates:
 *   - 2 mecánicos, each with 1 ticket
 *   - 1 admin
 *   - historial entries for each ticket
 *
 * Skips existing records (idempotent by email).
 */

import PocketBase from "pocketbase";

const PB_URL         = process.env.PB_URL         ?? "http://localhost:8090";
const ADMIN_EMAIL    = process.env.PB_ADMIN_EMAIL  ?? "";
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASS   ?? "";

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Set PB_ADMIN_EMAIL and PB_ADMIN_PASS env vars.");
  process.exit(1);
}

const pb = new PocketBase(PB_URL);

// ── Helpers ───────────────────────────────────────────────────────────────────

async function ensureUser(data: {
  email: string;
  password: string;
  nombre: string;
  rol: "mecanico" | "admin";
}): Promise<string> {
  try {
    const existing = await pb.collection("users").getFirstListItem(`email="${data.email}"`);
    console.log(`  skip user: ${data.email} (already exists, id=${existing.id})`);
    // Ensure custom fields are up to date
    await pb.collection("users").update(existing.id, { nombre: data.nombre, rol: data.rol });
    return existing.id;
  } catch {
    const record = await pb.collection("users").create({
      email:           data.email,
      emailVisibility: true,
      password:        data.password,
      passwordConfirm: data.password,
      nombre:          data.nombre,
      rol:             data.rol,
    });
    console.log(`  created user: ${data.email} (id=${record.id})`);
    return record.id;
  }
}

const AUTHENTICATED = '@request.auth.id != ""';

async function ensureCollection(name: string, schema: object[]): Promise<void> {
  try {
    await pb.collections.getOne(name);
    console.log(`  collection exists: ${name}`);
  } catch {
    await pb.collections.create({
      name,
      type: "base",
      schema,
    });
    console.log(`  created collection: ${name}`);
  }
}

async function setRules(name: string, rules: {
  listRule?: string | null;
  viewRule?: string | null;
  createRule?: string | null;
  updateRule?: string | null;
  deleteRule?: string | null;
}): Promise<void> {
  const col = await pb.collections.getOne(name);
  await pb.collections.update(col.id, rules);
  console.log(`  rules set: ${name}`);
}

async function ensureUsersSchema(): Promise<void> {
  const col = await pb.collections.getOne("users");
  const existing = (col as any).fields ?? (col as any).schema ?? [];
  const existingNames: string[] = existing.map((f: any) => f.name);

  const toAdd: object[] = [];
  if (!existingNames.includes("nombre")) {
    toAdd.push({ name: "nombre", type: "text", required: false });
  }
  if (!existingNames.includes("rol")) {
    toAdd.push({ name: "rol", type: "select", required: false, maxSelect: 1, values: ["mecanico", "admin"] });
  }

  if (toAdd.length === 0) {
    console.log("  users schema already has nombre + rol");
    return;
  }

  await pb.collections.update(col.id, { fields: toAdd });
  console.log(`  added fields to users: ${toAdd.map((f: any) => f.name).join(", ")}`);
}

async function createTicket(data: {
  matricula: string;
  categoria: string;
  titulo: string;
  descripcion: string;
  estado: string;
  creadorId: string;
  fechaUltimaModificacion: number;
  bahia?: string;
}): Promise<string> {
  const record = await pb.collection("tickets").create(data);
  console.log(`  created ticket: ${data.titulo} (id=${record.id})`);
  return record.id;
}

async function createHistorial(data: {
  ticketId: string;
  empleadoId: string;
  tipoAccion: string;
  detallesCambio?: string;
}): Promise<void> {
  await pb.collection("historial_ediciones").create(data);
  console.log(`  created historial: ${data.tipoAccion} for ticket ${data.ticketId}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Connecting to PocketBase at ${PB_URL}`);
  await pb.collection("_superusers").authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
  console.log("Authenticated as superuser.\n");

  // ── Users schema (custom fields: nombre, rol) ──────────────────────────────
  console.log("Ensuring users schema...");
  await ensureUsersSchema();
  console.log();

  // ── Collections ────────────────────────────────────────────────────────────
  console.log("Ensuring collections...");
  await ensureCollection("tickets", [
    { name: "matricula",               type: "text",   required: true },
    { name: "categoria",               type: "select", required: true, options: { values: ["mantenimiento","frenos","aceite","neumaticos","electrico","carroceria","otros"] } },
    { name: "titulo",                  type: "text",   required: true },
    { name: "descripcion",             type: "text",   required: true },
    { name: "estado",                  type: "select", required: true, options: { values: ["pendiente_revision","aprobado","requiere_cambios","en_progreso","urgente","bloqueado","finalizado"] } },
    { name: "creadorId",               type: "text",   required: true },
    { name: "fechaUltimaModificacion", type: "number", required: true },
    { name: "notaAdmin",               type: "text" },
    { name: "bahia",                   type: "text" },
  ]);

  await ensureCollection("historial_ediciones", [
    { name: "ticketId",      type: "text", required: true },
    { name: "empleadoId",    type: "text", required: true },
    { name: "tipoAccion",    type: "select", required: true, options: { values: ["CREACION","CAMBIO_ESTADO","EDICION_TEXTO"] } },
    { name: "detallesCambio", type: "text" },
  ]);

  // ── API Rules ───────────────────────────────────────────────────────────────
  console.log("Setting API rules...");
  // users: authenticated users can list/view (needed to show mechanic names).
  // Only superusers can create users (admins are created via admin UI / seed).
  await setRules("users", {
    listRule:   AUTHENTICATED,
    viewRule:   AUTHENTICATED,
    createRule: "",
    updateRule: AUTHENTICATED,
    deleteRule: "",
  });
  // tickets: any authenticated user can CRUD (authorization enforced in use cases).
  await setRules("tickets", {
    listRule:   AUTHENTICATED,
    viewRule:   AUTHENTICATED,
    createRule: AUTHENTICATED,
    updateRule: AUTHENTICATED,
    deleteRule: "",
  });
  // historial: authenticated can list/create. Immutable → no update/delete.
  await setRules("historial_ediciones", {
    listRule:   AUTHENTICATED,
    viewRule:   AUTHENTICATED,
    createRule: AUTHENTICATED,
    updateRule: "",
    deleteRule: "",
  });
  console.log();

  // ── Users ──────────────────────────────────────────────────────────────────
  console.log("Seeding users...");
  const PASSWORD = "Password1234!";

  const juanId      = await ensureUser({ email: "juan.perez@servicar.com",  password: PASSWORD, nombre: "Juan Pérez",   rol: "mecanico" });
  const rodriguezId = await ensureUser({ email: "m.rodriguez@servicar.com", password: PASSWORD, nombre: "M. Rodriguez", rol: "mecanico" });
  const adminId     = await ensureUser({ email: "admin@servicar.com",       password: PASSWORD, nombre: "Admin Taller", rol: "admin"    });
  console.log();

  // ── Clear existing tickets/historial for a clean seed ─────────────────────
  console.log("Clearing existing tickets and historial...");
  const existingTickets = await pb.collection("tickets").getFullList({ fields: "id" });
  for (const t of existingTickets) {
    await pb.collection("tickets").delete(t.id);
  }
  const existingHistorial = await pb.collection("historial_ediciones").getFullList({ fields: "id" });
  for (const h of existingHistorial) {
    await pb.collection("historial_ediciones").delete(h.id);
  }
  console.log(`  deleted ${existingTickets.length} tickets, ${existingHistorial.length} historial entries\n`);

  // ── Tickets ────────────────────────────────────────────────────────────────
  console.log("Seeding tickets...");
  const now = Date.now();

  const tk1Id = await createTicket({
    matricula:               "4829-KXL",
    categoria:               "mantenimiento",
    titulo:                  "Revisión Motor",
    descripcion:             "Revisión general del motor, filtros y fluidos del autobús.",
    estado:                  "pendiente_revision",
    creadorId:               juanId,
    fechaUltimaModificacion: now - 3_600_000,
    bahia:                   "Bahía 01",
  });

  const tk2Id = await createTicket({
    matricula:               "1122-CMM",
    categoria:               "frenos",
    titulo:                  "Cambio de Pastillas",
    descripcion:             "Revisión y cambio de pastillas de freno delanteras.",
    estado:                  "pendiente_revision",
    creadorId:               rodriguezId,
    fechaUltimaModificacion: now - 7_200_000,
  });
  console.log();

  // ── Historial ──────────────────────────────────────────────────────────────
  console.log("Seeding historial...");
  await createHistorial({
    ticketId:       tk1Id,
    empleadoId:     juanId,
    tipoAccion:     "CREACION",
    detallesCambio: JSON.stringify({ estado_nuevo: "pendiente_revision" }),
  });
  await createHistorial({
    ticketId:       tk2Id,
    empleadoId:     rodriguezId,
    tipoAccion:     "CREACION",
    detallesCambio: JSON.stringify({ estado_nuevo: "pendiente_revision" }),
  });
  console.log();

  console.log("Seed complete!");
  console.log(`  Users: juan.perez@servicar.com, m.rodriguez@servicar.com, admin@servicar.com`);
  console.log(`  Password for all: ${PASSWORD}`);
  console.log(`  Tickets: ${tk1Id} (Juan), ${tk2Id} (Rodriguez)`);

  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
