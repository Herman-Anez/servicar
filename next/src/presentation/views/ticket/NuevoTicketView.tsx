"use client";

import { Column, Row, Text, Icon, Input, Select, Textarea } from "@once-ui-system/core";
import { ViewHeader, AlertBanner } from "@/presentation/views/shared";
import { WORKSHOP_CATEGORIAS } from "@servicar/core";
import type { NuevoTicketVM } from "@/presentation/view-models/ticket/useNuevoTicket.view-model";
import type { TicketCategoria } from "@servicar/core";

export function NuevoTicketView({ form, submitting, error, setField, setCategoria, onSubmit, onCancel }: NuevoTicketVM) {
  return (
    <Column fillWidth gap="0" style={{ minHeight: "calc(100vh - 48px)" }}>
      <ViewHeader
        title="Nueva Orden"
        subtitle="Se publicará como ticket en revisión"
        onBack={onCancel}
        borderBottom
        marginBottom="24"
      />

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
          <AlertBanner message={error} type="danger" />
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
