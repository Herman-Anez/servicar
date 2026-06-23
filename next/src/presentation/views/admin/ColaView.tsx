"use client";

import { Column, Row, Text, Heading, Icon, Tag, Avatar } from "@once-ui-system/core";
import { KpiCard } from "@/presentation/views/shared";
import type { Ticket } from "@servicar/core";
import type { Empleado } from "@servicar/core";
import type { ColaVM } from "@/presentation/view-models/admin/useCola.view-model";
import { ConfirmModal, TriageRow } from "./components/TriageComponents";

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
          <KpiCard label="En Triage"          value={cola.length}    badge={`+${Math.max(0, cola.length)}%`} badgeBg="#ffdad6"                            badgeColor="#93000a" />
          <KpiCard label="Tiempo Prom."        value="1.2h"           badge="ESTABLE"                          badgeBg="var(--neutral-background-weak)"      badgeColor="var(--neutral-on-background-weak)" />
          <KpiCard label="Aprobados Hoy"       value={aprobadosHoy}   badge="ALTO"                             badgeBg="#ffdad4"                            badgeColor="#930100" />
          <KpiCard label="Mecánicos Activos"   value={mecanicos}      badge="ACTIVOS"                          badgeBg="#eddfe2"                            badgeColor="#4e4447" />
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


