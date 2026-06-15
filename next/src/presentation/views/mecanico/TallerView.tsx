"use client";

import { Column, Row, Text, Heading, Icon, Input } from "@once-ui-system/core";
import { EstadoChip } from "@/presentation/views/shared/EstadoChip";
import type { TallerVM, FilterEstado, FILTROS as FiltrosType } from "@/presentation/view-models/mecanico/useTallerViewModel";
import { FILTROS } from "@/presentation/view-models/mecanico/useTallerViewModel";
import type { Ticket } from "@servicar/core";

export function TallerView({ empleado, filtrados, busqueda, filtro, setBusqueda, setFiltro, onNuevoTicket, onEditarTicket }: TallerVM) {
  return (
    <Column fillWidth gap="16">
      <Row fillWidth horizontal="between" vertical="center">
        <Heading variant="heading-strong-m">Taller</Heading>
        <Text variant="label-default-xs" onBackground="neutral-weak">
          {filtrados.length} ORDEN{filtrados.length !== 1 ? "ES" : ""}
        </Text>
      </Row>

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
              onEditar={() => onEditarTicket(ticket.id)}
            />
          ))
        )}
      </Column>

      <button
        onClick={onNuevoTicket}
        style={{ position: "fixed", bottom: "72px", right: "16px", display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", borderRadius: "8px", background: "var(--sp-primary)", color: "var(--sp-on-primary)", border: "none", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", boxShadow: "0 4px 12px rgba(188,1,0,0.3)", zIndex: 9, cursor: "pointer" }}
      >
        <Icon name="plus" size="s" />
        NUEVA
      </button>
    </Column>
  );
}

function TicketCard({ ticket, isMine, onEditar }: { ticket: Ticket; isMine: boolean; onEditar: () => void }) {
  const canEdit = isMine && ticket.estado !== "finalizado";
  return (
    <Column fillWidth gap="8" padding="12" border="neutral-alpha-weak" radius="m" background="surface">
      <Row fillWidth horizontal="between" vertical="start" gap="8">
        <Column gap="2" style={{ minWidth: 0, flex: 1 }}>
          <Row gap="8" vertical="center" style={{ flexWrap: "wrap" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", padding: "1px 6px", borderRadius: 4, background: "#bc010012", color: "var(--sp-primary)", fontFamily: "monospace" }}>
              {ticket.matricula}
            </span>
            {ticket.bahia && (
              <Row style={{ gap: 4 }} vertical="center">
                <Icon name="mapPin" size="xs" onBackground="neutral-weak" />
                <Text variant="label-default-xs" onBackground="neutral-weak">{ticket.bahia}</Text>
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

      <Row fillWidth horizontal="between" vertical="center">
        <Row gap="4" vertical="center">
          <Icon name="clock" size="xs" onBackground="neutral-weak" />
          <Text variant="label-default-xs" onBackground="neutral-weak">
            {new Date(ticket.fechaUltimaModificacion).toLocaleDateString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
          </Text>
        </Row>
        {canEdit && (
          <button
            onClick={onEditar}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 5, background: "#bc010012", color: "var(--sp-primary)", border: "none", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer" }}
          >
            <Icon name="pencil" size="xs" />
            EDITAR
          </button>
        )}
        {!isMine && (
          <Text variant="label-default-xs" onBackground="neutral-weak">OTRO MECÁNICO</Text>
        )}
      </Row>
    </Column>
  );
}
