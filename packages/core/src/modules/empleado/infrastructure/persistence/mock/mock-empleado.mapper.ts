import { Empleado } from "../../../domain";
import type { MockEmpleado } from "../../../../shared/infrastructure/mock/data";

export function mockEmpleadoToEntity(raw: MockEmpleado): Empleado {
  return Empleado.reconstitute({
    id: raw._id,
    nombre: raw.nombre,
    email: raw.email,
    rol: raw.rol,
    authId: raw.identificadorAutenticacion,
  });
}
