import React, { useCallback } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { FeeTierModule } from "@orderly.network/portfolio";

type FeeHeaderItem = { label: string };

// The SDK ships a hardcoded tier table (see `@orderly.network/portfolio`
// dist `dataSource`); the real rates already shown in the header come from
// the account info endpoint. Drop the fabricated table and the tier badge.
const EMPTY_FEE_DATA = { columns: [], dataSource: [] };

export default function FeeTierView() {
  const { t } = useTranslation();
  const yourTierLabel = t("portfolio.feeTier.header.yourTier");

  const dataAdapter = useCallback(() => EMPTY_FEE_DATA, []);

  const headerDataAdapter = useCallback(
    (original: FeeHeaderItem[]) =>
      original.filter((item) => item.label !== yourTierLabel),
    [yourTierLabel],
  );

  return (
    <FeeTierModule.FeeTierPage
      dataAdapter={dataAdapter}
      headerDataAdapter={headerDataAdapter}
    />
  );
}
