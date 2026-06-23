"use client";

import { useParams } from "next/navigation";
import { usePublicoTicketViewModel } from "@/presentation/view-models/ticket/usePublicoTicket.view-model";
import { PublicoTicketView } from "@/presentation/views/ticket/PublicoTicketView";

export default function TicketPublicoPage() {
  const params = useParams<{ id: string }>();
  const vm = usePublicoTicketViewModel(params.id);
  return <PublicoTicketView {...vm} />;
}
