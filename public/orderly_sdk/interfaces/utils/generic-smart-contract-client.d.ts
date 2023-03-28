import { Contract, ContractMethods } from 'near-api-js/lib/contract';
import { NearNetworkId } from '../../enums/near-network-id.enum';
import { SDKConfigurationOptions } from '../../interfaces/configuration';
import { GenericClient } from './generic-client';
export declare abstract class GenericSmartContractClient<T> extends GenericClient {
    protected contractName: string;
    protected contractMethods: ContractMethods;
    protected sdkConfig: SDKConfigurationOptions;
    protected nearAccount: any;
    protected managerContract: any;
    networkId: NearNetworkId;
    private near;
    private keyStore;
    private account;
    private contract;
    constructor(clientName: string, contractName: string, contractMethods: ContractMethods, sdkConfig: SDKConfigurationOptions, nearAccount: any, managerContract: any);
    protected _connect(): Promise<void>;
    private createKeyStore;
    protected getContract(): Contract & T;
}
