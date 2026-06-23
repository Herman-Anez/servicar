"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { MecanicoCoordinator } from "@/presentation/coordinators";
import { useNuevoTicketViewModel } from "@/presentation/view-models/ticket/useNuevoTicket.view-model";
import { NuevoTicketView } from "@/presentation/views/ticket/NuevoTicketView";

export default function NuevoTicketPage() {
  const router = useRouter();
  const coordinator = useMemo(() => new MecanicoCoordinator(router), [router]);
  const vm = useNuevoTicketViewModel(coordinator);
  return <NuevoTicketView {...vm} />;
}
