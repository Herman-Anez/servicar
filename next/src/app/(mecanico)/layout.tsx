"use client";

import { useMemo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MecanicoCoordinator } from "@/presentation/coordinators";
import { useMecanicoLayoutViewModel } from "@/presentation/view-models/mecanico/useMecanicoLayout.view-model";
import { MecanicoLayoutView } from "@/presentation/views/mecanico/MecanicoLayoutView";

export default function MecanicoLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const coordinator = useMemo(() => new MecanicoCoordinator(router), [router]);
  const vm = useMecanicoLayoutViewModel(coordinator);

  useEffect(() => {
    if (vm.loading) return;
    if (!vm.empleado) coordinator.goToLogin();
  }, [vm.empleado, vm.loading, coordinator]);

  return <MecanicoLayoutView {...vm} pathname={pathname}>{children}</MecanicoLayoutView>;
}
