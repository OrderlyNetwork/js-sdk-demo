import { IWallet } from 'types';

export interface ISideBar {
	contractInfo: Pick<IWallet, 'contract' | 'walletConnection' | 'currentUser' | 'nearConfig' | 'near'>;
}
