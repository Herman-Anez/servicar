"use client";

import { Column, Row, Text, Heading, Icon, Avatar } from "@once-ui-system/core";
import type { Empleado, HistorialEntry } from "@servicar/core";

interface AuditTimelineProps {
  entries: HistorialEntry[];
  empleadoMap: Record<string, Pick<Empleado, "nombre" | "rol">>;
}

export function AuditTimeline({ entries, empleadoMap }: AuditTimelineProps) {
  return (
    <Column style={{ position: "relative" }}>
      <div style={{ position: "absolute", left: 19, top: 20, bottom: 20, width: 1, background: "var(--neutral-alpha-weak)" }} />
      {entries.map((entry) => {
        const autor = empleadoMap[entry.empleadoId];
        let detalles: Record<string, any> = {};
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

interface InfoRowProps {
  icon: "calendar" | "clock";
  label: string;
  value: string;
}

export function InfoRow({ icon, label, value }: InfoRowProps) {
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
