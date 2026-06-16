import { describe, it, expect, beforeEach } from "vitest";
import { CambiarEstadoUseCase } from "../modules/ticket/application/use-cases/cambiar-estado.use-case";
import { Ticket } from "../modules/ticket/domain/entities/ticket.entity";
import type { ITicketRepository } from "../modules/ticket/domain/ports/ticket.repository.port";
import type { TicketEstado } from "../modules/shared/domain";

function makeRepo(initial?: Ticket[]): ITicketRepository & { get: (id: string) => Ticket | undefined } {
  const store = new Map<string, Ticket>(initial?.map((t) => [t.id, t]));
  return {
    get:          (id)  => store.get(id),
    save:         async (t)   => { store.set(t.id, t); },
    getById:      async (id)  => store.get(id) ?? null,
    getAll:       async ()    => [...store.values()],
    getByEstado:  async (e: TicketEstado) => [...store.values()].filter((t) => t.estado === e),
    getByCreador: async (cid) => [...store.values()].filter((t) => t.creadorId === cid),
  };
}

function ticketEn(estado: TicketEstado, id = "tk_1"): Ticket {
  return Ticket.reconstitute({
    id, creationTime: 0, fechaUltimaModificacion: 0,
    matricula: "4829-KXL", categoria: "mantenimiento",
    titulo: "Test", descripcion: "Desc.", estado, creadorId: "emp_juan",
  });
}

describe("CambiarEstadoUseCase", () => {
  let repo: ReturnType<typeof makeRepo>;
  let useCase: CambiarEstadoUseCase;

  beforeEach(() => {
    repo    = makeRepo([ticketEn("pendiente_revision")]);
    useCase = new CambiarEstadoUseCase(repo);
  });

  it("aprueba un ticket pendiente", async () => {
    await useCase.execute({ ticketId: "tk_1", nuevoEstado: "aprobado", empleadoId: "emp_admin" });
    expect(repo.get("tk_1")!.estado).toBe("aprobado");
  });

  it("solicita cambios con nota", async () => {
    await useCase.execute({
      ticketId: "tk_1", nuevoEstado: "requiere_cambios",
      empleadoId: "emp_admin", notaAdmin: "Falta foto.",
    });
    const t = repo.get("tk_1")!;
    expect(t.estado).toBe("requiere_cambios");
    expect(t.notaAdmin).toBe("Falta foto.");
  });

  it("lanza si el ticket no existe", async () => {
    await expect(
      useCase.execute({ ticketId: "no_existe", nuevoEstado: "aprobado", empleadoId: "emp_admin" })
    ).rejects.toThrow("no encontrado");
  });

  it("lanza en transición inválida", async () => {
    await expect(
      useCase.execute({ ticketId: "tk_1", nuevoEstado: "finalizado", empleadoId: "emp_admin" })
    ).rejects.toThrow("Transición inválida");
  });

  it("lanza al solicitar cambios sin nota", async () => {
    await expect(
      useCase.execute({ ticketId: "tk_1", nuevoEstado: "requiere_cambios", empleadoId: "emp_admin" })
    ).rejects.toThrow("nota");
  });

  it("flujo completo pendiente → aprobado → en_progreso → finalizado", async () => {
    const r = makeRepo([ticketEn("pendiente_revision", "tk_flow")]);
    const uc = new CambiarEstadoUseCase(r);

    await uc.execute({ ticketId: "tk_flow", nuevoEstado: "aprobado",    empleadoId: "emp_admin" });
    await uc.execute({ ticketId: "tk_flow", nuevoEstado: "en_progreso", empleadoId: "emp_admin" });
    await uc.execute({ ticketId: "tk_flow", nuevoEstado: "finalizado",  empleadoId: "emp_admin" });

    expect(r.get("tk_flow")!.estado).toBe("finalizado");
  });
});
