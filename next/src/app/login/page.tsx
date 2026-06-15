"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSignIn, useAuth, MOCK_EMPLEADOS } from "@/lib/db";

const EMAIL_TO_AUTH: Record<string, string> = Object.fromEntries(
  MOCK_EMPLEADOS.map((e) => [e.email, e.identificadorAutenticacion])
);

const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 8l-9 6-9-6"/>
    <rect x="2" y="6" width="20" height="13" rx="2"/>
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="11" width="14" height="10" rx="2"/>
    <path d="M8 11V7a4 4 0 018 0v4"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
);

export default function LoginPage() {
  const { isAuthenticated, empleado } = useAuth();
  const signIn = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && empleado) {
      router.replace(empleado.rol === "admin" ? "/admin/cola" : "/dashboard");
    }
  }, [isAuthenticated, empleado, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) { setError("Completa todos los campos."); return; }
    const authId = EMAIL_TO_AUTH[email.trim().toLowerCase()];
    if (!authId) { setError("Email no reconocido."); return; }
    setLoading(true);
    try {
      const emp = signIn(authId);
      router.replace(emp.rol === "admin" ? "/admin/cola" : "/dashboard");
    } catch {
      setError("Credenciales inválidas.");
      setLoading(false);
    }
  };

  const loginAs = (authId: string) => {
    const emp = signIn(authId);
    router.replace(emp.rol === "admin" ? "/admin/cola" : "/dashboard");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--sp-surface-dim)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      fontFamily: "Inter, sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: 440 }}>

        {/* Branding */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img
            src="/servicar-logo.svg"
            alt="SERVICAR"
            style={{ width: 260, height: 102, margin: "0 auto 12px", display: "block" }}
          />
          <p style={{ fontSize: 14, color: "var(--sp-on-surface-variant)", margin: 0 }}>
            Secure Administration Portal
          </p>
        </div>

        {/* Form card */}
        <div className="sp-card" style={{ padding: 24, marginBottom: 24 }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: "var(--sp-on-surface)", margin: "0 0 4px" }}>
              Login
            </h2>
            <p style={{ fontSize: 12, color: "var(--sp-secondary)", margin: 0, fontWeight: 500 }}>
              Enter your administrator credentials
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--sp-on-surface-variant)", paddingLeft: 4 }}>
                Administrator Email
              </label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  color: "var(--sp-outline)", pointerEvents: "none",
                  display: "flex", alignItems: "center",
                }}>
                  <EmailIcon />
                </span>
                <input
                  type="email"
                  className="sp-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@servicar.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingInline: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--sp-on-surface-variant)" }}>
                  Password
                </label>
                <a href="#" style={{ fontSize: 12, color: "var(--sp-primary)", textDecoration: "none", fontWeight: 600 }}>
                  Forgot?
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  color: "var(--sp-outline)", pointerEvents: "none",
                  display: "flex", alignItems: "center",
                }}>
                  <LockIcon />
                </span>
                <input
                  type="password"
                  className="sp-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Security notice */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "var(--sp-surface-container)",
              border: "1px solid var(--sp-outline-variant)",
              borderRadius: 8, padding: "10px 12px",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--sp-primary-container)">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
              </svg>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--sp-on-secondary-container)", margin: 0 }}>
                Encrypted end-to-end · Security active
              </p>
            </div>

            {error && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#ffdad6", border: "1px solid #ba1a1a33",
                borderRadius: 8, padding: "10px 12px",
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#ba1a1a">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <span style={{ fontSize: 12, color: "#93000a", fontWeight: 500 }}>{error}</span>
              </div>
            )}

            <button type="submit" className="sp-btn-primary" disabled={loading}>
              {loading ? "Autenticando…" : <>Acceder al Sistema <ArrowIcon /></>}
            </button>
          </form>
        </div>

        {/* Dev shortcuts */}
        <div style={{
          background: "var(--sp-surface-container-low)",
          border: "1px solid var(--sp-outline-variant)",
          borderRadius: 12, padding: 16, marginBottom: 24,
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--sp-outline)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
            Acceso rápido — modo desarrollo
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {MOCK_EMPLEADOS.map((emp) => (
              <button
                key={emp._id}
                onClick={() => loginAs(emp.identificadorAutenticacion)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "8px 12px", borderRadius: 8, cursor: "pointer",
                  border: "1px solid var(--sp-outline-variant)",
                  background: "var(--sp-surface-container-lowest)",
                  textAlign: "left",
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--sp-on-surface)" }}>{emp.nombre}</div>
                  <div style={{ fontSize: 11, color: "var(--sp-on-surface-variant)" }}>{emp.email}</div>
                </div>
                <span style={{
                  fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 4,
                  background: emp.rol === "admin" ? "#bc010015" : "var(--sp-surface-container)",
                  color: emp.rol === "admin" ? "var(--sp-primary)" : "var(--sp-on-surface-variant)",
                  textTransform: "uppercase", letterSpacing: "0.07em",
                }}>
                  {emp.rol}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer style={{ textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 8 }}>
            {["Soporte", "Privacidad", "Términos"].map((l) => (
              <a key={l} href="#" style={{ fontSize: 12, color: "var(--sp-secondary)", textDecoration: "none", fontWeight: 600 }}>
                {l}
              </a>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "var(--sp-outline)", margin: 0 }}>
            © 2024 SERVICAR Workshop Solutions. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </div>
  );
}
