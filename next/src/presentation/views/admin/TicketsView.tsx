"use client";

import { Column, Row, Text, Heading, Icon, Tag, Avatar } from "@once-ui-system/core";
import type { Ticket } from "@servicar/core";
import type { Empleado } from "@servicar/core";
import type { TicketEstado } from "@servicar/core";
import type { TicketsVM } from "@/presentation/view-models/admin/useTicketsViewModel";

const ESTADO_ACTIONS: Partial<Record<TicketEstado, { label: string; next: TicketEstado }[]>> = {
  aprobado:    [{ label: "Iniciar",   next: "en_progreso" }],
  en_progreso: [{ label: "Urgente",   next: "urgente" }, { label: "Bloquear", next: "bloqueado" }, { label: "Finalizar", next: "finalizado" }],
  urgente:     [{ label: "Normal",    next: "en_progreso" }, { label: "Finalizar", next: "finalizado" }],
  bloqueado:   [{ label: "Reactivar", next: "en_progreso" }],
};

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

function KanbanColumn({ title, color, countLabel, badgeBg, badgeColor, tickets, empleadoMap, onAction, onVerHistorial, variant }: {
  title: string; color: string; countLabel: string; badgeBg: string; badgeColor: string;
  tickets: Ticket[]; empleadoMap: Record<string, Empleado>;
  onAction: (id: string, next: TicketEstado) => void;
  onVerHistorial: (id: string) => void;
  variant: "active" | "blocked" | "finished";
}) {
  return (
    <Column gap="12">
      <Row horizontal="between" vertical="center" paddingX="4">
        <Row gap="8" vertical="center">
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: color, flexShrink: 0 }} />
          <Heading variant="heading-strong-s">{title}</Heading>
          <span style={{ background: badgeBg, color: badgeColor, fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 20 }}>{countLabel}</span>
        </Row>
      </Row>
      <Column
        gap="12"
        padding="8"
        radius="m"
        background="neutral-alpha-weak"
        style={{ minHeight: 200 }}
      >
        {tickets.length === 0 ? (
          <Column padding="32" horizontal="center">
            <Text variant="label-default-xs" onBackground="neutral-weak">Sin tickets</Text>
          </Column>
        ) : (
          tickets.map((t) => (
            <KanbanCard
              key={t.id}
              ticket={t}
              creador={empleadoMap[t.creadorId]}
              variant={variant}
              onAction={onAction}
              onVerHistorial={onVerHistorial}
            />
          ))
        )}
      </Column>
    </Column>
  );
}

function KanbanCard({ ticket, creador, variant, onAction, onVerHistorial }: {
  ticket: Ticket; creador?: Empleado;
  variant: "active" | "blocked" | "finished";
  onAction: (id: string, next: TicketEstado) => void;
  onVerHistorial: (id: string) => void;
}) {
  const actions = ESTADO_ACTIONS[ticket.estado] ?? [];
  const elapsed = () => {
    const mins = Math.round((Date.now() - ticket.creationTime) / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.round(mins / 60);
    return hrs < 24 ? `${hrs}h ${mins % 60}m` : `${Math.round(hrs / 24)}d`;
  };

  const idColor   = variant === "blocked" ? "var(--danger-on-background-strong)" : variant === "finished" ? "var(--neutral-on-background-weak)" : "var(--brand-on-background-strong)";
  const catBg     = ticket.estado === "urgente" ? "#ffdad633" : ticket.estado === "finalizado" ? "#eddfe2" : "var(--neutral-background-weak)";
  const catColor  = ticket.estado === "urgente" ? "var(--danger-on-background-strong)" : ticket.estado === "finalizado" ? "#4e4447" : "var(--neutral-on-background-weak)";
  const borderLeft = variant === "blocked" ? "4px solid var(--danger-background-strong)" : "1px solid var(--neutral-alpha-medium)";

  return (
    <Column
      background="page"
      radius="m"
      padding="16"
      gap="0"
      border="neutral-alpha-weak"
      onClick={() => onVerHistorial(ticket.id)}
      style={{ cursor: "pointer", opacity: variant === "finished" ? 0.8 : 1, borderLeft, boxShadow: "0 4px 20px rgba(15,82,186,0.05)" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = variant === "blocked" ? "var(--danger-background-strong)" : "var(--brand-background-strong)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--neutral-alpha-medium)"; }}
    >
      <Row fillWidth horizontal="between" vertical="start" paddingBottom="8">
        <Text variant="label-strong-xs" style={{ color: idColor }}>#TK-{ticket.id.slice(-4).toUpperCase()}</Text>
        <span style={{ padding: "2px 6px", background: catBg, color: catColor, fontSize: 9, fontWeight: 800, borderRadius: 4, textTransform: "uppercase" }}>{ticket.categoria}</span>
      </Row>
      <Text variant="label-strong-s" style={{ marginBottom: 4, lineHeight: 1.3 }}>{ticket.titulo}</Text>
      <Text variant="label-default-xs" onBackground="neutral-weak" paddingBottom="12">
        Matrícula: <strong>{ticket.matricula}</strong>
      </Text>

      {variant === "blocked" && ticket.notaAdmin && (
        <Row gap="8" vertical="center" radius="s" paddingX="8" paddingY="8" style={{ background: "#ffdad633", marginBottom: 12 }}>
          <Icon name="warning" size="xs" style={{ color: "#93000a", flexShrink: 0 }} />
          <Text variant="label-default-xs" style={{ color: "#93000a" }}>{ticket.notaAdmin}</Text>
        </Row>
      )}

      <Row fillWidth horizontal="between" vertical="center" paddingTop="12" borderTop="neutral-alpha-weak">
        <Row gap="8" vertical="center">
          <Avatar value={creador?.nombre ?? "?"} size="xs" />
          <Text variant="label-default-xs" onBackground="neutral-weak">{creador?.nombre.split(" ")[0] ?? "—"}</Text>
        </Row>
        {variant !== "finished" && actions.length > 0 ? (
          <Row gap="4" onClick={(e) => e.stopPropagation()}>
            {actions.map((a) => (
              <button
                key={a.next}
                onClick={() => onAction(ticket.id, a.next)}
                style={{ padding: "3px 8px", borderRadius: 6, background: "var(--neutral-background-medium)", border: "none", cursor: "pointer", fontSize: 9, fontWeight: 800, fontFamily: "inherit", color: "var(--neutral-on-background-weak)", textTransform: "uppercase" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--neutral-background-strong)"; e.currentTarget.style.color = "var(--neutral-on-background-strong)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--neutral-background-medium)"; e.currentTarget.style.color = "var(--neutral-on-background-weak)"; }}
              >
                {a.label}
              </button>
            ))}
          </Row>
        ) : (
          <Row gap="4" vertical="center" style={{ color: variant === "finished" ? "#63595c" : "var(--neutral-on-background-weak)" }}>
            <Icon name="clock" size="xs" />
            <Text variant="label-default-xs">{elapsed()}</Text>
          </Row>
        )}
      </Row>
    </Column>
  );
}
