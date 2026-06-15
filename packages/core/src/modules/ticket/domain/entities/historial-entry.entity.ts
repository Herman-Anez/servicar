export type TipoAccion = "CREACION" | "CAMBIO_ESTADO" | "EDICION_TEXTO";

export interface HistorialEntryProps {
  id: string;
  creationTime: number;
  ticketId: string;
  empleadoId: string;
  tipoAccion: TipoAccion;
  detallesCambio?: string;
}

export class HistorialEntry {
  private constructor(private readonly props: HistorialEntryProps) {}

  static create(
    params: Pick<HistorialEntryProps, "ticketId" | "empleadoId" | "tipoAccion" | "detallesCambio">
  ): HistorialEntry {
    const now = Date.now();
    return new HistorialEntry({
      ...params,
      id: `hist_${now}_${Math.random().toString(36).slice(2)}`,
      creationTime: now,
    });
  }

  static reconstitute(props: HistorialEntryProps): HistorialEntry {
    return new HistorialEntry(props);
  }

  get id()              { return this.props.id; }
  get creationTime()    { return this.props.creationTime; }
  get ticketId()        { return this.props.ticketId; }
  get empleadoId()      { return this.props.empleadoId; }
  get tipoAccion()      { return this.props.tipoAccion; }
  get detallesCambio()  { return this.props.detallesCambio; }

  toPlainObject(): HistorialEntryProps {
    return { ...this.props };
  }
}
