import type { ITicketRepository, Ticket, TicketEstado } from "@servicar/core";
import type { MockStore } from "../store";
import { mockTicketToEntity, entityToMockTicket, entityToMockHistorial } from "./mock-ticket.mapper";

export class MockTicketRepository implements ITicketRepository {
  constructor(private readonly store: MockStore) {}

  getAll(): Ticket[] {
    return this.store.getTickets().map(mockTicketToEntity);
  }

  getById(id: string): Ticket | null {
    const raw = this.store.getTicketById(id);
    return raw ? mockTicketToEntity(raw) : null;
  }

  getByEstado(estado: TicketEstado): Ticket[] {
    return this.store.getTicketsByEstado(estado).map(mockTicketToEntity);
  }

  getByCreador(creadorId: string): Ticket[] {
    return this.store.getTicketsByCreador(creadorId).map(mockTicketToEntity);
  }

  save(ticket: Ticket): void {
    this.store.upsertTicket(entityToMockTicket(ticket));
    for (const entry of ticket.pendingHistorial) {
      this.store.appendHistorial(entityToMockHistorial(entry));
    }
  }
}
