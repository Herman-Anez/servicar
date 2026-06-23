"use client";

import { useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminCoordinator } from "@/presentation/coordinators";
import { useHistorialViewModel } from "@/presentation/view-models/admin/useHistorial.view-model";
import { HistorialView } from "@/presentation/views/admin/HistorialView";

export default function HistorialPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const coordinator = useMemo(() => new AdminCoordinator(router), [router]);
  const vm = useHistorialViewModel(params.id, coordinator);
  return <HistorialView {...vm} />;
}
