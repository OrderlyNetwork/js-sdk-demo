import React, { useEffect } from "react";
import { Button } from "@douyinfe/semi-ui";
import OrderlyService from "@/service/orderlyService";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggedIn } from "@/redux/appSlice";
import {
  getPossibleTokens,
  getUserTokensBalance,
  setAsset,
} from "@/redux/assetSlice";
import { AssetDetail } from "./assetDetail";

import Actions from "./actions";

export const WalletPanel = () => {
  const isLoggedIn = useSelector(selectLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoggedIn) return;
    OrderlyService.assetManager.storage.balance().then((balance: any) => {
      dispatch(setAsset(balance));
    });

    dispatch(getPossibleTokens());
    dispatch(getUserTokensBalance());
  }, [isLoggedIn]);

  return (
    <div className="p-4">
      <div>Portfolio</div>
      <div className="mt-2 min-h-20">
        <AssetDetail />
      </div>
      <Actions />
    </div>
  );
};
