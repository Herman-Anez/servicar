import { Ticket, HistorialEntry } from "../../../domain";
import type { TicketProps, HistorialEntryProps } from "../../../domain";
import type { MockTicket, MockHistorial } from "../../../../shared/infrastructure/mock/data";

export function mockTicketToEntity(raw: MockTicket): Ticket {
  const props: TicketProps = {
    id:                    raw._id,
    creationTime:          raw._creationTime,
    matricula:             raw.matricula,
    categoria:             raw.categoria,
    titulo:                raw.titulo,
    descripcion:           raw.descripcion,
    estado:                raw.estado,
    creadorId:             raw.creadorId,
    fechaUltimaModificacion: raw.fechaUltimaModificacion,
    notaAdmin:             raw.notaAdmin,
    bahia:                 raw.bahia,
  };
  return Ticket.reconstitute(props);
}

export function entityToMockTicket(ticket: Ticket): MockTicket {
  return {
    _id:                    ticket.id,
    _creationTime:          ticket.creationTime,
    matricula:              ticket.matricula,
    categoria:              ticket.categoria,
    titulo:                 ticket.titulo,
    descripcion:            ticket.descripcion,
    estado:                 ticket.estado,
    creadorId:              ticket.creadorId,
    fechaUltimaModificacion: ticket.fechaUltimaModificacion,
    notaAdmin:              ticket.notaAdmin,
    bahia:                  ticket.bahia,
  };
}

export function mockHistorialToEntity(raw: MockHistorial): HistorialEntry {
  const props: HistorialEntryProps = {
    id:             raw._id,
    creationTime:   raw._creationTime,
    ticketId:       raw.ticketId,
    empleadoId:     raw.empleadoId,
    tipoAccion:     raw.tipoAccion,
    detallesCambio: raw.detallesCambio,
  };
  return HistorialEntry.reconstitute(props);
}

export function entityToMockHistorial(entry: HistorialEntry): MockHistorial {
  return {
    _id:            entry.id,
    _creationTime:  entry.creationTime,
    ticketId:       entry.ticketId,
    empleadoId:     entry.empleadoId,
    tipoAccion:     entry.tipoAccion,
    detallesCambio: entry.detallesCambio,
  };
}
