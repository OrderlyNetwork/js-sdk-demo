import { registerStarchildPlugin } from "starchild-orderly-plugin";
import { registerFastPlaceOrderPlugin } from "@orderly.network/fast-place-order-plugin";
import "starchild-orderly-plugin/styles.css";

// import { registerPlugin as registerOrderbookShimmerPlugin } from "@orderly.network/orderbook-shimmer-plugin";

/**
 * Plugins passed to `OrderlyAppProvider` in `orderlyProvider/index.tsx`.
 * Order may matter when multiple plugins target the same interceptor slots.
 */
export const plugins = [
  /** Desktop orderbook row shimmer / flash on updates (optional colors via partial options). */
  // registerOrderbookShimmerPlugin(),
  registerFastPlaceOrderPlugin({
    // Same as package default; explicit so hosts can flip without re-reading README.
    autoShowOnFullscreen: true,
  }),
  /** Starchild AI assistant: floating chat button + side panel with built-in one-click trading authorization. */
  registerStarchildPlugin(),
];
