"use client";

import { Column, Row, Text, Heading, Icon, Tag, Avatar } from "@once-ui-system/core";
import type { Ticket, HistorialEntry } from "@servicar/core";
import type { Empleado } from "@servicar/core";
import type { TicketEstado } from "@servicar/core";
import type { HistorialVM, HistorialTab } from "@/presentation/view-models/admin/useHistorialViewModel";

const ESTADO_CFG: Record<TicketEstado, { label: string; variant: "neutral" | "brand" | "warning" | "danger" | "success" | "info" }> = {
  pendiente_revision: { label: "En Revisión", variant: "neutral"  },
  requiere_cambios:   { label: "Corregir",    variant: "warning"  },
  aprobado:           { label: "Aprobado",    variant: "success"  },
  en_progreso:        { label: "Brand",       variant: "brand"    },
  bloqueado:          { label: "Bloqueado",   variant: "danger"   },
  urgente:            { label: "Urgente",     variant: "danger"   },
  finalizado:         { label: "Finalizado",  variant: "neutral"  },
};

export function HistorialView({ ticket, historial, empleadoMap, creador, tab, setTab, onBack, onEditar, onFinalizar }: HistorialVM) {
  if (!ticket) {
    return (
      <Column fillWidth horizontal="center" vertical="center" style={{ height: "60vh" }}>
        <Text variant="body-default-s" onBackground="neutral-weak">Cargando ticket…</Text>
      </Column>
    );
  }

  const estadoCfg = ESTADO_CFG[ticket.estado] ?? { label: ticket.estado, variant: "neutral" as const };
  const elapsed = () => {
    const mins = Math.round((Date.now() - ticket.creationTime) / 60000);
    if (mins < 60) return `${mins} min`;
    const hrs = Math.round(mins / 60);
    return hrs < 24 ? `${hrs}h ${mins % 60}m` : `${Math.round(hrs / 24)} días, ${Math.round(hrs % 24)}h`;
  };

  return (
    <Column fillWidth gap="0">
      <style>{`
        .historial-main  { display:grid; grid-template-columns:1fr 320px; gap:20px; align-items:start; }
        .historial-info  { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; padding-top:20px; border-top:1px solid var(--neutral-alpha-weak); }
        .historial-title { font-size:26px; }
        @media(max-width:768px){
          .historial-main  { grid-template-columns:1fr; }
          .historial-info  { grid-template-columns:1fr; gap:12px; }
          .historial-title { font-size:20px; }
        }
      `}</style>

      <button
        onClick={onBack}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16, padding: "6px 14px", borderRadius: 8, border: "1px solid var(--neutral-alpha-medium)", background: "transparent", color: "var(--neutral-on-background-weak)", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}
      >
        <Icon name="arrowLeft" size="xs" /> Volver
      </button>

      <Row gap="8" vertical="center" radius="m" paddingX="16" paddingY="12" style={{ background: "#bc010008", border: "1px solid #bc010020", marginBottom: 20 }}>
        <Icon name="shield" size="s" onBackground="brand-medium" />
        <Text variant="label-default-xs" style={{ color: "#930100", fontWeight: 600 }}>
          Este ticket está encriptado y solo es accesible por personal autorizado del taller.
        </Text>
      </Row>

      <div className="historial-main">
        <Column gap="20">
          <Column border="neutral-alpha-weak" radius="m" padding="24" gap="20">
            <div className="historial-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
              <Column gap="8">
                <Row gap="8" vertical="center">
                  <Tag variant="brand" label={`TKT-${ticket.id.slice(-6).toUpperCase()}`} size="s" />
                  {ticket.estado === "urgente" && (
                    <Tag variant="danger" label="Alta Prioridad" prefixIcon="warning" size="s" />
                  )}
                </Row>
                <Heading variant="heading-strong-l" className="historial-title" style={{ letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                  {ticket.titulo}
                </Heading>
                <Text variant="body-default-s" onBackground="neutral-weak" style={{ maxWidth: 480, lineHeight: 1.5 }}>
                  {ticket.descripcion}
                </Text>
              </Column>
              <Column gap="8" horizontal="end">
                <Text variant="label-default-xs" onBackground="neutral-weak" style={{ textTransform: "uppercase", letterSpacing: "0.07em" }}>Estado</Text>
                <Tag variant={estadoCfg.variant} label={estadoCfg.label} size="m" />
              </Column>
            </div>

            <div className="historial-info">
              <Column gap="8">
                <Text variant="label-default-xs" onBackground="neutral-weak" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Matrícula</Text>
                <Row horizontal="center" padding="8" background="surface" border="neutral-alpha-weak" radius="s" style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 800, letterSpacing: "0.08em" }}>
                  {ticket.matricula}
                </Row>
              </Column>
              <Column gap="8">
                <Text variant="label-default-xs" onBackground="neutral-weak" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Categoría</Text>
                <Text variant="label-strong-s">{ticket.categoria}</Text>
                {ticket.bahia && <Text variant="label-default-xs" onBackground="neutral-weak">Bahía {ticket.bahia}</Text>}
              </Column>
              <Column gap="8">
                <Text variant="label-default-xs" onBackground="neutral-weak" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Técnico</Text>
                <Row gap="8" vertical="center">
                  <Avatar value={creador?.nombre ?? "?"} size="xs" />
                  <Text variant="label-strong-s">{creador?.nombre ?? "—"}</Text>
                </Row>
              </Column>
            </div>
          </Column>

          {ticket.notaAdmin && (
            <Row gap="8" vertical="start" radius="m" padding="12" style={{ background: "#ffdad620", border: "1px solid #ffdad6" }}>
              <Icon name="warning" size="s" style={{ color: "#93000a", flexShrink: 0, marginTop: 2 }} />
              <Column gap="4">
                <Text variant="label-default-xs" style={{ color: "#93000a", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>NOTA ADMIN</Text>
                <Text variant="body-default-s" style={{ color: "#93000a" }}>{ticket.notaAdmin}</Text>
              </Column>
            </Row>
          )}

          <Column gap="0">
            <Row gap="32" borderBottom="neutral-alpha-weak" paddingX="4" style={{ marginBottom: 0 }}>
              {(["detalles", "historial"] as HistorialTab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{ padding: "0 0 14px", background: "none", border: "none", borderBottom: `2px solid ${tab === t ? "var(--brand-background-strong)" : "transparent"}`, color: tab === t ? "var(--brand-on-background-strong)" : "var(--neutral-on-background-weak)", fontSize: 12, fontWeight: tab === t ? 700 : 500, cursor: "pointer", fontFamily: "inherit", marginBottom: -1 }}
                >
                  {t === "detalles" ? "Detalles Generales" : `Historial (${historial.length})`}
                </button>
              ))}
            </Row>

            {tab === "detalles" ? (
              <Column border="neutral-alpha-weak" radius="m" padding="24" gap="16" style={{ marginTop: 16 }}>
                <Heading variant="heading-strong-s">Descripción del Problema</Heading>
                <Text variant="body-default-s" onBackground="neutral-weak" style={{ lineHeight: 1.65 }}>
                  {ticket.descripcion}
                </Text>
              </Column>
            ) : (
              <Column style={{ marginTop: 16 }}>
                {historial.length === 0 ? (
                  <Column padding="40" horizontal="center" border="neutral-alpha-weak" radius="m">
                    <Text variant="body-default-s" onBackground="neutral-weak">Sin eventos registrados</Text>
                  </Column>
                ) : (
                  <Column border="neutral-alpha-weak" radius="m" padding="24" gap="0">
                    <Row fillWidth horizontal="between" vertical="center" paddingBottom="24">
                      <Heading variant="heading-strong-s">Línea de Tiempo del Ticket</Heading>
                      <Text variant="label-default-xs" onBackground="neutral-weak">{historial.length} evento{historial.length !== 1 ? "s" : ""}</Text>
                    </Row>
                    <AuditTimeline entries={historial} empleadoMap={empleadoMap} />
                  </Column>
                )}
              </Column>
            )}
          </Column>
        </Column>

        <Column gap="16">
          <Column border="neutral-alpha-weak" radius="m" padding="24" gap="16">
            <Text variant="label-default-xs" onBackground="neutral-weak" style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Información de Gestión
            </Text>
            <Column gap="8">
              <InfoRow icon="calendar" label="Creado el" value={new Date(ticket.creationTime).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })} />
              <InfoRow icon="clock"    label="Tiempo Transcurrido" value={elapsed()} />
            </Column>
            <Column gap="8">
              <Text variant="label-default-xs" onBackground="neutral-weak" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Técnico Asignado</Text>
              <Row gap="8" vertical="center" border="neutral-alpha-weak" radius="m" padding="8">
                <Avatar value={creador?.nombre ?? "?"} size="s" />
                <Column gap="2">
                  <Text variant="label-strong-s">{creador?.nombre ?? "—"}</Text>
                  <Text variant="label-default-xs" onBackground="neutral-weak">
                    {creador?.rol === "admin" ? "Administrador" : "Mecánico"}
                  </Text>
                </Column>
              </Row>
            </Column>
          </Column>

          <Column gap="8">
            <button
              onClick={onEditar}
              style={{ width: "100%", padding: "14px 0", background: "var(--neutral-background-strong)", color: "var(--brand-on-background-strong)", fontWeight: 700, fontSize: 13, borderRadius: 12, border: "none", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              <Icon name="pencil" size="s" /> Editar Ticket
            </button>
            <button
              onClick={onFinalizar}
              disabled={ticket.estado === "finalizado"}
              style={{ width: "100%", padding: "14px 0", background: ticket.estado === "finalizado" ? "var(--neutral-background-weak)" : "#eddfe2", color: ticket.estado === "finalizado" ? "var(--neutral-on-background-weak)" : "#4e4447", fontWeight: 700, fontSize: 13, borderRadius: 12, border: "none", cursor: ticket.estado === "finalizado" ? "default" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: ticket.estado === "finalizado" ? 0.5 : 1 }}
            >
              <Icon name="checkCircle" size="s" /> {ticket.estado === "finalizado" ? "Finalizado" : "Marcar Finalizado"}
            </button>
          </Column>
        </Column>
      </div>
    </Column>
  );
}

