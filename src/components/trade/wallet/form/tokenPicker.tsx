import { selectTokens, Token } from "@/redux/assetSlice";
import { RootState } from "@/store/store";
import { Form } from "@douyinfe/semi-ui";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";

interface Props {}

const { Select } = Form;

export const TokenPicker = () => {
  const tokens = useSelector<RootState, Token[]>(selectTokens);
  const optionList = useMemo(() => {
    return tokens.map((token) => ({
      value: token.address,
      label: token.name,
    }));
  }, [tokens]);

  return (
    <Select
      field={"token"}
      className="w-full"
      size="large"
      rules={[{ required: true }]}
      placeholder="Select a token"
      optionList={optionList}
    ></Select>
  );
};
