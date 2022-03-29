import { IWallet } from './types';

declare global {
	interface Window extends IWallet {}
}
