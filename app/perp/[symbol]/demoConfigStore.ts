import { ConfigKey, ConfigStore } from '@orderly.network/core';

type Options = {
    networkId: string;
};

type URLS = {
    apiBaseUrl: string;
    publicWsUrl: string;
    privateWsUrl: string;
    operatorUrl: string;
    // swapSupportApiUrl: string;
};

const API_URLS: { [key: string]: URLS } = {
    mainnet: {
        apiBaseUrl: "https://api-evm.orderly.org",
        publicWsUrl: "wss://ws-evm.orderly.org",
        privateWsUrl: "wss://ws-private-evm.orderly.org",
        operatorUrl: "https://operator-evm.orderly.org",
    },
    testnet: {
        apiBaseUrl: "https://testnet-api-evm.orderly.org",
        publicWsUrl: "wss://testnet-ws-evm.orderly.org",
        privateWsUrl: "wss://testnet-ws-private-evm.orderly.org",
        operatorUrl: "https://testnet-operator-evm.orderly.org",
    },
    //   dev: {},
};

export class DemoConfigStore implements ConfigStore {
    private map!: Map<string, any>;
    private marketsKey = "markets";
    constructor(networkId: string) {
        const urls = API_URLS[networkId];

        this.map = new Map<ConfigKey, any>([
            ["brokerId", "orderly"],
            ["env", "staging"],
            ["apiBaseUrl", urls["apiBaseUrl"]],
            ["publicWsUrl", urls["publicWsUrl"]],
            ["privateWsUrl", urls["privateWsUrl"]],
            ["operatorUrl", urls["operatorUrl"]],
            ["networkId", networkId],
            ["swapSupportApiUrl", "https://fi-api.woo.org"],
        ]);
    }
    get<T>(key: string): T {
        
        if (key === this.marketsKey) {
            const jsonStr = localStorage.getItem(this.marketsKey);
            if (jsonStr) {
                this.map.set(this.marketsKey, JSON.parse(jsonStr));
            } else {
                const defaultTab = { name: "Popular", id: 1 };
                this.set(this.marketsKey, {
                    recent: [],
                    favorites: [
                        { name: "PERP_ETH_USDC", tabs: [{ ...defaultTab }] },
                        { name: "PERP_BTC_USDC", tabs: [{ ...defaultTab }] },
                    ],
                    favoriteTabs: [{ ...defaultTab }]
                });
            }
        }
        return this.map.get(key);
    }
    getOr<T>(key: string, defaultValue: T): T {
        return this.map.get(key) ?? defaultValue;
    }
    set<T>(key: string, value: T): void {
        if (key === this.marketsKey) {
            const jsonStr = JSON.stringify(value);
            localStorage.setItem(this.marketsKey, jsonStr);
        }
        this.map.set(key, value);
    }
    clear(): void {
        throw new Error('Method not implemented.');
    }
}
