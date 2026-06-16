"use client";

// Hooks que imitan la API de Convex (useQuery / useMutation / useConvexAuth)
// Misma firma que los hooks reales — swap transparente vía src/lib/db.ts

import { useEffect, useReducer, useCallback } from "react";
import { mockStore } from "@servicar/persistence-mock";
import type { TicketEstado, TicketCategoria } from "@servicar/persistence-mock";
import { authSession } from "@/lib/auth";
import { authModule } from "../../modules/auth/infrastructure/auth-module";

// Fuerza re-render cuando el store notifica cambios
function useStoreVersion() {
  const [, rerender] = useReducer((x: number) => x + 1, 0);
  useEffect(() => mockStore.subscribe(rerender), []);
}

// ── Sesión mock ────────────────────────────────────────────────────────────

export function getMockSession() {
  return authSession.getSession();
}

export function setMockSession(empleadoId: string) {
  authSession.setSession({ empleadoId });
}

export function clearMockSession() {
  authSession.clearSession();
  mockStore.notify();
}

// ── Auth ───────────────────────────────────────────────────────────────────

export function useMockAuth() {
  useStoreVersion();
  const session = getMockSession();
  const empleado = session ? mockStore.getEmpleadoById(session.empleadoId) : null;
  return {
    isAuthenticated: !!empleado,
    isLoading: false,
    empleado,
  };
}

// ── Queries ────────────────────────────────────────────────────────────────

export function useMockTickets() {
  useStoreVersion();
  return mockStore.getTickets();
}

export function useMockTicketsByEstado(estado: TicketEstado) {
  useStoreVersion();
  return mockStore.getTicketsByEstado(estado);
}

export function useMockTicketsByCreador(creadorId: string) {
  useStoreVersion();
  return mockStore.getTicketsByCreador(creadorId);
}

export function useMockTicketById(id: string) {
  useStoreVersion();
  return mockStore.getTicketById(id);
}

export function useMockEmpleados() {
  useStoreVersion();
  return mockStore.getEmpleados();
}

export function useMockHistorialByTicket(ticketId: string) {
  useStoreVersion();
  return mockStore.getHistorialByTicket(ticketId);
}

// ── Mutations ──────────────────────────────────────────────────────────────

export function useMockCrearTicket() {
  return useCallback(
    (data: {
      matricula: string;
      categoria: TicketCategoria;
      titulo: string;
      descripcion: string;
      creadorId: string;
    }) => mockStore.crearTicket(data),
    []
  );
}

export function useMockEditarTicket() {
  return useCallback(
    (
      id: string,
      empleadoId: string,
      data: Parameters<typeof mockStore.editarTicket>[2]
    ) => mockStore.editarTicket(id, empleadoId, data),
    []
  );
}

export function useMockCambiarEstado() {
  return useCallback(
    (id: string, empleadoId: string, estado: TicketEstado, nota?: string) =>
      mockStore.cambiarEstado(id, empleadoId, estado, nota),
    []
  );
}

export function useMockSignIn() {
  return useCallback(async (email: string, password: string) => {
    const sesion = await authModule.autenticar.execute({ email, password });
    if (!sesion) return null;
    authSession.setSession({ empleadoId: sesion.empleadoId });
    return sesion;
  }, []);
}

export function useMockSignOut() {
  return useCallback(() => clearMockSession(), []);
}
