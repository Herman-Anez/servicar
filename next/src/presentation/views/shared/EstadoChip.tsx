"use client";

import type { TicketEstado } from "@servicar/core";

const ESTADO_CFG: Record<TicketEstado, { label: string; bg: string }> = {
  pendiente_revision: { label: "EN REVISIÓN", bg: "var(--neutral-alpha-medium)" },
  requiere_cambios:   { label: "CORREGIR",    bg: "var(--warning-alpha-medium)" },
  aprobado:           { label: "APROBADO",    bg: "var(--success-alpha-medium)" },
  en_progreso:        { label: "EN PROGRESO", bg: "var(--brand-alpha-medium)"   },
  bloqueado:          { label: "BLOQUEADO",   bg: "var(--danger-alpha-medium)"  },
  urgente:            { label: "URGENTE",     bg: "var(--warning-alpha-strong)" },
  finalizado:         { label: "FINALIZADO",  bg: "var(--success-alpha-weak)"   },
};

export function EstadoChip({ estado }: { estado: TicketEstado }) {
  const cfg = ESTADO_CFG[estado] ?? { label: estado.toUpperCase(), bg: "var(--neutral-alpha-weak)" };
  return (
    <span style={{
      padding: "2px 7px", borderRadius: 4, background: cfg.bg,
      fontSize: "9px", fontWeight: 800, textTransform: "uppercase",
      letterSpacing: "0.07em", flexShrink: 0, whiteSpace: "nowrap",
    }}>
      {cfg.label}
    </span>
  );
}
