import type PocketBase from "pocketbase";
import type { IAuthSessionService, SessionPayload } from "./session.port";

export class PbSessionService implements IAuthSessionService {
  constructor(private readonly pb: PocketBase) {}

  getSession(): SessionPayload | null {
    if (typeof window === "undefined") return null;
    if (!this.pb.authStore.isValid) return null;
    const id = this.pb.authStore.model?.id;
    return id ? { empleadoId: id } : null;
  }

  // PocketBase populates authStore automatically on authWithPassword — no manual write needed.
  setSession(_payload: SessionPayload): void {}

  clearSession(): void {
    this.pb.authStore.clear();
  }
}
