"use client";

import { Column, Row, Text, Heading, Icon, Input, Select, Textarea } from "@once-ui-system/core";
import { WORKSHOP_CATEGORIAS } from "@servicar/core";
import type { NuevoTicketVM } from "@/presentation/view-models/ticket/useNuevoTicketViewModel";
import type { TicketCategoria } from "@servicar/core";

export function NuevoTicketView({ form, submitting, error, setField, setCategoria, onSubmit, onCancel }: NuevoTicketVM) {
  return (
    <Column fillWidth gap="0" style={{ minHeight: "calc(100vh - 48px)" }}>
      <Row fillWidth gap="8" vertical="center" paddingBottom="16" borderBottom="neutral-alpha-weak" marginBottom="24">
        <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "inherit", padding: 0 }}>
          <Icon name="arrowLeft" size="s" onBackground="neutral-medium" />
        </button>
        <Column gap="2">
          <Heading variant="heading-strong-m">Nueva Orden</Heading>
          <Text variant="label-default-xs" onBackground="neutral-weak">Se publicará como ticket en revisión</Text>
        </Column>
      </Row>

      <Column fillWidth gap="16" flex={1}>
        <Column gap="8">
          <Text variant="label-strong-xs" onBackground="neutral-weak">MATRÍCULA *</Text>
          <Input id="matricula" value={form.matricula} onChange={setField("matricula")} placeholder="Ej: 4829-KXL" style={{ textTransform: "uppercase" }} />
        </Column>

        <Column gap="8">
          <Text variant="label-strong-xs" onBackground="neutral-weak">CATEGORÍA *</Text>
          <Select
            id="categoria"
            value={form.categoria}
            options={WORKSHOP_CATEGORIAS}
            onSelect={(value) => setCategoria(value as TicketCategoria)}
            label="Categoría"
          />
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

        <Column gap="8" marginTop="8">
          <button
            onClick={onSubmit}
            disabled={submitting}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 0", borderRadius: 8, border: "none", background: "var(--sp-primary)", color: "white", cursor: submitting ? "not-allowed" : "pointer", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", width: "100%", opacity: submitting ? 0.6 : 1 }}
          >
            <Icon name="cloudUp" size="s" />
            PUBLICAR ORDEN
          </button>
          <button
            onClick={onCancel}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 0", borderRadius: 8, border: "1px solid var(--neutral-alpha-medium)", background: "transparent", color: "var(--neutral-on-background-medium)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", width: "100%", cursor: "pointer" }}
          >
            CANCELAR
          </button>
        </Column>
      </Column>
    </Column>
  );
}
