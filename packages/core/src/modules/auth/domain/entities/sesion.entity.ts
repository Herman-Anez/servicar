import type { Rol } from "../../../shared/domain";

export interface SesionProps {
  empleadoId: string;
  rol: Rol;
}

export class Sesion {
  private constructor(private readonly props: SesionProps) {}

  static create(props: SesionProps): Sesion {
    if (!props.empleadoId) throw new Error("empleadoId requerido");
    return new Sesion(props);
  }

  get empleadoId(): string { return this.props.empleadoId; }
  get rol(): Rol { return this.props.rol; }

  toPlainObject(): SesionProps { return { ...this.props }; }
}
