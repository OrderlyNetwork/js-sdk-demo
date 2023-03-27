import React, { FC, useMemo } from "react";
import Decimal from "decimal.js-light";

interface Props {
  value: number;
  decimal?: number;
  dp?: number;
}

export const TokenNum: FC<Props> = (props) => {
  const t = useMemo(() => {
    try {
      if (Number.isNaN(props.value * 0)) {
        return props.value;
      }

      if (props.value === 0) {
        return "0";
      }
      let d = new Decimal(props.value);
      //   let v:Decimal;
      if (typeof props.decimal !== "undefined") {
        d = d.div(Math.pow(10, props.decimal));
      }

      if (typeof props.dp === "undefined") {
        d.toFixed();
      }
      return d.toFixed(props.dp, 1);
    } catch (e) {
      console.log("errr:::", props.value, props.decimal, props.dp, e);
    }
  }, [props.value, props.decimal]);

  return <span>{t}</span>;
};
