import { RestClient, AuthClient } from 'orderly-sdk';
import mitt from 'mitt';

type NearNetworkId = 'testnet' | 'mainnet';
interface SdkConfigurationOptionsClient {
	contractId: string;
	networkId?: NearNetworkId; // "testnet" or "mainnet"
	// debug?: boolean; // For debug logs. Can be skipped.
}

class OrderlyService {
	private _apiClient!: RestClient;
	private readonly _authClient: AuthClient;
	private emitter = mitt();

	constructor(options: SdkConfigurationOptionsClient) {
		this._authClient = new AuthClient(options);
	}

	connect = async () => {
		if (typeof this._apiClient != 'undefined') {
			return;
		}
		await this._authClient.connect();
		this._apiClient = await this._authClient.restApi();
		this.emitter.emit('connected');
	};

	on = this.emitter.on;
	off = this.emitter.off;

	async isSignedIn() {
		if (typeof window == 'undefined') return false;
		const isSignedIn = await this._authClient.isSignedIn();
		if (isSignedIn) {
			return true;
		}
	}

	get account() {
		return this._authClient.accountId;
	}

	get client(): AuthClient {
		return this._authClient;
	}

	get api() {
		return this._apiClient;
	}

	// get contractClient() {
	//   return this._authClient.contractsApi();
	// }

	get assetManager() {
		return this._authClient.contractsApi();
	}

	get ftClient() {
		return this._authClient.ftClient();
	}
}

export default new OrderlyService({
	contractId: 'asset-manager.orderly.testnet',
	networkId: 'testnet',
});
