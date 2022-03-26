// Import types
import { IWallet } from 'types';

export type TLogo = {
	src: string;
	alt?: string;
};

export interface IConnectWaller {
	connected?: boolean;
	logo: TLogo;
	wallet: Pick<IWallet, 'wallet_address' | 'wallet_name' | 'wallet_currency' | 'total_balance' | 'walletConnection'>;
	onClick?: () => void;
}
