import { describe, it, expect, beforeEach } from "vitest";
import { MockStore } from "../../../modules/shared/infrastructure/mock/store";
import { MockTicketRepository } from "../../../modules/ticket/infrastructure/persistence/mock/mock-ticket.repository";
import { Ticket } from "../../../modules/ticket/domain";
import { CambiarEstadoUseCase } from "../../../modules/ticket/application";

let store: MockStore;
let repo: MockTicketRepository;

beforeEach(() => {
  store = new MockStore();
  repo  = new MockTicketRepository(store);
});

function ticketNuevo(overrides: Partial<Parameters<typeof Ticket.reconstitute>[0]> = {}) {
  return Ticket.reconstitute({
    id: "tk_test", creationTime: 0, fechaUltimaModificacion: 0,
    matricula: "4829-KXL", categoria: "mantenimiento",
    titulo: "Test", descripcion: "Desc.",
    estado: "pendiente_revision", creadorId: "emp_juan",
    ...overrides,
  });
}

// ---------------------------------------------------------------------------
// Lectura
// ---------------------------------------------------------------------------

describe("getAll()", () => {
  it("devuelve entidades Ticket (no objetos planos)", async () => {
    const tickets = await repo.getAll();
    expect(tickets.length).toBeGreaterThan(0);
    expect(tickets[0]).toBeInstanceOf(Ticket);
  });
});

describe("getById()", () => {
  it("devuelve la entidad Ticket por id", async () => {
    const t = await repo.getById("tk_001");
    expect(t).not.toBeNull();
    expect(t).toBeInstanceOf(Ticket);
    expect(t!.matricula).toBe("4829-KXL");
  });

  it("devuelve null para id inexistente", async () => {
    expect(await repo.getById("no_existe")).toBeNull();
  });
});

describe("getByEstado()", () => {
  it("filtra correctamente por estado", async () => {
    const result = await repo.getByEstado("pendiente_revision");
    expect(result.every((t) => t.estado === "pendiente_revision")).toBe(true);
  });
});

describe("getByCreador()", () => {
  it("filtra correctamente por creador", async () => {
    const result = await repo.getByCreador("emp_juan");
    expect(result.every((t) => t.creadorId === "emp_juan")).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// save() — inserción
// ---------------------------------------------------------------------------

describe("save() — inserción", () => {
  it("persiste un ticket nuevo en el store", async () => {
    const t = ticketNuevo({ id: "tk_nuevo" });
    await repo.save(t);
    expect(await repo.getById("tk_nuevo")).not.toBeNull();
  });

  it("el ticket guardado conserva todos los campos", async () => {
    const t = ticketNuevo({ id: "tk_campos", matricula: "TEST-999", titulo: "Título X" });
    await repo.save(t);
    const leido = await repo.getById("tk_campos");
    expect(leido!.matricula).toBe("TEST-999");
    expect(leido!.titulo).toBe("Título X");
  });

  it("drena el pendingHistorial al guardar", async () => {
    const t = Ticket.create({
      matricula: "D-001", categoria: "frenos",
      titulo: "Draft", descripcion: "Desc.", creadorId: "emp_juan",
    });
    expect(t.pendingHistorial).toHaveLength(1);
    await repo.save(t);
    const historial = store.getHistorialByTicket(t.id);
    expect(historial).toHaveLength(1);
    expect(historial[0].tipoAccion).toBe("CREACION");
  });
});

// ---------------------------------------------------------------------------
// save() — actualización
// ---------------------------------------------------------------------------

describe("save() — actualización", () => {
  it("actualiza un ticket existente sin duplicar", async () => {
    const antes = (await repo.getAll()).length;
    const original = await repo.getById("tk_001");
    const actualizado = original!.editar({ titulo: "Actualizado" }, "emp_juan");
    await repo.save(actualizado);
    expect((await repo.getAll()).length).toBe(antes);
    expect((await repo.getById("tk_001"))!.titulo).toBe("Actualizado");
  });

  it("acumula historial con cada save", async () => {
    const t1 = await repo.getById("tk_001");
    const t2 = t1!.editar({ titulo: "V2" }, "emp_juan");
    await repo.save(t2);
    const t3 = t2.editar({ titulo: "V3" }, "emp_juan");
    await repo.save(t3);
    const hist = store.getHistorialByTicket("tk_001");
    // hist_001 + hist_002 del seed + 2 EDICION_TEXTO
    expect(hist.length).toBeGreaterThanOrEqual(4);
  });
});

// ---------------------------------------------------------------------------
// Integración: use case → repositorio → store
// ---------------------------------------------------------------------------

describe("integración con CambiarEstadoUseCase", () => {
  it("el use case actualiza el ticket en el store vía el repo", async () => {
    const uc = new CambiarEstadoUseCase(repo);
    await uc.execute({ ticketId: "tk_007", nuevoEstado: "aprobado", empleadoId: "emp_admin" });
    const t = await repo.getById("tk_007");
    expect(t!.estado).toBe("aprobado");
  });
});
