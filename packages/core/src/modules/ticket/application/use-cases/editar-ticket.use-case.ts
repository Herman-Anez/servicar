import type { ITicketRepository } from "../../domain";
import type { EditarTicketDTO } from "../dtos/editar-ticket.dto";
import type { IEditarTicketUseCase } from "../ports-in/editar-ticket.use-case.port";

export class EditarTicketUseCase implements IEditarTicketUseCase {
  constructor(private readonly ticketRepo: ITicketRepository) {}

  execute(dto: EditarTicketDTO): void {
    const ticket = this.ticketRepo.getById(dto.ticketId);
    if (!ticket) throw new Error(`Ticket ${dto.ticketId} no encontrado.`);

    const actualizado = ticket.editar(dto.campos, dto.empleadoId);
    this.ticketRepo.save(actualizado);
  }
}
