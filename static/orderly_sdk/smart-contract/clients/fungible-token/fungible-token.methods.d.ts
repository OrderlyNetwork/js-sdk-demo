import { DepositFungibleTokenRequest, GetTokensRequest } from '../../../interfaces/requests';
export declare const FungibleTokenContractMethodsList: {
    viewMethods: any[];
    changeMethods: string[];
};
export interface FungibleTokenContractMethods {
    get_tokens: (params: GetTokensRequest) => Promise<void>;
    ft_transfer_call: (params: DepositFungibleTokenRequest) => Promise<void>;
}
