"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { AdminCoordinator } from "@/presentation/coordinators";
import { useTicketsViewModel } from "@/presentation/view-models/admin/useTicketsViewModel";
import { TicketsView } from "@/presentation/views/admin/TicketsView";

export default function TicketsAdminPage() {
  const router = useRouter();
  const coordinator = useMemo(() => new AdminCoordinator(router), [router]);
  const vm = useTicketsViewModel(coordinator);
  return <TicketsView {...vm} />;
}
