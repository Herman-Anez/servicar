import { Ticket } from "../../domain";
import type { ITicketRepository } from "../../domain";
import type { CrearTicketDTO } from "../dtos/crear-ticket.dto";
import type { ICrearTicketUseCase } from "../ports-in/crear-ticket.use-case.port";

export class CrearTicketUseCase implements ICrearTicketUseCase {
  constructor(private readonly ticketRepo: ITicketRepository) {}

  execute(dto: CrearTicketDTO): string {
    const ticket = Ticket.create(dto); // emite CREACION en pendingHistorial
    this.ticketRepo.save(ticket);      // persiste ticket + drena pendingHistorial
    return ticket.id;
  }
}
