"use client";
import { useCallback } from "react";
import { API } from "@orderly.network/types";
import { useRouter } from "next/navigation";
import { PathEnum } from "@/constant";
import { updateSymbol } from "@/storage";

export function useSymbolChange() {
  const router = useRouter();

  const onSymbolChange = useCallback(
    (data: API.Symbol) => {
      const symbol = data.symbol;
      updateSymbol(symbol);
      router.push(PathEnum.Root);
    },
    [router]
  );

  return onSymbolChange;
}
