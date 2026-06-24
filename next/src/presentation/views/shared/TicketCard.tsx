"use client";

import { Column, Row, Text, Icon } from "@once-ui-system/core";
import { EstadoChip } from "./EstadoChip";
import type { Ticket } from "@servicar/core";

export interface TicketCardProps {
  ticket: Ticket;
  isMine?: boolean;
  onEdit?: () => void;
  editLabel?: string;
  showAdminNote?: boolean;
  highlightActionNeeded?: boolean;
}

export function TicketCard({
  ticket,
  isMine = true,
  onEdit,
  editLabel,
  showAdminNote = true,
  highlightActionNeeded = true,
}: TicketCardProps) {
  const needsAction = ticket.estado === "requiere_cambios";
  const canEdit = onEdit && isMine && ticket.estado !== "finalizado";
  
  // Decide the border color based on status and configuration
  const borderColor = (highlightActionNeeded && needsAction)
    ? "warning-alpha-medium" 
    : "neutral-alpha-weak";

  // Default action label based on state
  const buttonLabel = editLabel ?? (needsAction ? "CORREGIR" : "EDITAR");

  return (
    <Column
      fillWidth
      gap="8"
      padding="12"
      border={borderColor}
      radius="m"
      background="surface"
    >
      <Row fillWidth horizontal="between" vertical="start" gap="8">
        <Column gap="2" style={{ minWidth: 0, flex: 1 }}>
          <Row gap="8" vertical="center" style={{ flexWrap: "wrap" }}>
            <span style={{
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "0.1em",
              padding: "1px 6px",
              borderRadius: 4,
              background: "var(--brand-alpha-weak)",
              color: "var(--brand-on-background-strong)",
              fontFamily: "monospace",
              flexShrink: 0,
            }}>
              {ticket.matricula}
            </span>
            {ticket.bahia && (
              <Row style={{ gap: 4 }} vertical="center">
                <Icon name="mapPin" size="xs" onBackground="neutral-weak" />
                <Text variant="label-default-xs" onBackground="neutral-weak">
                  {ticket.bahia}
                </Text>
              </Row>
            )}
          </Row>
          <Text variant="label-strong-s" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {ticket.titulo}
          </Text>
          <Text variant="body-default-xs" onBackground="neutral-weak" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {ticket.descripcion}
          </Text>
        </Column>
        <EstadoChip estado={ticket.estado} />
      </Row>

      {/* Admin Note (displayed if present, enabled, and the ticket requires changes or is blocked) */}
      {showAdminNote && ticket.notaAdmin && (
        <Row gap="8" padding="8" radius="s" background="warning-alpha-weak" border="warning-alpha-medium" vertical="start">
          <Icon name="warning" size="xs" onBackground="warning-medium" style={{ flexShrink: 0, marginTop: 2 }} />
          <Text variant="body-default-xs" onBackground="warning-strong">
            {ticket.notaAdmin}
          </Text>
        </Row>
      )}

      <Row fillWidth horizontal="between" vertical="center">
        <Row gap="4" vertical="center">
          <Icon name="clock" size="xs" onBackground="neutral-weak" />
          <Text variant="label-default-xs" onBackground="neutral-weak">
            {new Date(ticket.fechaUltimaModificacion).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </Row>
        
        {canEdit && (
          <button
            onClick={onEdit}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "5px 12px",
              borderRadius: 5,
              background: needsAction ? "#ffdad4" : "#bc010012",
              color: needsAction ? "#930100" : "var(--sp-primary)",
              border: "none",
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              cursor: "pointer",
            }}
          >
            <Icon name="pencil" size="xs" />
            {buttonLabel}
          </button>
        )}
        
        {!isMine && (
          <Text variant="label-default-xs" onBackground="neutral-weak">
            OTRO MECÁNICO
          </Text>
        )}
      </Row>
    </Column>
  );
}
