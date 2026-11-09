import type { OrderlyAppProviderProps } from "@orderly.network/react-app";

export const dmmWidgetConfigs: OrderlyAppProviderProps["widgetConfigs"] = {
  subAccount: {
    maxSubAccountCount: 9999,
  },
  setting: {
    showOrderNotifications: true,
  },
};
