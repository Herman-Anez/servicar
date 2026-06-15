import type { Ticket } from "../entities/ticket.entity";
import type { TicketEstado } from "../../../shared/domain";

export interface ITicketRepository {
  getAll(): Promise<Ticket[]>;
  getById(id: string): Promise<Ticket | null>;
  getByEstado(estado: TicketEstado): Promise<Ticket[]>;
  getByCreador(creadorId: string): Promise<Ticket[]>;
  save(ticket: Ticket): Promise<void>;
}
