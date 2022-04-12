// Import types
import { IWallet } from 'types';

export type TLogo = {
	src: string;
	alt?: string;
};

export interface IConnectWaller {
	connected?: boolean;
	logo: TLogo;
	walletBalance?: string;
	accountId?: string;
	onClick?: () => void;
}
