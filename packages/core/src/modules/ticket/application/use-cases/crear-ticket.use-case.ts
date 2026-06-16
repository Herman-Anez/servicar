import { Ticket } from "../../domain";
import type { ITicketRepository } from "../../domain";
import type { CrearTicketDTO } from "../dtos/crear-ticket.dto";
import type { ICrearTicketUseCase } from "../ports-in/crear-ticket.use-case.port";

export class CrearTicketUseCase implements ICrearTicketUseCase {
  constructor(private readonly ticketRepo: ITicketRepository) {}

  async execute(dto: CrearTicketDTO): Promise<string> {
    const ticket = Ticket.create(dto); // emite CREACION en pendingHistorial
    await this.ticketRepo.save(ticket); // persiste ticket + drena pendingHistorial
    return ticket.id;
  }
}
