import type { Rol } from "../../../shared/domain";

export interface IAuthProvider {
  autenticar(email: string, password: string): Promise<{ empleadoId: string; rol: Rol } | null>;
}
