// Punto de entrada unificado para acceso a datos.
// NEXT_PUBLIC_USE_MOCK=true  →  usa hooks locales (sin Convex, sin internet)
// NEXT_PUBLIC_USE_MOCK=false →  usa Convex real (requiere NEXT_PUBLIC_CONVEX_URL)
//
// En componentes: importar siempre desde "@/lib/db", nunca directo desde convex/react

import { useState, useEffect } from "react";
import { useStoreReactive } from "@/presentation/hooks/useStoreReactive";
import { authSession } from "@/lib/auth";
import { empleadoModule } from "@/modules/empleado/infrastructure/empleado-module";
import type { Empleado } from "@servicar/core";
import { useMockAuth } from "./mock/hooks";

const isMock = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export { isMock };

export {
  useMockTickets as useTickets,
  useMockTicketsByEstado as useTicketsByEstado,
  useMockTicketsByCreador as useTicketsByCreador,
  useMockTicketById as useTicketById,
  useMockEmpleados as useEmpleados,
  useMockHistorialByTicket as useHistorialByTicket,
  useMockCrearTicket as useCrearTicket,
  useMockEditarTicket as useEditarTicket,
  useMockCambiarEstado as useCambiarEstado,
  useMockSignIn as useSignIn,
  useMockSignOut as useSignOut,
} from "./mock/hooks";

export function useAuth() {
  const mockAuth = useMockAuth();
  const refreshKey = useStoreReactive();
  const session = authSession.getSession();
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isMock) return;
    setLoading(true);
    if (!session) {
      setEmpleado(null);
      setLoading(false);
      return;
    }
    empleadoModule.getEmpleadoById.execute(session.empleadoId)
      .then((emp) => {
        setEmpleado(emp);
        setLoading(false);
      })
      .catch(() => {
        setEmpleado(null);
        setLoading(false);
      });
  }, [session?.empleadoId, refreshKey]);

  if (isMock) {
    return mockAuth;
  }

  return {
    isAuthenticated: !!empleado,
    isLoading: loading,
    empleado,
  };
}

export type {
  MockTicket as Ticket,
  MockEmpleado as Empleado,
  MockHistorial as Historial,
  MockDraft as Draft,
  TicketEstado,
  TicketCategoria,
  Rol,
} from "@servicar/persistence-mock";

export { MOCK_EMPLEADOS, mockStore } from "@servicar/persistence-mock";

// Tipos de dominio — vienen del shared kernel, no del mock
export { WORKSHOP_CATEGORIAS, TICKET_ESTADO_TRANSITIONS, isTransicionValida } from "@servicar/core";

// TODO Fase 1+2: cuando Convex esté listo, condicionar así:
//
// if (isMock) {
//   export * from "./mock/hooks";
// } else {
//   export * from "./convex/hooks";  ← a crear en Fase 2
// }
