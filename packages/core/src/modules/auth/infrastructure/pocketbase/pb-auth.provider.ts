import type PocketBase from "pocketbase";
import type { IAuthProvider } from "../../domain";
import type { Rol } from "../../../shared/domain";

export class PbAuthProvider implements IAuthProvider {
  constructor(private readonly pb: PocketBase) {}

  async autenticar(email: string, password: string): Promise<{ empleadoId: string; rol: Rol } | null> {
    try {
      const auth = await this.pb.collection("users").authWithPassword(email, password);
      return { empleadoId: auth.record.id, rol: auth.record["rol"] as Rol };
    } catch {
      return null;
    }
  }
}
