import { RestClient, AuthClient } from '@orderly.network/orderly-sdk';
import mitt from 'mitt';
import { OrderlyWsService } from './orderlyWsService';

type NearNetworkId = 'testnet' | 'mainnet';
interface SdkConfigurationOptionsClient {
	contractId: string;
	networkId?: NearNetworkId; // "testnet" or "mainnet"
	// debug?: boolean; // For debug logs. Can be skipped.
}

class OrderlyService {
	private _apiClient!: RestClient;
	private _wsClientPublic!: any;
	private _wsClientPrivate!: any;
	private readonly _authClient: AuthClient;
	private emitter = mitt();
	private _publicWsService: OrderlyWsService;
	private _privateWsService?: OrderlyWsService;

	constructor(options: SdkConfigurationOptionsClient) {
		this._authClient = new AuthClient(options);
		this._wsClientPublic = this._authClient.wsClientPublic();
		this._wsClientPublic.connect();
		this._publicWsService = new OrderlyWsService(this._wsClientPublic);
		console.log('create public ws');
	}

	connect = async () => {
		if (typeof this._apiClient != 'undefined') {
			return;
		}
		await this._authClient.connect();
		this._apiClient = await this._authClient.restApi();
		this._wsClientPrivate = this._authClient.wsClientPrivate();

		this._wsClientPrivate.connectPrivate();

		this.emitter.emit('connected');
	};

	on = this.emitter.on;
	off = this.emitter.off;

	async isSignedIn() {
		if (typeof window == 'undefined') return false;
		return this._authClient.isSignedIn();
		// const isSignedIn = await this._authClient.isSignedIn();
		// if (isSignedIn) {
		// 	return true;
		// }
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

	get privateWs() {
		// return this._wsClient;
		return this._privateWsService
			? this._privateWsService
			: (this._privateWsService = new OrderlyWsService(
					new Proxy(this._wsClientPrivate, handler),
			  ));
	}

	get publicWs() {
		return this._publicWsService;
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

const handler = {
	apply: function (target: any, thisArg: any, argumentsList: any) {
		console.log('target', target, thisArg, argumentsList);
	},
	get: function (target, property, receiver) {
		// console.log('======target', target);
		// return Reflect.get(target, property, receiver);
		switch (property) {
			case 'websocket':
				return target.privateWebsocket;
			case 'setMessageCallback':
				return target.setPrivateMessageCallback;
			case 'sendSubscription':
				return Reflect.get(target, 'sendPrivateSubscription', receiver);
			default:
				return Reflect.get(target, property, receiver);
			// return target.sendPrivateSubscription;
		}
	},
};

export default new OrderlyService({
	contractId: 'asset-manager.orderly.testnet',
	networkId: 'testnet',
});
