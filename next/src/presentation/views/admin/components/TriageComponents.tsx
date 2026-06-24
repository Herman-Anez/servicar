"use client";

import { Column, Row, Text, Heading, Icon, Tag, Avatar } from "@once-ui-system/core";
import type { Ticket } from "@servicar/core";
import type { Empleado } from "@servicar/core";
import type { PendingAction } from "@/presentation/view-models/admin/useCola.view-model";

interface ConfirmModalProps {
  pending: PendingAction;
  processing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onUpdateNota: (nota: string) => void;
}

export function ConfirmModal({ pending, processing, onConfirm, onCancel, onUpdateNota }: ConfirmModalProps) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ position: "fixed", inset: 0 }} onClick={() => !processing && onCancel()} />
      <Column
        background="page"
        border="neutral-alpha-weak"
        radius="m"
        padding="24"
        gap="16"
        style={{ width: "100%", maxWidth: 480, position: "relative", zIndex: 1, boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
      >
        <Heading variant="heading-strong-s">
          {pending.action === "aprobar" ? "Aprobar Ticket" : "Solicitar Cambios"}
        </Heading>

        <Column background="surface" radius="s" padding="12" gap="8">
          <Text variant="label-default-xs" onBackground="neutral-weak" style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>TICKET</Text>
          <Row gap="8" vertical="center">
            <Tag variant="danger" label={pending.ticket.matricula} size="s" />
            <Text variant="label-strong-s">{pending.ticket.titulo}</Text>
          </Row>
        </Column>

        {pending.action === "rechazar" && (
          <Column gap="8">
            <Text variant="label-default-xs" onBackground="neutral-weak" style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>
              NOTA PARA EL MECÁNICO <span style={{ color: "var(--danger-on-background-strong)" }}>*</span>
            </Text>
            <textarea
              value={pending.nota}
              onChange={(e) => onUpdateNota(e.target.value)}
              placeholder="Explica qué debe corregir el mecánico…"
              rows={4}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, background: "var(--neutral-background-weak)", border: "1px solid var(--neutral-alpha-medium)", color: "var(--neutral-on-background-strong)", fontSize: 13, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box" }}
            />
          </Column>
        )}

        {pending.action === "aprobar" && (
          <Text variant="body-default-s" onBackground="neutral-weak">
            El ticket pasará a estado <strong>aprobado</strong> y el mecánico podrá comenzar el trabajo.
          </Text>
        )}

        <Row gap="8" fillWidth>
          <button
            onClick={onCancel}
            disabled={processing}
            style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid var(--neutral-alpha-medium)", background: "transparent", color: "var(--neutral-on-background-weak)", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={processing || (pending.action === "rechazar" && !pending.nota.trim())}
            style={{ flex: 2, padding: "10px 0", borderRadius: 8, border: "none", background: pending.action === "aprobar" ? "var(--brand-background-strong)" : "var(--danger-background-strong)", color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 800, fontFamily: "inherit", opacity: (processing || (pending.action === "rechazar" && !pending.nota.trim())) ? 0.5 : 1 }}
          >
            {pending.action === "aprobar" ? "Confirmar Aprobación" : "Enviar al Mecánico"}
          </button>
        </Row>
      </Column>
    </div>
  );
}

interface TriageRowProps {
  ticket: Ticket;
  creador?: Empleado;
  edadLabel: string;
  onAprobar: () => void;
  onRechazar: () => void;
}

export function TriageRow({ ticket, creador, edadLabel, onAprobar, onRechazar }: TriageRowProps) {
  return (
    <tr
      style={{ borderTop: "1px solid var(--neutral-background-medium)", transition: "background 0.12s" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--neutral-background-weak)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <td style={{ padding: "14px 16px" }}>
        <Column gap="2">
          <Text variant="label-strong-xs" onBackground="brand-medium">
            #TC-{ticket.id.slice(-4).toUpperCase()}
          </Text>
          <Text variant="label-default-xs" onBackground="neutral-weak" style={{ textTransform: "uppercase" }}>
            {edadLabel}
          </Text>
        </Column>
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Tag variant="neutral" label={ticket.matricula} size="s" />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Tag variant="neutral" label={ticket.categoria} size="s" />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <Row gap="8" vertical="center">
          <Avatar value={creador?.nombre ?? "?"} size="xs" />
          <Text variant="label-default-s">{creador?.nombre ?? "—"}</Text>
        </Row>
      </td>
      <td style={{ padding: "14px 16px", textAlign: "right" }}>
        <Row gap="8" horizontal="end" vertical="center">
          <button
            onClick={onRechazar}
            style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid var(--neutral-alpha-medium)", background: "transparent", color: "var(--neutral-on-background-weak)", cursor: "pointer", fontSize: 12, fontWeight: 500, fontFamily: "inherit" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--neutral-background-medium)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Rechazar
          </button>
          <button
            onClick={onAprobar}
            style={{ padding: "6px 16px", borderRadius: 8, background: "var(--brand-background-strong)", color: "#fff", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, fontFamily: "inherit" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Aprobar
          </button>
        </Row>
      </td>
    </tr>
  );
}
