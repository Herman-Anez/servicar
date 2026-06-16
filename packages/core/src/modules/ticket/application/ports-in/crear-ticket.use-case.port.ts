import type { CrearTicketDTO } from "../dtos/crear-ticket.dto";

export interface ICrearTicketUseCase {
  execute(dto: CrearTicketDTO): Promise<string>;
}