function AuditTimeline({ entries, empleadoMap }: {
  entries: HistorialEntry[];
  empleadoMap: Record<string, Pick<Empleado, "nombre" | "rol">>;
}) {
  return (
    <Column style={{ position: "relative" }}>
      <div style={{ position: "absolute", left: 19, top: 20, bottom: 20, width: 1, background: "var(--neutral-alpha-weak)" }} />
      {entries.map((entry) => {
        const autor = empleadoMap[entry.empleadoId];
        let detalles: Record<string, unknown> = {};
        try { detalles = entry.detallesCambio ? JSON.parse(entry.detallesCambio) : {}; } catch {}

        const iconName =
          entry.tipoAccion === "CREACION"      ? "plus"    :
          entry.tipoAccion === "CAMBIO_ESTADO" ? "refresh" : "pencil";

        return (
          <Row key={entry.id} gap="12" paddingY="8" style={{ position: "relative", zIndex: 1 }}>
            <Column
              horizontal="center"
              vertical="center"
              background="surface"
              border="neutral-alpha-weak"
              radius="full"
              style={{ width: 40, height: 40, flexShrink: 0 }}
            >
              <Icon name={iconName} size="xs" onBackground="neutral-weak" />
            </Column>
            <Column
              flex={1}
              padding="12"
              radius="m"
              background="neutral-alpha-weak"
              border="neutral-alpha-weak"
              gap="8"
            >
              <Row fillWidth horizontal="between" vertical="center" style={{ flexWrap: "wrap", gap: 6 }}>
                <Text variant="label-strong-s">{autor?.nombre ?? "Sistema"}</Text>
                <time style={{ fontSize: 11, color: "var(--neutral-on-background-weak)" }}>
                  {new Date(entry.creationTime).toLocaleDateString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </time>
              </Row>
              <Text variant="label-default-xs" onBackground="neutral-weak">
                {entry.tipoAccion === "CREACION" && "Ticket creado"}
                {entry.tipoAccion === "CAMBIO_ESTADO" && Boolean(detalles.estado_nuevo) && (
                  <>{Boolean(detalles.estado_anterior) && <strong>{String(detalles.estado_anterior).replace(/_/g, " ")}</strong>}{Boolean(detalles.estado_anterior) && " → "}<strong>{String(detalles.estado_nuevo).replace(/_/g, " ")}</strong></>
                )}
                {entry.tipoAccion === "EDICION_TEXTO" && <>Editó el ticket: {Object.keys(detalles).filter((k) => k !== "_id").join(", ") || "—"}</>}
              </Text>
              {Boolean(detalles.nota) && (
                <Text variant="label-default-xs" onBackground="neutral-weak" style={{ fontStyle: "italic" }}>
                  &quot;{String(detalles.nota)}&quot;
                </Text>
              )}
            </Column>
          </Row>
        );
      })}
    </Column>
  );
}

function InfoRow({ icon, label, value }: { icon: "calendar" | "clock"; label: string; value: string }) {
  return (
    <Row gap="12" vertical="center" padding="8" background="surface" radius="s">
      <Icon name={icon} size="s" onBackground="brand-medium" />
      <Column gap="2">
        <Text variant="label-default-xs" onBackground="neutral-weak" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</Text>
        <Text variant="label-strong-s">{value}</Text>
      </Column>
    </Row>
  );
}
