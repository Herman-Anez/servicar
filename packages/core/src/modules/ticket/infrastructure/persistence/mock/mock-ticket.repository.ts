import type { ITicketRepository, Ticket } from "../../../domain";
import type { TicketEstado } from "../../../../shared/domain";
import type { MockStore } from "../../../../shared/infrastructure/mock/store";
import { mockTicketToEntity, entityToMockTicket, entityToMockHistorial } from "./mock-ticket.mapper";

export class MockTicketRepository implements ITicketRepository {
  constructor(private readonly store: MockStore) {}

  getAll(): Promise<Ticket[]> {
    return Promise.resolve(this.store.getTickets().map(mockTicketToEntity));
  }

  getById(id: string): Promise<Ticket | null> {
    const raw = this.store.getTicketById(id);
    return Promise.resolve(raw ? mockTicketToEntity(raw) : null);
  }

  getByEstado(estado: TicketEstado): Promise<Ticket[]> {
    return Promise.resolve(this.store.getTicketsByEstado(estado).map(mockTicketToEntity));
  }

  getByCreador(creadorId: string): Promise<Ticket[]> {
    return Promise.resolve(this.store.getTicketsByCreador(creadorId).map(mockTicketToEntity));
  }

  save(ticket: Ticket): Promise<void> {
    this.store.upsertTicket(entityToMockTicket(ticket));
    for (const entry of ticket.pendingHistorial) {
      this.store.appendHistorial(entityToMockHistorial(entry));
    }
    return Promise.resolve();
  }
}
