import { describe, it, expect } from "vitest";
import { Ticket } from "../modules/ticket/domain/entities/ticket.entity";

const BASE = {
  matricula:   "4829-KXL",
  categoria:   "mantenimiento" as const,
  titulo:      "Revisión Motor",
  descripcion: "Revisión general del motor.",
  creadorId:   "emp_juan",
};

// ---------------------------------------------------------------------------
// Ticket.create()
// ---------------------------------------------------------------------------

describe("Ticket.create()", () => {
  it("crea un ticket en estado pendiente_revision", () => {
    const t = Ticket.create(BASE);
    expect(t.estado).toBe("pendiente_revision");
  });

  it("emite una entrada CREACION en pendingHistorial", () => {
    const t = Ticket.create(BASE);
    expect(t.pendingHistorial).toHaveLength(1);
    expect(t.pendingHistorial[0].tipoAccion).toBe("CREACION");
  });

  it("lanza si la matrícula está vacía", () => {
    expect(() => Ticket.create({ ...BASE, matricula: "   " })).toThrow("matrícula");
  });

  it("lanza si el título está vacío", () => {
    expect(() => Ticket.create({ ...BASE, titulo: "" })).toThrow("título");
  });

  it("lanza si la descripción está vacía", () => {
    expect(() => Ticket.create({ ...BASE, descripcion: "  " })).toThrow("descripción");
  });
});

// ---------------------------------------------------------------------------
// Ticket.cambiarEstado()
// ---------------------------------------------------------------------------

describe("Ticket.cambiarEstado()", () => {
  function ticketEn(estado: Ticket["estado"]) {
    return Ticket.reconstitute({ ...BASE, id: "tk_1", creationTime: 0, fechaUltimaModificacion: 0, estado });
  }

  it("pendiente_revision → aprobado es válido", () => {
    const t = ticketEn("pendiente_revision").cambiarEstado("aprobado", "emp_admin");
    expect(t.estado).toBe("aprobado");
  });

  it("pendiente_revision → requiere_cambios con nota es válido", () => {
    const t = ticketEn("pendiente_revision").cambiarEstado("requiere_cambios", "emp_admin", "Falta foto.");
    expect(t.estado).toBe("requiere_cambios");
    expect(t.notaAdmin).toBe("Falta foto.");
  });

  it("requiere_cambios sin nota lanza error", () => {
    expect(() =>
      ticketEn("pendiente_revision").cambiarEstado("requiere_cambios", "emp_admin")
    ).toThrow("nota");
  });

  it("transición inválida lanza error", () => {
    expect(() =>
      ticketEn("finalizado").cambiarEstado("aprobado", "emp_admin")
    ).toThrow("Transición inválida");
  });

  it("aprobado → en_progreso es válido", () => {
    const t = ticketEn("aprobado").cambiarEstado("en_progreso", "emp_admin");
    expect(t.estado).toBe("en_progreso");
  });

  it("en_progreso → finalizado es válido", () => {
    const t = ticketEn("en_progreso").cambiarEstado("finalizado", "emp_admin");
    expect(t.estado).toBe("finalizado");
  });

  it("emite una entrada CAMBIO_ESTADO en pendingHistorial", () => {
    const t = ticketEn("pendiente_revision").cambiarEstado("aprobado", "emp_admin");
    expect(t.pendingHistorial).toHaveLength(1);
    expect(t.pendingHistorial[0].tipoAccion).toBe("CAMBIO_ESTADO");
  });

  it("el cambio de estado no muta el ticket original", () => {
    const original = ticketEn("pendiente_revision");
    original.cambiarEstado("aprobado", "emp_admin");
    expect(original.estado).toBe("pendiente_revision");
  });
});

// ---------------------------------------------------------------------------
// Ticket.editar()
// ---------------------------------------------------------------------------

describe("Ticket.editar()", () => {
  it("actualiza los campos editables", () => {
    const t = Ticket.reconstitute({ ...BASE, id: "tk_1", creationTime: 0, fechaUltimaModificacion: 0, estado: "en_progreso" });
    const editado = t.editar({ titulo: "Nuevo Título", descripcion: "Nueva desc." }, "emp_juan");
    expect(editado.titulo).toBe("Nuevo Título");
    expect(editado.descripcion).toBe("Nueva desc.");
  });

  it("emite una entrada EDICION_TEXTO en pendingHistorial", () => {
    const t = Ticket.reconstitute({ ...BASE, id: "tk_1", creationTime: 0, fechaUltimaModificacion: 0, estado: "en_progreso" });
    const editado = t.editar({ titulo: "X" }, "emp_juan");
    expect(editado.pendingHistorial[0].tipoAccion).toBe("EDICION_TEXTO");
  });

  it("lanza si la nueva matrícula está vacía", () => {
    const t = Ticket.reconstitute({ ...BASE, id: "tk_1", creationTime: 0, fechaUltimaModificacion: 0, estado: "en_progreso" });
    expect(() => t.editar({ matricula: "" }, "emp_juan")).toThrow("matrícula");
  });

  it("no muta el ticket original", () => {
    const t = Ticket.reconstitute({ ...BASE, id: "tk_1", creationTime: 0, fechaUltimaModificacion: 0, estado: "en_progreso" });
    t.editar({ titulo: "Otro" }, "emp_juan");
    expect(t.titulo).toBe("Revisión Motor");
  });
});
