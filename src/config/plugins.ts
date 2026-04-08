import { registerOnrampPlugin } from "@orderly.network/onramper-plugin";

export const plugins = [
  registerOnrampPlugin({
    apiKey: "pk_prod_01JWTGETB1H32953X7KR3DSH1S",
    secretKey: "01JWTGETB259KDVKEEVHBCGT7D",
    workerUrl: "https://gentle-butterfly-db9c.han-eff.workers.dev/",
  }),
];
