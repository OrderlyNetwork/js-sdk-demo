"use client";

import React from "react";
import dynamic from "next/dynamic";

const OrderlyProvider = dynamic(() => import("@/components/orderlyProvider"), {
  ssr: false, // Disable server-side rendering
});

export const AppProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <OrderlyProvider>{children}</OrderlyProvider>;
};
