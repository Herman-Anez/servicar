import type { Ticket } from "../entities/ticket.entity";
import type { TicketEstado } from "../../../shared/domain";

export interface ITicketRepository {
  getAll(): Ticket[];
  getById(id: string): Ticket | null;
  getByEstado(estado: TicketEstado): Ticket[];
  getByCreador(creadorId: string): Ticket[];
  save(ticket: Ticket): void;
}
