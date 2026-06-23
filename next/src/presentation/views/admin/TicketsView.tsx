"use client";

import { Column, Row, Text, Heading, Icon } from "@once-ui-system/core";
import type { TicketsVM } from "@/presentation/view-models/admin/useTickets.view-model";
import { KanbanColumn } from "./components/KanbanComponents";

export function TicketsView(props: TicketsVM) {
  const { activos, bloqueados, finalizados, categorias, empleadoMap, busqueda, filtroCat,
          setBusqueda, setFiltroCat, limpiarFiltros, onAction, onVerHistorial } = props;

  return (
    <Column fillWidth gap="0">
      <style>{`
        .kanban-grid   { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .tickets-h2    { font-size:32px; }
        @media(max-width:900px){ .kanban-grid{ grid-template-columns:1fr; } }
        @media(max-width:600px){ .tickets-h2{ font-size:22px; } }
      `}</style>

      <Row gap="8" vertical="center" paddingBottom="8">
        <Text variant="label-default-xs" onBackground="neutral-weak">Taller</Text>
        <Icon name="chevronRight" size="xs" onBackground="neutral-weak" />
        <Text variant="label-default-xs" onBackground="brand-medium" style={{ fontWeight: 700 }}>Panel de Tickets</Text>
      </Row>

      <Row fillWidth horizontal="between" vertical="end" style={{ flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
        <Column gap="8">
          <Heading variant="heading-strong-l" className="tickets-h2" style={{ letterSpacing: "-0.01em" }}>
            Resumen Operacional
          </Heading>
          <Row gap="8" vertical="center" style={{ display: "inline-flex", padding: "3px 12px", background: "#bc010010", borderRadius: 20, border: "1px solid #bc010030" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--brand-background-strong)", flexShrink: 0 }} />
            <Text variant="label-default-xs" onBackground="brand-medium" style={{ fontWeight: 600 }}>
              En vivo: {activos.length + bloqueados.length + finalizados.length} tickets
            </Text>
          </Row>
        </Column>
      </Row>

      <Row gap="8" paddingBottom="20" style={{ flexWrap: "wrap", alignItems: "center" }}>
        <Row gap="8" vertical="center" background="surface" border="neutral-alpha-weak" radius="s" paddingX="12" paddingY="8">
          <Text variant="label-default-xs" onBackground="neutral-weak">Buscar:</Text>
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Matrícula o título…"
            style={{ background: "transparent", border: "none", outline: "none", fontSize: 12, fontWeight: 700, color: "var(--neutral-on-background-strong)", fontFamily: "inherit", width: 180 }}
          />
        </Row>
        <Row gap="8" vertical="center" background="surface" border="neutral-alpha-weak" radius="s" paddingX="12" paddingY="8">
          <Text variant="label-default-xs" onBackground="neutral-weak">Categoría:</Text>
          <select
            value={filtroCat}
            onChange={(e) => setFiltroCat(e.target.value)}
            style={{ background: "transparent", border: "none", outline: "none", fontSize: 12, fontWeight: 700, color: "var(--neutral-on-background-strong)", fontFamily: "inherit", cursor: "pointer" }}
          >
            <option value="">Todas</option>
            {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Row>
        {(busqueda || filtroCat) && (
          <button
            onClick={limpiarFiltros}
            style={{ fontSize: 12, color: "var(--brand-on-background-medium)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}
          >
            Limpiar filtros
          </button>
        )}
      </Row>

      <Row gap="8" vertical="center" radius="m" paddingX="16" paddingY="12" style={{ background: "#bc010006", border: "1px solid #bc010018", marginBottom: 24 }}>
        <Icon name="shield" size="s" onBackground="brand-medium" />
        <Text variant="label-default-xs" style={{ color: "#930100", fontWeight: 600 }}>
          Sistema encriptado. Todas las operaciones del taller se registran en tiempo real para auditoría y control de calidad.
        </Text>
      </Row>

      <div className="kanban-grid">
        <KanbanColumn
          title="Activos"      color="var(--brand-background-strong)"          countLabel={String(activos.length)}
          badgeBg="var(--neutral-background-weak)" badgeColor="var(--neutral-on-background-weak)"
          tickets={activos} empleadoMap={empleadoMap} onAction={onAction} onVerHistorial={onVerHistorial} variant="active"
        />
        <KanbanColumn
          title="Bloqueados"   color="var(--danger-background-strong)"         countLabel={String(bloqueados.length)}
          badgeBg="#ffdad6" badgeColor="#93000a"
          tickets={bloqueados} empleadoMap={empleadoMap} onAction={onAction} onVerHistorial={onVerHistorial} variant="blocked"
        />
        <KanbanColumn
          title="Finalizados"  color="var(--neutral-on-background-weak)"       countLabel={`${finalizados.length} hoy`}
          badgeBg="var(--neutral-background-strong)" badgeColor="var(--neutral-on-background-weak)"
          tickets={finalizados} empleadoMap={empleadoMap} onAction={onAction} onVerHistorial={onVerHistorial} variant="finished"
        />
      </div>
    </Column>
  );
}
