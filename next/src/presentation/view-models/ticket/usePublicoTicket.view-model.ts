"use client";

import { useState, useEffect } from "react";
import { ticketModule } from "@/modules/ticket/infrastructure/ticket-module";
import type { Ticket } from "@servicar/core";

export interface PublicoTicketVM {
  ticket: Ticket | null;
  loading: boolean;
  notFound: boolean;
}

export function usePublicoTicketViewModel(ticketId: string): PublicoTicketVM {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    ticketModule.getTicketById.execute(ticketId).then((t) => {
      if (!t) setNotFound(true);
      else setTicket(t);
      setLoading(false);
    });
  }, [ticketId]);

  return { ticket, loading, notFound };
}
