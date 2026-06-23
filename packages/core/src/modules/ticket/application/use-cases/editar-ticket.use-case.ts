import type { ITicketRepository } from "../../domain";
import type { EditarTicketDTO } from "../dtos/editar-ticket.dto";
import type { IEditarTicketUseCase } from "../ports-in/editar-ticket.use-case.port";

export class EditarTicketUseCase implements IEditarTicketUseCase {
  constructor(private readonly ticketRepo: ITicketRepository) {}

  async execute(dto: EditarTicketDTO): Promise<void> {
    const ticket = await this.ticketRepo.getById(dto.ticketId);
    if (!ticket) throw new Error(`Ticket ${dto.ticketId} no encontrado.`);

    if (dto.rol === "mecanico" && ticket.creadorId !== dto.empleadoId) {
      throw new Error("Mecánico solo puede editar sus propios tickets.");
    }

    const actualizado = ticket.editar(dto.campos, dto.empleadoId);
    await this.ticketRepo.save(actualizado);
  }
}
