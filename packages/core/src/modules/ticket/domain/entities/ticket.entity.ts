import { AggregateRoot } from "../../../shared/domain/aggregate-root";
import type { TicketEstado, TicketCategoria } from "../../../shared/domain";
import { isTransicionValida } from "../../../shared/domain";
import { Matricula } from "../value-objects/matricula.vo";
import { HistorialEntry } from "./historial-entry.entity";

export interface TicketProps {
  id: string;
  creationTime: number;
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

export type TicketCamposEditables = Partial<
  Pick<TicketProps, "titulo" | "descripcion" | "categoria" | "bahia" | "matricula">
>;

export class Ticket extends AggregateRoot {
  private constructor(
    private readonly props: TicketProps,
    private readonly _pendingHistorial: HistorialEntry[] = []
  ) {
    super();
  }

  static create(
    params: Pick<TicketProps, "matricula" | "categoria" | "titulo" | "descripcion" | "creadorId" | "bahia">
  ): Ticket {
    new Matricula(params.matricula);
    if (!params.titulo.trim())      throw new Error("El título es obligatorio.");
    if (!params.descripcion.trim()) throw new Error("La descripción es obligatoria.");

    const now = Date.now();
    const props: TicketProps = {
      ...params,
      id: `tk_${now}`,
      creationTime: now,
      estado: "pendiente_revision",
      fechaUltimaModificacion: now,
    };

    const entrada = HistorialEntry.create({
      ticketId: props.id,
      empleadoId: params.creadorId,
      tipoAccion: "CREACION",
      detallesCambio: JSON.stringify({ estado_nuevo: props.estado }),
    });

    return new Ticket(props, [entrada]);
  }

  static reconstitute(props: TicketProps): Ticket {
    return new Ticket(props, []);
  }

  cambiarEstado(nuevoEstado: TicketEstado, empleadoId: string, notaAdmin?: string): Ticket {
    if (!isTransicionValida(this.props.estado, nuevoEstado)) {
      throw new Error(`Transición inválida: ${this.props.estado} → ${nuevoEstado}`);
    }
    if (nuevoEstado === "requiere_cambios" && !notaAdmin?.trim()) {
      throw new Error("Se requiere nota al solicitar cambios al mecánico.");
    }

    const nuevosProps: TicketProps = {
      ...this.props,
      estado: nuevoEstado,
      notaAdmin: notaAdmin ?? this.props.notaAdmin,
      fechaUltimaModificacion: Date.now(),
    };

    const entrada = HistorialEntry.create({
      ticketId: this.props.id,
      empleadoId,
      tipoAccion: "CAMBIO_ESTADO",
      detallesCambio: JSON.stringify({ estado_anterior: this.props.estado, estado_nuevo: nuevoEstado, nota: notaAdmin }),
    });

    return new Ticket(nuevosProps, [entrada]);
  }

  editar(campos: TicketCamposEditables, empleadoId: string): Ticket {
    if (campos.matricula !== undefined) new Matricula(campos.matricula);

    const nuevosProps: TicketProps = {
      ...this.props,
      ...campos,
      fechaUltimaModificacion: Date.now(),
    };

    const entrada = HistorialEntry.create({
      ticketId: this.props.id,
      empleadoId,
      tipoAccion: "EDICION_TEXTO",
      detallesCambio: JSON.stringify(campos),
    });

    return new Ticket(nuevosProps, [entrada]);
  }

  get pendingHistorial(): readonly HistorialEntry[] {
    return [...this._pendingHistorial];
  }

  get id()                      { return this.props.id; }
  get creationTime()            { return this.props.creationTime; }
  get matricula()               { return this.props.matricula; }
  get categoria()               { return this.props.categoria; }
  get titulo()                  { return this.props.titulo; }
  get descripcion()             { return this.props.descripcion; }
  get estado()                  { return this.props.estado; }
  get creadorId()               { return this.props.creadorId; }
  get fechaUltimaModificacion() { return this.props.fechaUltimaModificacion; }
  get notaAdmin()               { return this.props.notaAdmin; }
  get bahia()                   { return this.props.bahia; }

  toPlainObject(): TicketProps {
    return { ...this.props };
  }
}
