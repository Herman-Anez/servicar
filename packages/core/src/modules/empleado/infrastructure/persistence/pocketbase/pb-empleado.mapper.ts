import { Empleado } from "../../../domain";
import type { Rol } from "../../../../shared/domain";

// Shape expected from the PocketBase `users` collection with custom fields `nombre` and `rol`.
export interface PbUser {
  id: string;
  created: string;
  email: string;
  nombre: string;
  rol: Rol;
}

export function pbUserToEmpleado(raw: PbUser): Empleado {
  return Empleado.reconstitute({
    id:     raw.id,
    nombre: raw.nombre,
    email:  raw.email,
    rol:    raw.rol,
  });
}
