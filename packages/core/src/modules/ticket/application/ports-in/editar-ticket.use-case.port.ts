import type { EditarTicketDTO } from "../dtos/editar-ticket.dto";

export interface IEditarTicketUseCase {
  execute(dto: EditarTicketDTO): void;
}
