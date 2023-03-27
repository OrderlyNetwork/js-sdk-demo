import { selectLoggedIn } from "@/redux/appSlice";
import { fetchTradingPairs, getTokensInfo } from "@/redux/tradingSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// the app initiator
export const useInitiator = () => {
  const [initiator, setInitiator] = useState<string | undefined>(undefined);
  const isLoggedIn = useSelector(selectLoggedIn);

  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window == "undefined" || !isLoggedIn) return;
    // fetch trading pairs thunk;
    dispatch(fetchTradingPairs());
    dispatch(getTokensInfo());
  }, [isLoggedIn]);

  return initiator;
};
