export declare class FungibleTokenClient {
    private accountId;
    private wallet;
    private networkId;
    constructor(wallet: any, accountId: any, networkId: any);
    getTokens(ftTokenContract: any): Promise<void | import("@near-wallet-selector/core").FinalExecutionOutcome>;
    deposit(amount: any, ftTokenContract: any): Promise<void | import("@near-wallet-selector/core").FinalExecutionOutcome>;
}
