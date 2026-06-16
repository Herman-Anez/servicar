"use client";

import { appStore, isMock } from "@/lib/store";
import { mockStore, MockTicketRepository, MockHistorialRepository } from "@servicar/persistence-mock";
import { PbTicketRepository, PbHistorialRepository } from "@servicar/persistence-pocketbase";
import type { PbStore } from "@servicar/persistence-pocketbase";
import {
  CrearTicketUseCase,
  EditarTicketUseCase,
  CambiarEstadoUseCase,
  GetTicketsQuery,
  GetTicketByIdQuery,
  GetTicketsPorEstadoQuery,
  GetTicketsPorCreadorQuery,
  GetHistorialQuery,
  type ICrearTicketUseCase,
  type IEditarTicketUseCase,
  type ICambiarEstadoUseCase,
  type IGetTicketsQuery,
  type IGetTicketByIdQuery,
  type IGetTicketsPorEstadoQuery,
  type IGetTicketsPorCreadorQuery,
  type IGetHistorialQuery,
} from "@servicar/core";

const store = appStore as PbStore;

const ticketRepo    = isMock ? new MockTicketRepository(mockStore)    : new PbTicketRepository(store);
const historialRepo = isMock ? new MockHistorialRepository(mockStore) : new PbHistorialRepository(store);

export const ticketModule = {
  crearTicket:          new CrearTicketUseCase(ticketRepo)        as ICrearTicketUseCase,
  editarTicket:         new EditarTicketUseCase(ticketRepo)       as IEditarTicketUseCase,
  cambiarEstado:        new CambiarEstadoUseCase(ticketRepo)      as ICambiarEstadoUseCase,
  getTickets:           new GetTicketsQuery(ticketRepo)           as IGetTicketsQuery,
  getTicketById:        new GetTicketByIdQuery(ticketRepo)        as IGetTicketByIdQuery,
  getTicketsPorEstado:  new GetTicketsPorEstadoQuery(ticketRepo)  as IGetTicketsPorEstadoQuery,
  getTicketsPorCreador: new GetTicketsPorCreadorQuery(ticketRepo) as IGetTicketsPorCreadorQuery,
  getHistorial:         new GetHistorialQuery(historialRepo)      as IGetHistorialQuery,
};
