import {
  PERPS_TRADE_SUB_MENU_KEY,
  PREDICTION_TRADE_SUB_MENU_KEY,
} from "@orderly.network/markets";
import { PathEnum } from "@/constant";

export type TradeSubMenuTab =
  | typeof PERPS_TRADE_SUB_MENU_KEY
  | typeof PREDICTION_TRADE_SUB_MENU_KEY;

/** Expects a pathname without the language prefix. */
export function getTradeSubMenuTab(path: string): TradeSubMenuTab {
  return path === PathEnum.Prediction ||
    path.startsWith(`${PathEnum.Prediction}/`)
    ? PREDICTION_TRADE_SUB_MENU_KEY
    : PERPS_TRADE_SUB_MENU_KEY;
}
