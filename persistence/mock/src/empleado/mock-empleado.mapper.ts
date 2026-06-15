import { Empleado } from "@servicar/core";
import type { MockEmpleado } from "../data";

export function mockEmpleadoToEntity(raw: MockEmpleado): Empleado {
  return Empleado.reconstitute({
    id: raw._id,
    nombre: raw.nombre,
    email: raw.email,
    rol: raw.rol,
    authId: raw.identificadorAutenticacion,
  });
}
