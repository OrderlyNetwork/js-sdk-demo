import { selectBalances, selectTokens, Token } from "@/redux/assetSlice";
import orderlyService from "@/service/orderlyService";
import { RootState } from "@/store/store";
import { Button, Form, Modal, Toast } from "@douyinfe/semi-ui";
import clsx from "clsx";
import React, { FC } from "react";
import { useSelector } from "react-redux";
import { TokenPicker } from "./tokenPicker";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const DepositForm: FC<Props> = (props) => {
  const [loading, setLoading] = React.useState(false);

  // sumbit form
  const onSumbit = (values: any) => {
    // console.log(values);
    if (loading) return;
    setLoading(true);
    let request;
    if (values.token === "near") {
      request = orderlyService.assetManager.depositNEAR(values.amount);
    } else {
      request = orderlyService.ftClient.deposit(values.amount, values.token);
    }

    request
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        Toast.error(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const balances = useSelector<RootState, any>(selectBalances);
  const tokens = useSelector<RootState, Token[]>(selectTokens);

  return (
    <Modal
      visible={props.visible}
      title={"Deposit"}
      onCancel={props.onClose}
      footer={null}
      maskClosable={false}
    >
      <Form onSubmit={onSumbit}>
        {({ formState, values, formApi }) => {
          const token = tokens.length
            ? tokens.find((item) => item.address === values.token)
            : null;
          return (
            <>
              <div className={"min-h-[140px]"}>
                <TokenPicker />
                <Form.Input
                  field="amount"
                  label="Ammout"
                  size="large"
                  rules={[{ required: true }]}
                  placeholder="0.0 - 1.0"
                  suffix={
                    <button
                      className={"px-2 hover:text-primary"}
                      onClick={() => {
                        console.log("click");
                      }}
                    >
                      Max
                    </button>
                  }
                />
                <div
                  className={clsx(
                    "flex flex-row justify-between text-gray-500",
                    token ? "visible" : "hidden"
                  )}
                >
                  {/* <span>Available</span>
                  <span>{`${balances[values.token]?.balance ?? 0} ${
                    token?.name
                  }`}</span> */}
                </div>
              </div>
              <div className={"pb-8 mt-5"}>
                <Button
                  loading={loading}
                  htmlType="submit"
                  block
                  theme={"solid"}
                  size="large"
                >
                  Deposit
                </Button>
              </div>
            </>
          );
        }}
      </Form>
    </Modal>
  );
};
