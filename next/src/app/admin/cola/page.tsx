"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { AdminCoordinator } from "@/presentation/coordinators";
import { useColaViewModel } from "@/presentation/view-models/admin/useColaViewModel";
import { ColaView } from "@/presentation/views/admin/ColaView";

export default function ColaPage() {
  const router = useRouter();
  const coordinator = useMemo(() => new AdminCoordinator(router), [router]);
  const vm = useColaViewModel(coordinator);
  return <ColaView {...vm} />;
}
