import {
  AssetState,
  selectAssets,
  selectBalances,
  selectTokens,
  Token,
} from "@/redux/assetSlice";
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

export const WithdrawForm: FC<Props> = (props) => {
  const [loading, setLoading] = React.useState(false);

  const assets = useSelector(selectAssets);

  const onSumbit = (values: any) => {
    // console.log(values);
    if (loading) return;
    setLoading(true);
    orderlyService.assetManager
      .withdraw({
        token: values.token,
        amount: values.amount,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        Toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      visible={props.visible}
      title={"Withdraw"}
      onCancel={props.onClose}
      footer={null}
      maskClosable={false}
    >
      <Form
        onSubmit={onSumbit}
        initValues={{
          token: "",
          amount: 0,
        }}
      >
        {({ formState, values, formApi }) => {
          const asset = assets.find((item) => item.address === values.token);

          return (
            <>
              <div className={"min-h-[140px]"}>
                <TokenPicker />
                <Form.Input
                  field="amount"
                  label="Ammout"
                  size="large"
                  rules={[{ required: true }]}
                  suffix={
                    <button
                      className={"px-2 hover:text-primary"}
                      disabled={asset?.balance.balance <= 0}
                      onClick={() => {
                        // console.log("click");
                        formApi.setValue("amount", asset?.balance.balance);
                      }}
                    >
                      Max
                    </button>
                  }
                />
                <div
                  className={clsx(
                    "flex flex-row justify-between text-gray-500",
                    asset ? "visible" : "hidden"
                  )}
                >
                  <span>Available</span>
                  {/* <span>-- NEAR</span> */}
                  <span>{`${asset?.balance.balance ?? 0} ${asset?.name}`}</span>
                </div>
              </div>
              <div className={"pb-8 mt-5"}>
                <Button
                  loading={loading}
                  htmlType="submit"
                  block
                  theme={"solid"}
                  size="large"
                  disabled={!asset || asset.balance.balance <= 0}
                >
                  Withdraw
                </Button>
              </div>
            </>
          );
        }}
      </Form>
    </Modal>
  );
};
