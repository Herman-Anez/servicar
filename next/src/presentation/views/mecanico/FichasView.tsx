"use client";

import { Column, Row, Text, Icon } from "@once-ui-system/core";
import { TicketCard, ViewHeader } from "@/presentation/views/shared";
import type { FichasVM, FichaTab } from "@/presentation/view-models/mecanico/useFichas.view-model";

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
      <ViewHeader title="Mis Fichas" />

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
          shown.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              isMine={true}
              onEdit={() => onEditarTicket(ticket.id)}
              editLabel="CORREGIR"
            />
          ))
        )}
      </Column>
    </Column>
  );
}
