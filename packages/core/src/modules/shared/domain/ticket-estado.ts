export type TicketEstado =
  | "pendiente_revision"
  | "requiere_cambios"
  | "aprobado"
  | "en_progreso"
  | "bloqueado"
  | "urgente"
  | "finalizado";

export const TICKET_ESTADO_TRANSITIONS: Record<TicketEstado, TicketEstado[]> = {
  pendiente_revision: ["aprobado", "requiere_cambios"],
  requiere_cambios:   ["pendiente_revision"],
  aprobado:           ["en_progreso"],
  en_progreso:        ["urgente", "bloqueado", "finalizado"],
  urgente:            ["en_progreso", "finalizado"],
  bloqueado:          ["en_progreso"],
  finalizado:         [],
};

export function isTransicionValida(actual: TicketEstado, siguiente: TicketEstado): boolean {
  return TICKET_ESTADO_TRANSITIONS[actual].includes(siguiente);
}
