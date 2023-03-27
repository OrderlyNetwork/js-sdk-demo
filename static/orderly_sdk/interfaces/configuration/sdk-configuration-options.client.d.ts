import { NearNetworkId } from '../../enums';
export interface SdkConfigurationOptionsClient {
    contractId: string;
    networkId?: keyof typeof NearNetworkId;
    debug?: boolean;
}
