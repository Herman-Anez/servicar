// In-memory store con localStorage persistence.
// Imita el comportamiento reactivo de Convex: subscribers se notifican en cada mutación.

import {
  MOCK_TICKETS,
  MOCK_EMPLEADOS,
  MOCK_HISTORIAL,
  MockTicket,
  MockEmpleado,
  MockHistorial,
  TicketEstado,
  TicketCategoria,
} from "./data";

type Listener = () => void;

export class MockStore {
  private tickets: MockTicket[];
  private empleados: MockEmpleado[];
  private historial: MockHistorial[];
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.tickets = this.load("servicar_mock_tickets", MOCK_TICKETS);
    this.empleados = MOCK_EMPLEADOS; // no mutable en v1
    this.historial = this.load("servicar_mock_historial", MOCK_HISTORIAL);
  }

  private load<T>(key: string, fallback: T[]): T[] {
    if (typeof window === "undefined") return fallback;
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  }

  private save(key: string, data: unknown) {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(data));
  }

  notify() {
    this.listeners.forEach((fn) => fn());
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  }

  // ── Raw persistence (para adaptadores de repositorio) ────
  // No registran historial — eso lo hacen los use cases.

  upsertTicket(ticket: MockTicket) {
    const exists = this.tickets.some((t) => t._id === ticket._id);
    this.tickets = exists
      ? this.tickets.map((t) => (t._id === ticket._id ? ticket : t))
      : [ticket, ...this.tickets];
    this.save("servicar_mock_tickets", this.tickets);
    this.notify();
  }

  appendHistorial(entry: MockHistorial) {
    this.historial = [...this.historial, entry];
    this.save("servicar_mock_historial", this.historial);
  }

  // ── Tickets ──────────────────────────────────────────────

  getTickets() {
    return [...this.tickets];
  }

  getTicketsByEstado(estado: TicketEstado) {
    return this.tickets.filter((t) => t.estado === estado);
  }

  getTicketsByCreador(creadorId: string) {
    return this.tickets.filter((t) => t.creadorId === creadorId);
  }

  getTicketById(id: string) {
    return this.tickets.find((t) => t._id === id) ?? null;
  }

  crearTicket(data: {
    matricula: string;
    categoria: TicketCategoria;
    titulo: string;
    descripcion: string;
    creadorId: string;
  }): string {
    const id = `tk_${Date.now()}`;
    const now = Date.now();
    const ticket: MockTicket = {
      _id: id,
      _creationTime: now,
      estado: "pendiente_revision",
      fechaUltimaModificacion: now,
      ...data,
    };
    this.tickets = [ticket, ...this.tickets];
    this.registrarHistorial(id, data.creadorId, "CREACION", { estado_nuevo: "pendiente_revision" });
    this.save("servicar_mock_tickets", this.tickets);
    this.notify();
    return id;
  }

  editarTicket(
    id: string,
    empleadoId: string,
    data: Partial<Pick<MockTicket, "titulo" | "descripcion" | "categoria" | "bahia" | "matricula">>
  ) {
    this.tickets = this.tickets.map((t) =>
      t._id === id ? { ...t, ...data, fechaUltimaModificacion: Date.now() } : t
    );
    this.registrarHistorial(id, empleadoId, "EDICION_TEXTO", data);
    this.save("servicar_mock_tickets", this.tickets);
    this.notify();
  }

  cambiarEstado(
    id: string,
    empleadoId: string,
    nuevoEstado: TicketEstado,
    notaAdmin?: string
  ) {
    const ticket = this.tickets.find((t) => t._id === id);
    if (!ticket) return;
    const estadoAnterior = ticket.estado;
    this.tickets = this.tickets.map((t) =>
      t._id === id
        ? {
            ...t,
            estado: nuevoEstado,
            notaAdmin: notaAdmin ?? t.notaAdmin,
            fechaUltimaModificacion: Date.now(),
          }
        : t
    );
    this.registrarHistorial(id, empleadoId, "CAMBIO_ESTADO", {
      estado_anterior: estadoAnterior,
      estado_nuevo: nuevoEstado,
      nota: notaAdmin,
    });
    this.save("servicar_mock_tickets", this.tickets);
    this.notify();
  }

  // ── Empleados ─────────────────────────────────────────────

  getEmpleados() {
    return [...this.empleados];
  }

  getEmpleadoById(id: string) {
    return this.empleados.find((e) => e._id === id) ?? null;
  }

  getEmpleadoByAuth(authId: string) {
    return this.empleados.find((e) => e.identificadorAutenticacion === authId) ?? null;
  }

  // ── Historial ─────────────────────────────────────────────

  getHistorialByTicket(ticketId: string) {
    return this.historial
      .filter((h) => h.ticketId === ticketId)
      .sort((a, b) => a._creationTime - b._creationTime);
  }

  private registrarHistorial(
    ticketId: string,
    empleadoId: string,
    tipoAccion: MockHistorial["tipoAccion"],
    detalles?: object
  ) {
    const entry: MockHistorial = {
      _id: `hist_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      _creationTime: Date.now(),
      ticketId,
      empleadoId,
      tipoAccion,
      detallesCambio: detalles ? JSON.stringify(detalles) : undefined,
    };
    this.historial = [...this.historial, entry];
    this.save("servicar_mock_historial", this.historial);
  }

  // ── Reset ─────────────────────────────────────────────────

  reset() {
    this.tickets = [...MOCK_TICKETS];
    this.historial = [...MOCK_HISTORIAL];
    if (typeof window !== "undefined") {
      localStorage.removeItem("servicar_mock_tickets");
      localStorage.removeItem("servicar_mock_historial");
    }
    this.notify();
  }
}

// Singleton — misma instancia en toda la app
export const mockStore = new MockStore();
