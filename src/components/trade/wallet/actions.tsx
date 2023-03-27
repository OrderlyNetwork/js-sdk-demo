import React from "react";
import { Button } from "@douyinfe/semi-ui";
import { DepositForm } from "@/components/trade/wallet/form/deposit";
import { WithdrawForm } from "./form/withdraw";
import { useSelector } from "react-redux";
import { selectLoggedIn } from "@/redux/appSlice";

type ModalType = "withdraw" | "deposit" | "none";

const Actions = () => {
  const [visible, setVisible] = React.useState<ModalType>("none");
  const isLoggedIn = useSelector(selectLoggedIn);
  const onClose = () => {
    setVisible("none");
  };
  return (
    <>
      <div className="flex flex-row gap-2 justify-center mt-6">
        <Button
          className="flex-1"
          disabled={!isLoggedIn}
          onClick={() => {
            setVisible("withdraw");
          }}
        >
          Withdraw
        </Button>
        <Button
          disabled={!isLoggedIn}
          className="flex-1"
          onClick={() => {
            setVisible("deposit");
          }}
        >
          Deposit
        </Button>
      </div>
      <DepositForm visible={visible === "deposit"} onClose={onClose} />
      <WithdrawForm visible={visible === "withdraw"} onClose={onClose} />
    </>
  );
};

export default Actions;
