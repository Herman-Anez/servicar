import type { IAuthProvider } from "../../domain";
import type { MockStore } from "../../../shared/infrastructure/mock/store";

export class MockAuthProvider implements IAuthProvider {
  constructor(private readonly store: MockStore) {}

  async autenticar(email: string, _password: string) {
    const emp = this.store.getEmpleados().find((e) => e.email === email);
    return emp ? { empleadoId: emp._id, rol: emp.rol } : null;
  }
}
