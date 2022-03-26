import { IWallet } from 'types';

export interface IHeader {
	contractInfo: Pick<IWallet, 'contract' | 'walletConnection' | 'currentUser' | 'nearConfig'>;
}
