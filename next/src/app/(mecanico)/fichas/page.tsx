"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { MecanicoCoordinator } from "@/presentation/coordinators";
import { useFichasViewModel } from "@/presentation/view-models/mecanico/useFichas.view-model";
import { FichasView } from "@/presentation/views/mecanico/FichasView";

export default function FichasPage() {
  const router = useRouter();
  const coordinator = useMemo(() => new MecanicoCoordinator(router), [router]);
  const vm = useFichasViewModel(coordinator);
  return <FichasView {...vm} />;
}
