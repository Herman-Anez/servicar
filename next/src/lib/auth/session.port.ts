export interface SessionPayload {
  empleadoId: string;
}

export interface IAuthSessionService {
  getSession(): SessionPayload | null;
  setSession(payload: SessionPayload): void;
  clearSession(): void;
}
