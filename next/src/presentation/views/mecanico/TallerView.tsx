"use client";

import { Column, Row, Text, Input, Icon } from "@once-ui-system/core";
import { TicketCard, ViewHeader, FabButton } from "@/presentation/views/shared";
import type { TallerVM } from "@/presentation/view-models/mecanico/useTaller.view-model";
import { FILTROS } from "@/presentation/view-models/mecanico/useTaller.view-model";

export function TallerView({ empleado, filtrados, busqueda, filtro, setBusqueda, setFiltro, onNuevoTicket, onEditarTicket }: TallerVM) {
  return (
    <Column fillWidth gap="16">
      <ViewHeader
        title="Taller"
        rightElement={
          <Text variant="label-default-xs" onBackground="neutral-weak">
            {filtrados.length} ORDEN{filtrados.length !== 1 ? "ES" : ""}
          </Text>
        }
      />

      <Input
        id="busqueda-taller"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por matrícula o título…"
      />

      <Row style={{ gap: 6, overflowX: "auto", paddingBottom: 4, flexShrink: 0 }}>
        {FILTROS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFiltro(f.value)}
            style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${filtro === f.value ? "var(--sp-primary)" : "var(--sp-outline-variant)"}`, background: filtro === f.value ? "#bc010015" : "transparent", color: filtro === f.value ? "var(--sp-primary)" : "var(--sp-on-surface-variant)", cursor: "pointer", fontSize: "10px", fontWeight: filtro === f.value ? 700 : 500, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap", flexShrink: 0 }}
          >
            {f.label}
          </button>
        ))}
      </Row>

      <Column gap="8" fillWidth>
        {filtrados.length === 0 ? (
          <Column padding="40" horizontal="center" gap="8">
            <Icon name="search" size="m" onBackground="neutral-weak" />
            <Text variant="label-default-xs" onBackground="neutral-weak">Sin resultados</Text>
          </Column>
        ) : (
          filtrados.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              isMine={ticket.creadorId === empleado?.id}
              onEdit={() => onEditarTicket(ticket.id)}
            />
          ))
        )}
      </Column>

      <FabButton onClick={onNuevoTicket} label="NUEVO" />
    </Column>
  );
}
