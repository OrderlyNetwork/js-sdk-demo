"use client";

import { useClientRouting as useClientRoute } from "@/hooks/useClientRoute";

export function ClientRoute({ children }: { children: React.ReactNode }) {
  useClientRoute();

  return <>{children}</>;
}
