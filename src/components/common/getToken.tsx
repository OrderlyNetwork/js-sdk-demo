import { selectLoggedIn } from "@/redux/appSlice";
import orderlyService from "@/service/orderlyService";
import { IconGift } from "@douyinfe/semi-icons";
import { Button, Toast } from "@douyinfe/semi-ui";
import React from "react";
import { useSelector } from "react-redux";

export const GetToken = () => {
  const isLogged = useSelector(selectLoggedIn);
  const onClick = () => {
    if (!isLogged) {
      Toast.warning("Please connect wallet first");
      return;
    }

    orderlyService.ftClient.getTokens("ft-faucet-usdc.orderly.testnet");
  };
  return (
    <Button
      type="tertiary"
      icon={<IconGift />}
      onClick={onClick}
      theme={"borderless"}
    >
      Get 1,000 test USDC
    </Button>
  );
};
