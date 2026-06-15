import type { TicketCategoria } from "../../../shared/domain";

export interface CrearTicketDTO {
  matricula: string;
  categoria: TicketCategoria;
  titulo: string;
  descripcion: string;
  creadorId: string;
  bahia?: string;
}
