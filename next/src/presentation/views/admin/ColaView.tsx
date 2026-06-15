"use client";

import { Column, Row, Text, Heading, Icon, Tag, Avatar } from "@once-ui-system/core";
import type { Ticket } from "@servicar/core";
import type { Empleado } from "@servicar/core";
import type { ColaVM, PendingAction } from "@/presentation/view-models/admin/useColaViewModel";

export function ColaView(props: ColaVM) {
  const { cola, aprobadosHoy, mecanicos, empleadoMap, pending, processing,
          onDecision, onConfirm, onCancelPending, onUpdateNota, edadLabel } = props;

  return (
    <>
      <style>{`
        .kpi-grid      { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:24px; }
        .cola-h2       { font-size:32px; }
        .triage-table  { display:block; overflow-x:auto; }
        .triage-mobile { display:none; }
        @media(max-width:900px){ .kpi-grid{ grid-template-columns:repeat(2,1fr); } }
        @media(max-width:640px){
          .cola-h2       { font-size:22px; }
          .triage-table  { display:none; }
          .triage-mobile { display:flex; flex-direction:column; gap:1px; background:var(--neutral-alpha-weak); }
        }
        @media(max-width:480px){ .kpi-grid{ grid-template-columns:1fr; } }
      `}</style>

      <Column fillWidth gap="0">
        <Row gap="8" vertical="center" paddingBottom="8">
          <Text variant="label-default-xs" onBackground="neutral-weak">Taller</Text>
          <Icon name="chevronRight" size="xs" onBackground="neutral-weak" />
          <Text variant="label-default-xs" onBackground="brand-medium" style={{ fontWeight: 700 }}>Bandeja de Triage</Text>
        </Row>

        <Column gap="8" paddingBottom="32">
          <Heading variant="heading-strong-l" className="cola-h2" style={{ letterSpacing: "-0.01em" }}>
            Cola de Revisión
          </Heading>
          <Row gap="8" vertical="center" style={{ display: "inline-flex", padding: "3px 12px", background: "#bc010010", borderRadius: 20, border: "1px solid #bc010030" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--brand-background-strong)", flexShrink: 0 }} />
            <Text variant="label-default-xs" onBackground="brand-medium" style={{ fontWeight: 600 }}>
              {cola.length} pendiente{cola.length !== 1 ? "s" : ""}
            </Text>
          </Row>
        </Column>

        <div className="kpi-grid">
          <KPICard label="En Triage"          value={cola.length}    badge={`+${Math.max(0, cola.length)}%`} badgeBg="#ffdad6"                            badgeColor="#93000a" />
          <KPICard label="Tiempo Prom."        value="1.2h"           badge="ESTABLE"                          badgeBg="var(--neutral-background-weak)"      badgeColor="var(--neutral-on-background-weak)" />
          <KPICard label="Aprobados Hoy"       value={aprobadosHoy}   badge="ALTO"                             badgeBg="#ffdad4"                            badgeColor="#930100" />
          <KPICard label="Mecánicos Activos"   value={mecanicos}      badge="ACTIVOS"                          badgeBg="#eddfe2"                            badgeColor="#4e4447" />
        </div>

        <Column border="neutral-alpha-weak" radius="m" overflow="hidden" paddingBottom="0">
          <Row fillWidth horizontal="between" vertical="center" paddingX="24" paddingY="16" borderBottom="neutral-alpha-weak">
            <Heading variant="heading-strong-s">Solicitudes Recientes</Heading>
            {cola.length > 0 && (
              <Row style={{ background: "#bc010010", borderRadius: 20, padding: "3px 12px" }}>
                <Text variant="label-default-xs" onBackground="brand-medium" style={{ fontWeight: 800 }}>
                  {cola.length} TOTAL PENDIENTES
                </Text>
              </Row>
            )}
          </Row>

          {cola.length === 0 ? (
            <Column paddingX="24" paddingY="40" horizontal="center" gap="12">
              <Icon name="checkCircle" size="l" onBackground="success-medium" />
              <Text variant="body-default-s" onBackground="neutral-weak">Cola vacía — no hay tickets pendientes de revisión.</Text>
            </Column>
          ) : (
            <>
              <div className="triage-table">
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "var(--neutral-background-weak)" }}>
                      {["N° Ticket", "Matrícula", "Categoría", "Mecánico", ""].map((h, i) => (
                        <th key={i} style={{ padding: "12px 16px", fontSize: 11, fontWeight: 600, color: "var(--neutral-on-background-weak)", letterSpacing: "0.04em", textAlign: h === "" ? "right" : "left" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cola.map((ticket) => {
                      const creador = empleadoMap[ticket.creadorId];
                      return (
                        <TriageRow
                          key={ticket.id}
                          ticket={ticket}
                          creador={creador}
                          edadLabel={edadLabel(ticket)}
                          onAprobar={() => onDecision(ticket, "aprobar")}
                          onRechazar={() => onDecision(ticket, "rechazar")}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="triage-mobile">
                {cola.map((ticket) => {
                  const creador = empleadoMap[ticket.creadorId];
                  return (
                    <Column key={ticket.id} padding="16" gap="8" background="surface">
                      <Row fillWidth horizontal="between" vertical="start">
                        <Column gap="2">
                          <Text variant="label-strong-xs" onBackground="brand-medium">
                            #TC-{ticket.id.slice(-4).toUpperCase()}
                          </Text>
                          <Text variant="label-default-xs" onBackground="neutral-weak">{edadLabel(ticket)}</Text>
                        </Column>
                        <Tag variant="neutral" label={ticket.matricula} size="s" />
                      </Row>
                      <Row gap="8" vertical="center">
                        <Tag variant="neutral" label={ticket.categoria} size="s" />
                        {creador && <Text variant="label-default-s" onBackground="neutral-strong">{creador.nombre}</Text>}
                      </Row>
                      <Row gap="8" fillWidth>
                        <button onClick={() => onDecision(ticket, "rechazar")} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid var(--neutral-alpha-medium)", background: "transparent", color: "var(--neutral-on-background-weak)", cursor: "pointer", fontSize: 12, fontWeight: 500, fontFamily: "inherit" }}>Rechazar</button>
                        <button onClick={() => onDecision(ticket, "aprobar")}  style={{ flex: 1, padding: "8px 0", borderRadius: 8, background: "var(--brand-background-strong)", color: "#fff", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, fontFamily: "inherit" }}>Aprobar</button>
                      </Row>
                    </Column>
                  );
                })}
              </div>
            </>
          )}

          {cola.length > 0 && (
            <Row fillWidth horizontal="between" vertical="center" paddingX="24" paddingY="12" borderTop="neutral-alpha-weak">
              <Text variant="label-default-xs" onBackground="neutral-weak">
                Mostrando {cola.length} de {cola.length} tickets pendientes
              </Text>
            </Row>
          )}
        </Column>
      </Column>

      {pending && (
        <ConfirmModal
          pending={pending}
          processing={processing}
          onConfirm={onConfirm}
          onCancel={onCancelPending}
          onUpdateNota={onUpdateNota}
        />
      )}
    </>
  );
}

function ConfirmModal({ pending, processing, onConfirm, onCancel, onUpdateNota }: {
  pending: PendingAction; processing: boolean;
  onConfirm: () => void; onCancel: () => void; onUpdateNota: (nota: string) => void;
}) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ position: "fixed", inset: 0 }} onClick={() => !processing && onCancel()} />
      <Column
        background="page"
        border="neutral-alpha-weak"
        radius="m"
        padding="24"
        gap="16"
        style={{ width: "100%", maxWidth: 480, position: "relative", zIndex: 1, boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
      >
        <Heading variant="heading-strong-s">
          {pending.action === "aprobar" ? "Aprobar Ticket" : "Solicitar Cambios"}
        </Heading>

        <Column background="surface" radius="s" padding="12" gap="8">
          <Text variant="label-default-xs" onBackground="neutral-weak" style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>TICKET</Text>
          <Row gap="8" vertical="center">
            <Tag variant="danger" label={pending.ticket.matricula} size="s" />
            <Text variant="label-strong-s">{pending.ticket.titulo}</Text>
          </Row>
        </Column>

        {pending.action === "rechazar" && (
          <Column gap="8">
            <Text variant="label-default-xs" onBackground="neutral-weak" style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>
              NOTA PARA EL MECÁNICO <span style={{ color: "var(--danger-on-background-strong)" }}>*</span>
            </Text>
            <textarea
              value={pending.nota}
              onChange={(e) => onUpdateNota(e.target.value)}
              placeholder="Explica qué debe corregir el mecánico…"
              rows={4}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, background: "var(--neutral-background-weak)", border: "1px solid var(--neutral-alpha-medium)", color: "var(--neutral-on-background-strong)", fontSize: 13, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box" }}
            />
          </Column>
        )}

        {pending.action === "aprobar" && (
          <Text variant="body-default-s" onBackground="neutral-weak">
            El ticket pasará a estado <strong>aprobado</strong> y el mecánico podrá comenzar el trabajo.
          </Text>
        )}

        <Row gap="8" fillWidth>
          <button
            onClick={onCancel}
            disabled={processing}
            style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid var(--neutral-alpha-medium)", background: "transparent", color: "var(--neutral-on-background-weak)", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={processing || (pending.action === "rechazar" && !pending.nota.trim())}
            style={{ flex: 2, padding: "10px 0", borderRadius: 8, border: "none", background: pending.action === "aprobar" ? "var(--brand-background-strong)" : "var(--danger-background-strong)", color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 800, fontFamily: "inherit", opacity: (processing || (pending.action === "rechazar" && !pending.nota.trim())) ? 0.5 : 1 }}
          >
            {pending.action === "aprobar" ? "Confirmar Aprobación" : "Enviar al Mecánico"}
          </button>
        </Row>
      </Column>
    </div>
  );
}

function TriageRow({ ticket, creador, edadLabel, onAprobar, onRechazar }: {
  ticket: Ticket; creador?: Empleado; edadLabel: string;
  onAprobar: () => void; onRechazar: () => void;
}) {
  return (
    <tr
      style={{ borderTop: "1px solid var(--neutral-background-medium)", transition: "background 0.12s" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--neutral-background-weak)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <td style={{ padding: "14px 16px" }}>
        <Column gap="2">
          <Text variant="label-strong-xs" onBackground="brand-medium">
            #TC-{ticket.id.slice(-4).toUpperCase()}
          </Text>
          <Text variant="label-default-xs" onBackground="neutral-weak" style={{ textTransform: "uppercase" }}>
            {edadLabel}
          </Text>
        </Column>
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Tag variant="neutral" label={ticket.matricula} size="s" />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Tag variant="neutral" label={ticket.categoria} size="s" />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Row gap="8" vertical="center">
          <Avatar value={creador?.nombre ?? "?"} size="xs" />
          <Text variant="label-default-s">{creador?.nombre ?? "—"}</Text>
        </Row>
      </td>
      <td style={{ padding: "14px 16px", textAlign: "right" }}>
        <Row gap="8" horizontal="end" vertical="center">
          <button
            onClick={onRechazar}
            style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid var(--neutral-alpha-medium)", background: "transparent", color: "var(--neutral-on-background-weak)", cursor: "pointer", fontSize: 12, fontWeight: 500, fontFamily: "inherit" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--neutral-background-medium)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Rechazar
          </button>
          <button
            onClick={onAprobar}
            style={{ padding: "6px 16px", borderRadius: 8, background: "var(--brand-background-strong)", color: "#fff", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, fontFamily: "inherit" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Aprobar
          </button>
        </Row>
      </td>
    </tr>
  );
}

function KPICard({ label, value, badge, badgeBg, badgeColor }: {
  label: string; value: string | number; badge: string; badgeBg: string; badgeColor: string;
}) {
  return (
    <Column border="neutral-alpha-weak" radius="m" padding="16" gap="8" background="page">
      <Text variant="label-default-xs" onBackground="neutral-weak" style={{ textTransform: "uppercase", letterSpacing: "0.07em" }}>
        {label}
      </Text>
      <Row fillWidth horizontal="between" vertical="center">
        <Heading variant="display-strong-s">{value}</Heading>
        <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: badgeBg, color: badgeColor }}>{badge}</span>
      </Row>
    </Column>
  );
}
