import type PocketBase from "pocketbase";
import type { Rol } from "../../../domain";

export interface AuthResult {
  empleadoId: string;
  nombre: string;
  rol: Rol;
  token: string;
}

/**
 * Thin wrapper around PocketBase auth for Servicar.
 *
 * The PocketBase `users` collection must have two extra fields:
 *   - `nombre` (text)  — display name
 *   - `rol`   (select) — `mecanico` | `admin`
 */
export class PbAuthService {
  constructor(private readonly pb: PocketBase) {}

  async login(email: string, password: string): Promise<AuthResult> {
    const authData = await this.pb.collection("users").authWithPassword(email, password);
    const record = authData.record as Record<string, unknown>;

    return {
      empleadoId: authData.record.id,
      nombre:     record["nombre"] as string,
      rol:        record["rol"] as Rol,
      token:      authData.token,
    };
  }

  logout(): void {
    this.pb.authStore.clear();
  }

  get isAuthenticated(): boolean {
    return this.pb.authStore.isValid;
  }

  get currentEmpleadoId(): string | null {
    return this.pb.authStore.isValid ? (this.pb.authStore.model?.id ?? null) : null;
  }
}
