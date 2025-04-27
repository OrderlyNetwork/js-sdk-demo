'use client'
import dynamic from "next/dynamic";

const OrderlyProvider = dynamic(() => import("@/components/orderlyProvider"), {
  ssr: false, // Disable server-side rendering
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <OrderlyProvider >
      {children}
    </OrderlyProvider>
  );
}
