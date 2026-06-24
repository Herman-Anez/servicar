import { describe, it, expect, beforeEach } from "vitest";
import { EditarTicketUseCase } from "../modules/ticket/application/use-cases/editar-ticket.use-case";
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

function ticketDe(creadorId: string, id = "tk_1"): Ticket {
  return Ticket.reconstitute({
    id, creationTime: 0, fechaUltimaModificacion: 0,
    matricula: "4829-KXL", categoria: "mantenimiento",
    titulo: "Original", descripcion: "Desc.", estado: "pendiente_revision", creadorId,
  });
}

describe("EditarTicketUseCase", () => {
  let repo: ReturnType<typeof makeRepo>;
  let useCase: EditarTicketUseCase;

  beforeEach(() => {
    repo    = makeRepo([ticketDe("emp_juan")]);
    useCase = new EditarTicketUseCase(repo);
  });

  it("mecánico edita su propio ticket", async () => {
    await useCase.execute({
      ticketId: "tk_1", empleadoId: "emp_juan", rol: "mecanico",
      campos: { titulo: "Revisado" },
    });
    expect(repo.get("tk_1")!.titulo).toBe("Revisado");
  });

  it("admin edita cualquier ticket", async () => {
    await useCase.execute({
      ticketId: "tk_1", empleadoId: "emp_admin", rol: "admin",
      campos: { titulo: "Corregido por admin" },
    });
    expect(repo.get("tk_1")!.titulo).toBe("Corregido por admin");
  });

  it("mecánico no puede editar ticket ajeno", async () => {
    await expect(
      useCase.execute({
        ticketId: "tk_1", empleadoId: "emp_otro", rol: "mecanico",
        campos: { titulo: "Intento" },
      })
    ).rejects.toThrow("Mecánico solo puede editar sus propios tickets.");
  });

  it("lanza si el ticket no existe", async () => {
    await expect(
      useCase.execute({ ticketId: "no_existe", empleadoId: "emp_juan", rol: "mecanico", campos: {} })
    ).rejects.toThrow("no encontrado");
  });

  it("lanza si matrícula queda vacía", async () => {
    await expect(
      useCase.execute({
        ticketId: "tk_1", empleadoId: "emp_juan", rol: "mecanico",
        campos: { matricula: "  " },
      })
    ).rejects.toThrow();
  });

  it("edición genera entrada en pendingHistorial", async () => {
    await useCase.execute({
      ticketId: "tk_1", empleadoId: "emp_juan", rol: "mecanico",
      campos: { descripcion: "Nueva descripción" },
    });
    const t = repo.get("tk_1")!;
    expect(t.descripcion).toBe("Nueva descripción");
  });
});
