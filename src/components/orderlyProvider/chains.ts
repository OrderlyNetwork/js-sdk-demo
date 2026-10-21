import { TESTNET_WHITE_LIST } from "@orderly.network/hooks";
import { ADI_TESTNET_CHAINID } from "@orderly.network/types";
import type { API } from "@orderly.network/types";

const X_LAYER_MAINNET_CHAINID = 196;
const X_LAYER_TESTNET_CHAINID = 1952;
const ROBINHOOD_TESTNET_CHAINID = 46630;

export const dataAdapter = {
  chainsList: (chains: API.Chain[]) => [
    ...chains.filter(
      (chain) => chain.network_infos.chain_id === X_LAYER_MAINNET_CHAINID,
    ),
    ...chains.filter(
      (chain) => chain.network_infos.chain_id !== X_LAYER_MAINNET_CHAINID,
    ),
  ],
};

export const chainFilter = {
  testnet: [
    ...TESTNET_WHITE_LIST.map((id) => ({ id })),
    { id: ADI_TESTNET_CHAINID },
    { id: X_LAYER_TESTNET_CHAINID },
    { id: ROBINHOOD_TESTNET_CHAINID },
  ],
};
