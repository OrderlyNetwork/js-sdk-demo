const DEFAULT_TESTNET_CHAIN_IDS = [
  421614, // Arbitrum Sepolia
  901901901, // Solana Devnet
  10143, // Monad Testnet
  11124, // Abstract Testnet
  97, // BSC Testnet
  904904904, // Sui Testnet
];

const ADI_TESTNET_CHAIN_ID = 99999;

export const chainFilter = {
  testnet: [
    ...DEFAULT_TESTNET_CHAIN_IDS.map((id) => ({ id })),
    { id: ADI_TESTNET_CHAIN_ID },
  ],
};
