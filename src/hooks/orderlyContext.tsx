import { Toast } from '@douyinfe/semi-ui';
import React, {
	createContext,
	FC,
	PropsWithChildren,
	useEffect,
	useRef,
	useState,
} from 'react';
import { SWRConfig } from 'swr';

import { useInitiator } from './useInitiator';
import { OrdersQueryParams, useOrders } from './useOrders';
import { BehaviorSubject } from 'rxjs';

interface OrderlyContextState {
	//   assetManagerClient: AssetManagerClient;
	// authClient: AuthClient | undefined;
	orders$: BehaviorSubject<any>;
	queryOrders: (parmas: OrdersQueryParams) => void;
}

const OrderlyContext = createContext<OrderlyContextState>(
	{} as OrderlyContextState,
);

export const OrderlyProvider: FC<PropsWithChildren<any>> = (props) => {
	// const [authClient, setAuthClient] = useState<AuthClient>();
	useInitiator();
	const { order$, query } = useOrders();

	return (
		<OrderlyContext.Provider value={{ orders$: order$, queryOrders: query }}>
			<SWRConfig
				value={{
					onError: (error, key) => {
						Toast.error({ content: error.message, theme: 'light' });
					},
				}}
			>
				{props.children}
			</SWRConfig>
		</OrderlyContext.Provider>
	);
};

export default OrderlyContext;
