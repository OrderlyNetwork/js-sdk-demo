import { registerFastPlaceOrderPlugin } from "@orderly.network/fast-place-order-plugin";
import { registerOnrampPlugin } from "@orderly.network/onramper-plugin";
import { registerPlugin as registerOrderbookShimmerPlugin } from "@orderly.network/orderbook-shimmer-plugin";

/**
 * Plugins passed to `OrderlyAppProvider` in `orderlyProvider/index.tsx`.
 * Order may matter when multiple plugins target the same interceptor slots.
 */
export const plugins = [
  /** Desktop orderbook row shimmer / flash on updates (optional colors via partial options). */
  registerOrderbookShimmerPlugin(),
  registerFastPlaceOrderPlugin({
    // Same as package default; explicit so hosts can flip without re-reading README.
    autoShowOnFullscreen: true,
  }),
  registerOnrampPlugin({
    apiKey: "pk_prod_01JWTGETB1H32953X7KR3DSH1S",
    secretKey: "01JWTGETB259KDVKEEVHBCGT7D",
    // workerUrl: "https://gentle-butterfly-db9c.han-eff.workers.dev/",
  }),
];
