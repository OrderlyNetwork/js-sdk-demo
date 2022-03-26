import { AccountBalance } from 'near-api-js/lib/account';

export interface IAssetsBlock {
	balance: Pick<AccountBalance, 'total' | 'available'>;
}
