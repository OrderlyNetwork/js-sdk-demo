import { TESTNET_WHITE_LIST } from "@orderly.network/hooks";
import { ADI_TESTNET_CHAINID } from "@orderly.network/types";

const X_LAYER_TESTNET_CHAINID = 1952;

export const chainFilter = {
  testnet: [
    ...TESTNET_WHITE_LIST.map((id) => ({ id })),
    { id: ADI_TESTNET_CHAINID },
    { id: X_LAYER_TESTNET_CHAINID },
  ],
};
