"use client";

import { Column, Row, Text, Heading, Icon } from "@once-ui-system/core";
import { EstadoChip } from "@/presentation/views/shared/EstadoChip";
import type { FichasVM, FichaTab } from "@/presentation/view-models/mecanico/useFichasViewModel";
import type { Ticket } from "@servicar/core";

const TABS: { value: FichaTab; label: string }[] = [
  { value: "requiere_cambios",   label: "Corregir"    },
  { value: "pendiente_revision", label: "En Revisión" },
];

export function FichasView({ tab, setTab, shown, corregirCount, enRevisionCount, onEditarTicket }: FichasVM) {
  const counts: Record<FichaTab, number> = {
    requiere_cambios:   corregirCount,
    pendiente_revision: enRevisionCount,
  };

  return (
    <Column fillWidth gap="16">
      <Heading variant="heading-strong-m">Mis Fichas</Heading>

      <Row fillWidth gap="0" border="neutral-alpha-weak" radius="m" overflow="hidden">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", border: "none", borderBottom: `2px solid ${tab === t.value ? "var(--sp-primary)" : "transparent"}`, background: tab === t.value ? "#bc010010" : "var(--sp-surface-container-low)", color: tab === t.value ? "var(--sp-primary)" : "var(--sp-on-surface-variant)", cursor: "pointer", fontSize: "11px", fontWeight: tab === t.value ? 700 : 500, textTransform: "uppercase", letterSpacing: "0.05em", transition: "all 0.1s" }}
          >
            {t.label}
            {counts[t.value] > 0 && (
              <span style={{ background: tab === t.value ? "var(--sp-primary)" : "var(--sp-surface-container-highest)", color: tab === t.value ? "white" : "var(--sp-on-surface-variant)", borderRadius: 4, padding: "0 5px", fontSize: "9px", fontWeight: 800, minWidth: 16, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                {counts[t.value]}
              </span>
            )}
          </button>
        ))}
      </Row>

      <Column gap="8" fillWidth>
        {shown.length === 0 ? (
          <Column padding="40" horizontal="center" gap="8">
            <Icon name="checkCircle" size="m" onBackground="success-weak" />
            <Text variant="label-default-xs" onBackground="neutral-weak">
              {tab === "requiere_cambios" ? "Sin correcciones pendientes" : "Nada en revisión"}
            </Text>
          </Column>
        ) : (
          shown.map((ticket) => <FichaCard key={ticket.id} ticket={ticket} onEditar={() => onEditarTicket(ticket.id)} />)
        )}
      </Column>
    </Column>
  );
}

function FichaCard({ ticket, onEditar }: { ticket: Ticket; onEditar: () => void }) {
  const needsAction = ticket.estado === "requiere_cambios";
  return (
    <Column fillWidth gap="8" padding="12" border={needsAction ? "warning-alpha-medium" : "neutral-alpha-weak"} radius="m" background="surface">
      <Row fillWidth horizontal="between" vertical="center" gap="8">
        <Row gap="8" vertical="center" style={{ minWidth: 0, flex: 1 }}>
          <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", padding: "1px 6px", borderRadius: 4, background: "var(--brand-alpha-weak)", color: "var(--brand-on-background-strong)", fontFamily: "monospace", flexShrink: 0 }}>
            {ticket.matricula}
          </span>
          <Text variant="label-strong-s" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {ticket.titulo}
          </Text>
        </Row>
        <EstadoChip estado={ticket.estado} />
      </Row>

      {ticket.notaAdmin && (
        <Row gap="8" padding="8" radius="s" background="warning-alpha-weak" border="warning-alpha-medium" vertical="start">
          <Icon name="warning" size="xs" onBackground="warning-medium" style={{ flexShrink: 0, marginTop: 2 }} />
          <Text variant="body-default-xs" onBackground="warning-strong">{ticket.notaAdmin}</Text>
        </Row>
      )}

      <Text variant="body-default-xs" onBackground="neutral-weak">{ticket.descripcion}</Text>

      <Row fillWidth horizontal="between" vertical="center">
        <Row gap="4" vertical="center">
          <Icon name="clock" size="xs" onBackground="neutral-weak" />
          <Text variant="label-default-xs" onBackground="neutral-weak">
            {new Date(ticket.fechaUltimaModificacion).toLocaleDateString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
          </Text>
        </Row>
        {needsAction && (
          <button
            onClick={onEditar}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 5, background: "#ffdad4", color: "#930100", border: "none", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer" }}
          >
            <Icon name="pencil" size="xs" />
            CORREGIR
          </button>
        )}
      </Row>
    </Column>
  );
}
