import type { ITicketRepository } from "../../domain";
import type { CambiarEstadoDTO } from "../dtos/cambiar-estado.dto";
import type { ICambiarEstadoUseCase } from "../ports-in/cambiar-estado.use-case.port";

export class CambiarEstadoUseCase implements ICambiarEstadoUseCase {
  constructor(private readonly ticketRepo: ITicketRepository) {}

  execute(dto: CambiarEstadoDTO): void {
    const ticket = this.ticketRepo.getById(dto.ticketId);
    if (!ticket) throw new Error(`Ticket ${dto.ticketId} no encontrado.`);

    const actualizado = ticket.cambiarEstado(dto.nuevoEstado, dto.empleadoId, dto.notaAdmin);
    this.ticketRepo.save(actualizado);
  }
}
