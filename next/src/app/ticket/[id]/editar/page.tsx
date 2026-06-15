"use client";

import { useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { MecanicoCoordinator } from "@/presentation/coordinators";
import { useEditarTicketViewModel } from "@/presentation/view-models/ticket/useEditarTicketViewModel";
import { EditarTicketView } from "@/presentation/views/ticket/EditarTicketView";

export default function EditarTicketPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const coordinator = useMemo(() => new MecanicoCoordinator(router), [router]);
  const vm = useEditarTicketViewModel(params.id, coordinator);
  return <EditarTicketView {...vm} />;
}
