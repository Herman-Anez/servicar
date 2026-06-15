"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { MecanicoCoordinator } from "@/presentation/coordinators";
import { useDashboardViewModel } from "@/presentation/view-models/mecanico/useDashboardViewModel";
import { DashboardView } from "@/presentation/views/mecanico/DashboardView";

export default function DashboardPage() {
  const router = useRouter();
  const coordinator = useMemo(() => new MecanicoCoordinator(router), [router]);
  const vm = useDashboardViewModel(coordinator);
  return <DashboardView {...vm} />;
}
