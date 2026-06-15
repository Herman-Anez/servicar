"use client";

import { Column, Row, Text, Heading, Icon, Input, Select, Textarea, Spinner } from "@once-ui-system/core";
import { WORKSHOP_CATEGORIAS } from "@servicar/core";
import type { EditarTicketVM } from "@/presentation/view-models/ticket/useEditarTicketViewModel";
import type { TicketCategoria } from "@servicar/core";

export function EditarTicketView({ ticket, viewState, form, submitting, success, error, setField, setCategoria, onSubmit, onBack }: EditarTicketVM) {
  if (viewState === "loading") {
    return (
      <Column fillWidth flex={1} horizontal="center" vertical="center" gap="12" padding="40">
        <Spinner />
        <Text variant="label-default-xs" onBackground="neutral-weak">Cargando ficha…</Text>
      </Column>
    );
  }

  if (viewState === "forbidden") {
    return (
      <Column fillWidth flex={1} horizontal="center" vertical="center" gap="12" padding="40">
        <Icon name="ban" size="m" onBackground="danger-medium" />
        <Text variant="label-default-xs" onBackground="neutral-weak">Solo puedes editar tus propias fichas.</Text>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <Text variant="label-strong-xs" onBackground="brand-medium">← Volver al taller</Text>
        </button>
      </Column>
    );
  }

  if (viewState === "finalizado") {
    return (
      <Column fillWidth flex={1} horizontal="center" vertical="center" gap="12" padding="40">
        <Icon name="checkBadge" size="m" onBackground="success-medium" />
        <Text variant="label-default-xs" onBackground="neutral-weak">Esta ficha está finalizada y no se puede editar.</Text>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <Text variant="label-strong-xs" onBackground="brand-medium">← Volver al taller</Text>
        </button>
      </Column>
    );
  }

  const isRequiresCambios = ticket?.estado === "requiere_cambios";

  return (
    <Column fillWidth gap="0" style={{ minHeight: "calc(100vh - 48px)" }}>
      <Row fillWidth gap="8" vertical="center" paddingBottom="16" borderBottom="neutral-alpha-weak" marginBottom="24">
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "inherit", padding: 0 }}>
          <Icon name="arrowLeft" size="s" onBackground="neutral-medium" />
        </button>
        <Column gap="2" style={{ flex: 1, minWidth: 0 }}>
          <Heading variant="heading-strong-m">Editar Ficha</Heading>
          <Row gap="8" vertical="center">
            <span style={{ fontSize: "10px", fontWeight: 800, fontFamily: "monospace", background: "var(--brand-alpha-weak)", color: "var(--brand-on-background-strong)", padding: "1px 5px", borderRadius: 3 }}>
              {ticket?.matricula}
            </span>
            <span style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", background: isRequiresCambios ? "var(--warning-alpha-medium)" : "var(--neutral-alpha-medium)", color: isRequiresCambios ? "var(--warning-on-background-strong)" : "var(--neutral-on-background-medium)", padding: "1px 5px", borderRadius: 3 }}>
              {isRequiresCambios ? "REQUIERE CAMBIOS" : (ticket?.estado ?? "").toUpperCase().replace(/_/g, " ")}
            </span>
          </Row>
        </Column>
      </Row>

      <Column fillWidth gap="16" flex={1}>
        {ticket?.notaAdmin && (
          <Column gap="8" padding="12" radius="m" background="warning-alpha-weak" border="warning-alpha-medium">
            <Row gap="8" vertical="center">
              <Icon name="warning" size="xs" onBackground="warning-strong" />
              <Text variant="label-strong-xs" onBackground="warning-strong">NOTA DEL ADMINISTRADOR</Text>
            </Row>
            <Text variant="body-default-xs" onBackground="warning-strong">{ticket.notaAdmin}</Text>
          </Column>
        )}

        <Column gap="8">
          <Text variant="label-strong-xs" onBackground="neutral-weak">MATRÍCULA *</Text>
          <Input id="matricula" value={form.matricula} onChange={setField("matricula")} placeholder="Ej: 4829-KXL" />
        </Column>

        <Column gap="8">
          <Text variant="label-strong-xs" onBackground="neutral-weak">CATEGORÍA *</Text>
          <Select id="categoria" value={form.categoria} options={WORKSHOP_CATEGORIAS} onSelect={(v) => setCategoria(v as TicketCategoria)} label="Categoría" />
        </Column>

        <Column gap="8">
          <Text variant="label-strong-xs" onBackground="neutral-weak">TÍTULO *</Text>
          <Input id="titulo" value={form.titulo} onChange={setField("titulo")} placeholder="Breve descripción del trabajo" />
        </Column>

        <Column gap="8">
          <Text variant="label-strong-xs" onBackground="neutral-weak">DESCRIPCIÓN *</Text>
          <Textarea id="descripcion" value={form.descripcion} onChange={setField("descripcion")} placeholder="Detalla el problema, trabajos realizados, piezas utilizadas…" lines={5} />
        </Column>

        {error && (
          <Row gap="8" style={{ padding: "10px" }} radius="m" background="danger-alpha-weak" border="danger-alpha-medium" vertical="center">
            <Icon name="warning" size="xs" onBackground="danger-medium" />
            <Text variant="label-default-xs" onBackground="danger-strong">{error}</Text>
          </Row>
        )}

        {success && (
          <Row gap="8" style={{ padding: "10px" }} radius="m" background="success-alpha-weak" border="success-alpha-medium" vertical="center">
            <Icon name="checkCircle" size="xs" onBackground="success-medium" />
            <Text variant="label-default-xs" onBackground="success-strong">Guardado. Redirigiendo…</Text>
          </Row>
        )}

        <Column gap="8" marginTop="8">
          <button
            onClick={onSubmit}
            disabled={submitting || success}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 0", borderRadius: 8, border: "none", background: "var(--brand-strong)", color: "white", cursor: submitting ? "not-allowed" : "pointer", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", width: "100%", opacity: submitting ? 0.6 : 1 }}
          >
            <Icon name="checkCircle" size="s" />
            GUARDAR CAMBIOS
          </button>
          <button
            onClick={onBack}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 0", borderRadius: 8, border: "1px solid var(--neutral-alpha-medium)", background: "transparent", color: "var(--neutral-on-background-medium)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", width: "100%", cursor: "pointer" }}
          >
            CANCELAR
          </button>
        </Column>
      </Column>
    </Column>
  );
}
