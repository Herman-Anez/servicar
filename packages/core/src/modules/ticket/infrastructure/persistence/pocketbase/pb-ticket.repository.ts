import type { ITicketRepository, Ticket } from "../../../domain";
import type { TicketEstado } from "../../../../shared/domain";
import type { PbStore } from "../../../../shared/infrastructure/pocketbase/pb-store";
import { pbTicketToEntity, entityToPbTicketData, entityToPbHistorialData } from "./pb-ticket.mapper";

export class PbTicketRepository implements ITicketRepository {
  constructor(private readonly store: PbStore) {}

  async getAll(): Promise<Ticket[]> {
    return this.store.getTickets().map(pbTicketToEntity);
  }

  async getById(id: string): Promise<Ticket | null> {
    const raw = this.store.getTicketById(id);
    return raw ? pbTicketToEntity(raw) : null;
  }

  async getByEstado(estado: TicketEstado): Promise<Ticket[]> {
    return this.store.getTicketsByEstado(estado).map(pbTicketToEntity);
  }

  async getByCreador(creadorId: string): Promise<Ticket[]> {
    return this.store.getTicketsByCreador(creadorId).map(pbTicketToEntity);
  }

  async save(ticket: Ticket): Promise<void> {
    await this.store.upsertTicket(ticket.id, entityToPbTicketData(ticket));
    for (const entry of ticket.pendingHistorial) {
      await this.store.appendHistorial(entityToPbHistorialData(entry));
    }
  }
}
