import type PocketBase from "pocketbase";
import type { TicketEstado } from "../../domain";
import type { PbTicket, PbHistorial } from "../../../ticket/infrastructure/persistence/pocketbase/pb-ticket.mapper";
import type { PbUser } from "../../../empleado/infrastructure/persistence/pocketbase/pb-empleado.mapper";

type Listener = () => void;

/**
 * Snapshot cache backed by PocketBase.
 *
 * Call `init()` once at app startup to load data and start real-time
 * subscriptions. After that, all reads are synchronous (from cache) and
 * writes go to PocketBase then update the cache optimistically.
 *
 * React components use `subscribe()` to re-render when the cache changes,
 * mirroring the same pattern as MockStore.
 */
export class PbStore {
  private tickets: PbTicket[] = [];
  private users: PbUser[] = [];
  private historial: PbHistorial[] = [];
  private listeners = new Set<Listener>();

  constructor(private readonly pb: PocketBase) {}

  async init(): Promise<void> {
    const [tickets, users, historial] = await Promise.all([
      this.pb.collection("tickets").getFullList<PbTicket>({ sort: "-created" }),
      this.pb.collection("users").getFullList<PbUser>(),
      this.pb.collection("historial_ediciones").getFullList<PbHistorial>({ sort: "+created" }),
    ]);

    this.tickets = tickets;
    this.users = users;
    this.historial = historial;

    this.pb.collection("tickets").subscribe<PbTicket>("*", (e) => {
      if (e.action === "delete") {
        this.tickets = this.tickets.filter((t) => t.id !== e.record.id);
      } else {
        this.tickets = [...this.tickets.filter((t) => t.id !== e.record.id), e.record];
      }
      this.notify();
    });

    this.pb.collection("historial_ediciones").subscribe<PbHistorial>("*", (e) => {
      if (e.action === "create") {
        this.historial = [...this.historial, e.record];
        this.notify();
      }
    });

    this.notify();
  }

  async destroy(): Promise<void> {
    await this.pb.collection("tickets").unsubscribe();
    await this.pb.collection("historial_ediciones").unsubscribe();
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  }

  notify(): void {
    this.listeners.forEach((fn) => fn());
  }

  // ── Sync reads (from cache) ───────────────────────────────────────────────

  getTickets(): PbTicket[] {
    return [...this.tickets];
  }

  getTicketById(id: string): PbTicket | null {
    return this.tickets.find((t) => t.id === id) ?? null;
  }

  getTicketsByEstado(estado: TicketEstado): PbTicket[] {
    return this.tickets.filter((t) => t.estado === estado);
  }

  getTicketsByCreador(creadorId: string): PbTicket[] {
    return this.tickets.filter((t) => t.creadorId === creadorId);
  }

  getUsers(): PbUser[] {
    return [...this.users];
  }

  getUserById(id: string): PbUser | null {
    return this.users.find((u) => u.id === id) ?? null;
  }

  getHistorialByTicket(ticketId: string): PbHistorial[] {
    return this.historial
      .filter((h) => h.ticketId === ticketId)
      .sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
  }

  // ── Async writes (to PocketBase + cache update) ───────────────────────────

  async upsertTicket(id: string, data: Omit<PbTicket, "id" | "created">): Promise<PbTicket> {
    const exists = this.tickets.some((t) => t.id === id);
    let record: PbTicket;
    if (exists) {
      record = await this.pb.collection("tickets").update<PbTicket>(id, data);
    } else {
      record = await this.pb.collection("tickets").create<PbTicket>({ id, ...data });
    }
    this.tickets = [...this.tickets.filter((t) => t.id !== record.id), record];
    this.notify();
    return record;
  }

  async appendHistorial(data: Omit<PbHistorial, "id" | "created">): Promise<PbHistorial> {
    const record = await this.pb.collection("historial_ediciones").create<PbHistorial>(data);
    this.historial = [...this.historial, record];
    return record;
  }
}
