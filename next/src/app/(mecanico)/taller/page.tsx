"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { MecanicoCoordinator } from "@/presentation/coordinators";
import { useTallerViewModel } from "@/presentation/view-models/mecanico/useTaller.view-model";
import { TallerView } from "@/presentation/views/mecanico/TallerView";

export default function TallerPage() {
  const router = useRouter();
  const coordinator = useMemo(() => new MecanicoCoordinator(router), [router]);
  const vm = useTallerViewModel(coordinator);
  return <TallerView {...vm} />;
}
