import { AggregateRoot } from "../../../shared/domain/aggregate-root";
import type { Rol } from "../../../shared/domain";

export interface EmpleadoProps {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  authId: string;
}

export class Empleado extends AggregateRoot {
  private constructor(private readonly props: EmpleadoProps) {
    super();
  }

  static reconstitute(props: EmpleadoProps): Empleado {
    return new Empleado(props);
  }

  get id()     { return this.props.id; }
  get nombre() { return this.props.nombre; }
  get email()  { return this.props.email; }
  get rol()    { return this.props.rol; }
  get authId() { return this.props.authId; }

  toPlainObject(): EmpleadoProps {
    return { ...this.props };
  }
}
