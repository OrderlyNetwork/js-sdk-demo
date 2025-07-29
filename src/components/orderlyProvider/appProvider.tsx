"use client";

import dynamic from "next/dynamic";
import React from "react";

const OrderlyProvider = dynamic(() => import("@/components/orderlyProvider"), {
  ssr: false, // Disable server-side rendering
});

export const AppProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <OrderlyProvider>{children}</OrderlyProvider>;
};
