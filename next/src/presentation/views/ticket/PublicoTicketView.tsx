"use client";

import { Column, Row, Text, Icon, Spinner, Tag } from "@once-ui-system/core";
import type { PublicoTicketVM } from "@/presentation/view-models/ticket/usePublicoTicket.view-model";

type TagVariant = "neutral" | "brand" | "warning" | "danger" | "success" | "info";

const ESTADO_CFG: Record<string, { label: string; variant: TagVariant }> = {
  pendiente_revision: { label: "Pendiente de revisión", variant: "warning" },
  requiere_cambios:   { label: "Requiere cambios",      variant: "danger"  },
  aprobado:           { label: "Aprobado",              variant: "success" },
  en_progreso:        { label: "En progreso",           variant: "brand"   },
  urgente:            { label: "Urgente",               variant: "danger"  },
  bloqueado:          { label: "Bloqueado",             variant: "danger"  },
  finalizado:         { label: "Finalizado",            variant: "neutral" },
};

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString("es-ES", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function PublicoTicketView({ ticket, loading, notFound }: PublicoTicketVM) {
  if (loading) {
    return (
      <Column fillWidth flex={1} horizontal="center" vertical="center" gap="12" padding="40" style={{ minHeight: "100vh" }}>
        <Spinner />
        <Text variant="label-default-xs" onBackground="neutral-weak">Buscando ticket…</Text>
      </Column>
    );
  }

  if (notFound || !ticket) {
    return (
      <Column fillWidth flex={1} horizontal="center" vertical="center" gap="16" padding="40" style={{ minHeight: "100vh" }}>
        <Icon name="search" size="l" onBackground="neutral-weak" />
        <Text variant="heading-strong-s" onBackground="neutral-strong">Ticket no encontrado</Text>
        <Text variant="body-default-s" onBackground="neutral-weak" align="center">
          No existe ningún ticket con ese identificador.
        </Text>
      </Column>
    );
  }

  const cfg = ESTADO_CFG[ticket.estado] ?? { label: ticket.estado, variant: "neutral" as TagVariant };

  return (
    <Column fillWidth style={{ minHeight: "100vh", maxWidth: 480, margin: "0 auto" }} padding="24" gap="0">
      {/* Header */}
      <Column gap="4" paddingBottom="24" style={{ borderBottom: "1px solid var(--neutral-alpha-medium)" }}>
        <Row gap="8" vertical="center">
          <Icon name="clipboard" size="s" onBackground="brand-medium" />
          <Text variant="label-strong-xs" onBackground="brand-medium" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Servicar — Estado de Ticket
          </Text>
        </Row>
        <Text variant="heading-strong-m" onBackground="neutral-strong" style={{ fontFamily: "monospace" }}>
          {ticket.id}
        </Text>
      </Column>

      {/* Estado */}
      <Column gap="8" paddingY="20" style={{ borderBottom: "1px solid var(--neutral-alpha-medium)" }}>
        <Text variant="label-strong-xs" onBackground="neutral-weak">ESTADO</Text>
        <Tag label={cfg.label} variant={cfg.variant} />
      </Column>

      {/* Info del bus */}
      <Column gap="16" paddingY="20" style={{ borderBottom: "1px solid var(--neutral-alpha-medium)" }}>
        <Row gap="32">
          <Column gap="4" flex={1}>
            <Text variant="label-strong-xs" onBackground="neutral-weak">MATRÍCULA</Text>
            <Text variant="label-strong-s" onBackground="neutral-strong" style={{ fontFamily: "monospace" }}>
              {ticket.matricula}
            </Text>
          </Column>
          <Column gap="4" flex={1}>
            <Text variant="label-strong-xs" onBackground="neutral-weak">CATEGORÍA</Text>
            <Text variant="label-default-s" onBackground="neutral-strong" style={{ textTransform: "capitalize" }}>
              {ticket.categoria}
            </Text>
          </Column>
        </Row>
        <Column gap="4">
          <Text variant="label-strong-xs" onBackground="neutral-weak">TÍTULO</Text>
          <Text variant="body-default-s" onBackground="neutral-medium">
            {ticket.titulo}
          </Text>
        </Column>
      </Column>

      {/* Fechas */}
      <Column gap="12" paddingY="20">
        <Row gap="32">
          <Column gap="4" flex={1}>
            <Text variant="label-strong-xs" onBackground="neutral-weak">CREADO</Text>
            <Text variant="label-default-xs" onBackground="neutral-medium">
              {formatDate(ticket.creationTime)}
            </Text>
          </Column>
          <Column gap="4" flex={1}>
            <Text variant="label-strong-xs" onBackground="neutral-weak">ÚLTIMA MODIFICACIÓN</Text>
            <Text variant="label-default-xs" onBackground="neutral-medium">
              {formatDate(ticket.fechaUltimaModificacion)}
            </Text>
          </Column>
        </Row>
      </Column>

      {/* Footer */}
      <Column paddingTop="20" horizontal="center" style={{ borderTop: "1px solid var(--neutral-alpha-medium)" }}>
        <Text variant="label-default-xs" onBackground="neutral-weak" align="center">
          Consulta de solo lectura · Servicar
        </Text>
      </Column>
    </Column>
  );
}
