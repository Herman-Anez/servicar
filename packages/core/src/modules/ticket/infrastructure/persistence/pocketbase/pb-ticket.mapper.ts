import { Ticket, HistorialEntry } from "../../../domain";
import type { TicketProps, HistorialEntryProps, TipoAccion } from "../../../domain";
import type { TicketCategoria, TicketEstado } from "../../../../shared/domain";

export interface PbTicket {
  id: string;
  created: string;
  matricula: string;
  categoria: TicketCategoria;
  titulo: string;
  descripcion: string;
  estado: TicketEstado;
  creadorId: string;
  fechaUltimaModificacion: number;
  notaAdmin?: string;
  bahia?: string;
}

export interface PbHistorial {
  id: string;
  created: string;
  ticketId: string;
  empleadoId: string;
  tipoAccion: TipoAccion;
  detallesCambio?: string;
}

export function pbTicketToEntity(raw: PbTicket): Ticket {
  const props: TicketProps = {
    id:                      raw.id,
    creationTime:            new Date(raw.created).getTime(),
    matricula:               raw.matricula,
    categoria:               raw.categoria,
    titulo:                  raw.titulo,
    descripcion:             raw.descripcion,
    estado:                  raw.estado,
    creadorId:               raw.creadorId,
    fechaUltimaModificacion: raw.fechaUltimaModificacion,
    notaAdmin:               raw.notaAdmin || undefined,
    bahia:                   raw.bahia || undefined,
  };
  return Ticket.reconstitute(props);
}

export function entityToPbTicketData(ticket: Ticket): Omit<PbTicket, "id" | "created"> {
  return {
    matricula:               ticket.matricula,
    categoria:               ticket.categoria,
    titulo:                  ticket.titulo,
    descripcion:             ticket.descripcion,
    estado:                  ticket.estado,
    creadorId:               ticket.creadorId,
    fechaUltimaModificacion: ticket.fechaUltimaModificacion,
    notaAdmin:               ticket.notaAdmin,
    bahia:                   ticket.bahia,
  };
}

export function pbHistorialToEntity(raw: PbHistorial): HistorialEntry {
  const props: HistorialEntryProps = {
    id:             raw.id,
    creationTime:   new Date(raw.created).getTime(),
    ticketId:       raw.ticketId,
    empleadoId:     raw.empleadoId,
    tipoAccion:     raw.tipoAccion,
    detallesCambio: raw.detallesCambio || undefined,
  };
  return HistorialEntry.reconstitute(props);
}

export function entityToPbHistorialData(entry: HistorialEntry): Omit<PbHistorial, "id" | "created"> {
  return {
    ticketId:       entry.ticketId,
    empleadoId:     entry.empleadoId,
    tipoAccion:     entry.tipoAccion,
    detallesCambio: entry.detallesCambio,
  };
}
