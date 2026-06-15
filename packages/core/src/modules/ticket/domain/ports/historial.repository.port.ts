import type { HistorialEntry } from "../entities/historial-entry.entity";

export interface IHistorialRepository {
  getByTicket(ticketId: string): HistorialEntry[];
  // write removed — TicketRepository.save() drains ticket.pendingHistorial
}
