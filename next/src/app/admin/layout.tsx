"use client";

import { useMemo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminCoordinator } from "@/presentation/coordinators";
import { useAdminLayoutViewModel } from "@/presentation/view-models/admin/useAdminLayout.view-model";
import { AdminLayoutView } from "@/presentation/views/admin/AdminLayoutView";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const coordinator = useMemo(() => new AdminCoordinator(router), [router]);
  const vm = useAdminLayoutViewModel(coordinator);

  useEffect(() => {
    if (vm.loading) return;
    if (!vm.empleado) { coordinator.goToLogin(); return; }
    if (vm.empleado.rol !== "admin") router.replace("/dashboard");
  }, [vm.empleado, vm.loading, coordinator, router]);

  useEffect(() => { vm.setSidebarOpen(false); }, [pathname]);

  return <AdminLayoutView {...vm} pathname={pathname}>{children}</AdminLayoutView>;
}
