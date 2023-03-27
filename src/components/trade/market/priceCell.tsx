import React, { FC } from "react";

interface Props {
  value: string;
  label: string;
}

export const PriceCell: FC<Props> = (props) => {
  return (
    <div className="flex flex-col">
      <div className="text-xs text-black/75">{props.label}</div>
      <div>{props.value}</div>
    </div>
  );
};
