import { describe, it, expect, beforeEach, vi } from "vitest";
import { MockStore } from "../../../modules/shared/infrastructure/mock/store";
import { MOCK_TICKETS, MOCK_EMPLEADOS } from "../../../modules/shared/infrastructure/mock/data";

// Cada test arranca con una instancia fresca (en Node.js no hay window → sin localStorage)
let store: MockStore;
beforeEach(() => { store = new MockStore(); });

// ---------------------------------------------------------------------------
// Estado inicial
// ---------------------------------------------------------------------------

describe("estado inicial", () => {
  it("carga los tickets seed", () => {
    expect(store.getTickets()).toHaveLength(MOCK_TICKETS.length);
  });

  it("carga los empleados seed", () => {
    expect(store.getEmpleados()).toHaveLength(MOCK_EMPLEADOS.length);
  });
});

// ---------------------------------------------------------------------------
// Tickets — lectura
// ---------------------------------------------------------------------------

describe("getTicketById()", () => {
  it("devuelve el ticket por id", () => {
    const t = store.getTicketById("tk_001");
    expect(t).not.toBeNull();
    expect(t!.titulo).toBe("Revisión Motor");
  });

  it("devuelve null para id inexistente", () => {
    expect(store.getTicketById("no_existe")).toBeNull();
  });
});

describe("getTicketsByEstado()", () => {
  it("filtra por estado", () => {
    const result = store.getTicketsByEstado("pendiente_revision");
    expect(result.every((t) => t.estado === "pendiente_revision")).toBe(true);
  });
});

describe("getTicketsByCreador()", () => {
  it("filtra por creador", () => {
    const result = store.getTicketsByCreador("emp_juan");
    expect(result.every((t) => t.creadorId === "emp_juan")).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("devuelve vacío para creador sin tickets", () => {
    expect(store.getTicketsByCreador("nadie")).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Tickets — escritura
// ---------------------------------------------------------------------------

describe("upsertTicket()", () => {
  it("inserta un ticket nuevo", () => {
    const antes = store.getTickets().length;
    store.upsertTicket({
      _id: "tk_nuevo", _creationTime: Date.now(),
      matricula: "NEW-001", categoria: "aceite",
      titulo: "Test", descripcion: "Desc.",
      estado: "pendiente_revision", creadorId: "emp_juan",
      fechaUltimaModificacion: Date.now(),
    });
    expect(store.getTickets()).toHaveLength(antes + 1);
    expect(store.getTicketById("tk_nuevo")).not.toBeNull();
  });

  it("actualiza un ticket existente sin duplicar", () => {
    const antes = store.getTickets().length;
    store.upsertTicket({ ...store.getTicketById("tk_001")!, titulo: "Actualizado" });
    expect(store.getTickets()).toHaveLength(antes);
    expect(store.getTicketById("tk_001")!.titulo).toBe("Actualizado");
  });
});

describe("crearTicket()", () => {
  it("devuelve un id", () => {
    const id = store.crearTicket({ matricula: "T-001", categoria: "frenos", titulo: "X", descripcion: "Y", creadorId: "emp_juan" });
    expect(typeof id).toBe("string");
  });

  it("el ticket queda en pendiente_revision", () => {
    const id = store.crearTicket({ matricula: "T-001", categoria: "frenos", titulo: "X", descripcion: "Y", creadorId: "emp_juan" });
    expect(store.getTicketById(id)!.estado).toBe("pendiente_revision");
  });

  it("registra una entrada CREACION en historial", () => {
    const id = store.crearTicket({ matricula: "T-001", categoria: "frenos", titulo: "X", descripcion: "Y", creadorId: "emp_juan" });
    const hist = store.getHistorialByTicket(id);
    expect(hist).toHaveLength(1);
    expect(hist[0].tipoAccion).toBe("CREACION");
  });
});

describe("editarTicket()", () => {
  it("actualiza los campos del ticket", () => {
    store.editarTicket("tk_001", "emp_juan", { titulo: "Nuevo Título" });
    expect(store.getTicketById("tk_001")!.titulo).toBe("Nuevo Título");
  });

  it("registra una entrada EDICION_TEXTO", () => {
    const antes = store.getHistorialByTicket("tk_001").length;
    store.editarTicket("tk_001", "emp_juan", { titulo: "X" });
    expect(store.getHistorialByTicket("tk_001")).toHaveLength(antes + 1);
    const last = store.getHistorialByTicket("tk_001").at(-1)!;
    expect(last.tipoAccion).toBe("EDICION_TEXTO");
  });
});

describe("cambiarEstado()", () => {
  it("cambia el estado del ticket", () => {
    store.cambiarEstado("tk_007", "emp_admin", "aprobado");
    expect(store.getTicketById("tk_007")!.estado).toBe("aprobado");
  });

  it("guarda notaAdmin cuando se pasa", () => {
    store.cambiarEstado("tk_007", "emp_admin", "requiere_cambios", "Falta foto.");
    expect(store.getTicketById("tk_007")!.notaAdmin).toBe("Falta foto.");
  });

  it("registra una entrada CAMBIO_ESTADO", () => {
    const antes = store.getHistorialByTicket("tk_007").length;
    store.cambiarEstado("tk_007", "emp_admin", "aprobado");
    expect(store.getHistorialByTicket("tk_007")).toHaveLength(antes + 1);
    const last = store.getHistorialByTicket("tk_007").at(-1)!;
    expect(last.tipoAccion).toBe("CAMBIO_ESTADO");
  });

  it("no hace nada si el ticket no existe", () => {
    const antes = store.getTickets().length;
    store.cambiarEstado("no_existe", "emp_admin", "aprobado");
    expect(store.getTickets()).toHaveLength(antes);
  });
});

// ---------------------------------------------------------------------------
// Historial
// ---------------------------------------------------------------------------

describe("getHistorialByTicket()", () => {
  it("devuelve las entradas del ticket ordenadas por creationTime", () => {
    const hist = store.getHistorialByTicket("tk_001");
    expect(hist.length).toBeGreaterThanOrEqual(2);
    for (let i = 1; i < hist.length; i++) {
      expect(hist[i]._creationTime).toBeGreaterThanOrEqual(hist[i - 1]._creationTime);
    }
  });

  it("devuelve vacío para ticket sin historial", () => {
    expect(store.getHistorialByTicket("tk_999")).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Empleados
// ---------------------------------------------------------------------------

describe("getEmpleadoById()", () => {
  it("devuelve el empleado por id", () => {
    const e = store.getEmpleadoById("emp_juan");
    expect(e).not.toBeNull();
    expect(e!.nombre).toBe("Juan Pérez");
  });

  it("devuelve null para id inexistente", () => {
    expect(store.getEmpleadoById("no_existe")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Suscriptores
// ---------------------------------------------------------------------------

describe("subscribe / notify", () => {
  it("notifica a los suscriptores en cada mutación", () => {
    const fn = vi.fn();
    store.subscribe(fn);
    store.cambiarEstado("tk_007", "emp_admin", "aprobado");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("la función de unsubscribe detiene las notificaciones", () => {
    const fn = vi.fn();
    const unsub = store.subscribe(fn);
    unsub();
    store.cambiarEstado("tk_007", "emp_admin", "aprobado");
    expect(fn).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// reset()
// ---------------------------------------------------------------------------

describe("reset()", () => {
  it("restaura los tickets al estado seed", () => {
    store.crearTicket({ matricula: "X", categoria: "aceite", titulo: "T", descripcion: "D", creadorId: "emp_juan" });
    store.reset();
    expect(store.getTickets()).toHaveLength(MOCK_TICKETS.length);
  });
});
