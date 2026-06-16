import type { IAuthSessionService, SessionPayload } from "./session.port";

const SESSION_KEY = "servicar_mock_session";

export class MockSessionService implements IAuthSessionService {
  getSession(): SessionPayload | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as SessionPayload) : null;
    } catch {
      return null;
    }
  }

  setSession(payload: SessionPayload): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  }

  clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
  }
}
