import { Toast } from "@douyinfe/semi-ui";
import React, {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import { SWRConfig } from "swr";

import { useInitiator } from "./useInitiator";

interface OrderlyContextState {
  //   assetManagerClient: AssetManagerClient;
  // authClient: AuthClient | undefined;
}

const OrderlyContext = createContext<OrderlyContextState>(
  {} as OrderlyContextState
);

export const OrderlyProvider: FC<PropsWithChildren<any>> = (props) => {
  // const [authClient, setAuthClient] = useState<AuthClient>();
  useInitiator();

  return (
    <OrderlyContext.Provider value={{}}>
      <SWRConfig
        value={{
          onError: (error, key) => {
            Toast.error({ content: error.message, theme: "light" });
          },
        }}
      >
        {props.children}
      </SWRConfig>
    </OrderlyContext.Provider>
  );
};

export default OrderlyContext;
