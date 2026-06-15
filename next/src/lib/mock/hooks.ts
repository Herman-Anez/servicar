"use client";

// Hooks que imitan la API de Convex (useQuery / useMutation / useConvexAuth)
// Misma firma que los hooks reales — swap transparente vía src/lib/db.ts

import { useEffect, useReducer, useCallback } from "react";
import { mockStore } from "@servicar/persistence-mock";
import type { TicketEstado, TicketCategoria } from "@servicar/persistence-mock";

// Fuerza re-render cuando el store notifica cambios
function useStoreVersion() {
  const [, rerender] = useReducer((x: number) => x + 1, 0);
  useEffect(() => mockStore.subscribe(rerender), []);
}

// ── Sesión mock ────────────────────────────────────────────────────────────

const SESSION_KEY = "servicar_mock_session";

export function getMockSession() {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

export function setMockSession(empleadoId: string) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ empleadoId }));
}

export function clearMockSession() {
  localStorage.removeItem(SESSION_KEY);
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
  return useCallback((authId: string) => {
    const empleado = mockStore.getEmpleadoByAuth(authId);
    if (!empleado) throw new Error("Credenciales inválidas");
    setMockSession(empleado._id);
    return empleado;
  }, []);
}

export function useMockSignOut() {
  return useCallback(() => clearMockSession(), []);
}
