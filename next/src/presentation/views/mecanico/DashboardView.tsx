"use client";

import { Column, Row, Text, Heading, Icon, SmartLink } from "@once-ui-system/core";
import type { DashboardVM } from "@/presentation/view-models/mecanico/useDashboardViewModel";
import type { Ticket } from "@servicar/core";
import type { TicketEstado } from "@servicar/core";
import { EstadoChip } from "@/presentation/views/shared/EstadoChip";

export function DashboardView({ totalActivos, misTicketsTotal, recentTickets, onNuevoTicket, onVerFichas, onVerTaller }: DashboardVM) {
  return (
    <Column fillWidth gap="24" paddingBottom="16">
      <Column gap="4" borderBottom="neutral-alpha-weak" paddingBottom="12">
        <Heading variant="heading-strong-m">Panel de Control</Heading>
        <Text variant="label-default-xs" onBackground="neutral-weak">
          TALLER NORTE · TURNO MAÑANA
        </Text>
      </Column>

      <Row gap="12" fillWidth>
        <button onClick={onVerFichas} style={{ flex: 1, background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}>
          <Column fillWidth gap="8" padding="12" border="neutral-alpha-weak" radius="m" background="surface">
            <Row fillWidth horizontal="between" vertical="center">
              <Text variant="label-default-xs" onBackground="neutral-weak">EN REVISIÓN / ACCIÓN</Text>
              <Icon name="chevronRight" size="xs" onBackground="neutral-weak" />
            </Row>
            <Row gap="8" vertical="center">
              <Heading variant="display-strong-s" onBackground="brand-strong">{totalActivos}</Heading>
              <Text variant="label-default-xs" onBackground="neutral-weak">FICHAS</Text>
            </Row>
            <div style={{ width: "100%", height: 3, borderRadius: 2, background: "var(--neutral-alpha-weak)", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 2, background: "var(--sp-primary)", width: totalActivos > 0 ? "70%" : "0%", transition: "width 0.5s" }} />
            </div>
          </Column>
        </button>

        <button onClick={onVerTaller} style={{ flex: 1, background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}>
          <Column fillWidth gap="8" padding="12" border="neutral-alpha-weak" radius="m" background="surface">
            <Row fillWidth horizontal="between" vertical="center">
              <Text variant="label-default-xs" onBackground="neutral-weak">MIS TICKETS</Text>
              <Icon name="chevronRight" size="xs" onBackground="neutral-weak" />
            </Row>
            <Row gap="8" vertical="center">
              <Heading variant="display-strong-s" onBackground="neutral-strong">{misTicketsTotal}</Heading>
              <Text variant="label-default-xs" onBackground="neutral-weak">TOTAL</Text>
            </Row>
            <div style={{ width: "100%", height: 3, borderRadius: 2, background: "var(--neutral-alpha-weak)", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 2, background: "var(--neutral-alpha-strong)", width: "60%", transition: "width 0.5s" }} />
            </div>
          </Column>
        </button>
      </Row>

      <Column gap="0" border="neutral-alpha-weak" radius="m" overflow="hidden">
        <Row fillWidth horizontal="between" vertical="center" style={{ padding: "10px" }} background="surface" borderBottom="neutral-alpha-weak">
          <Text variant="label-strong-xs" onBackground="neutral-weak">ACTIVIDAD RECIENTE</Text>
          <button onClick={onVerTaller} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <Text variant="label-default-xs" onBackground="brand-medium">VER TODO</Text>
          </button>
        </Row>

        {recentTickets.length === 0 ? (
          <Column padding="24" horizontal="center" gap="8">
            <Icon name="checkCircle" size="m" onBackground="success-weak" />
            <Text variant="label-default-xs" onBackground="neutral-weak">Sin actividad reciente</Text>
          </Column>
        ) : (
          recentTickets.map((ticket, i) => (
            <Row key={ticket.id} fillWidth gap="12" style={{ padding: "10px" }} vertical="center" borderBottom={i < recentTickets.length - 1 ? "neutral-alpha-weak" : undefined}>
              <Column radius="s" background={ticket.estado === "finalizado" ? "neutral-alpha-weak" : "brand-alpha-weak"} horizontal="center" vertical="center" style={{ flexShrink: 0, width: 28, height: 28 }}>
                <Icon name={ticket.estado === "finalizado" ? "checkCircle" : "wrench"} size="xs" onBackground={ticket.estado === "finalizado" ? "neutral-weak" : "brand-medium"} />
              </Column>
              <Column flex={1} gap="2" style={{ minWidth: 0 }}>
                <Text variant="label-strong-xs" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ticket.matricula} — {ticket.titulo}
                </Text>
                <Text variant="label-default-xs" onBackground="neutral-weak">
                  {ticket.estado.toUpperCase().replace(/_/g, " ")}
                </Text>
              </Column>
              <EstadoChip estado={ticket.estado} />
            </Row>
          ))
        )}
      </Column>

      <button
        onClick={onNuevoTicket}
        style={{ position: "fixed", bottom: "72px", right: "16px", display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", borderRadius: "8px", background: "var(--sp-primary)", color: "var(--sp-on-primary)", border: "none", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", boxShadow: "0 4px 12px rgba(188,1,0,0.3)", zIndex: 9, cursor: "pointer" }}
      >
        <Icon name="plus" size="s" />
        NUEVA ORDEN
      </button>
    </Column>
  );
}
