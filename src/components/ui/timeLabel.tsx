import dayjs from "dayjs";
import React, { FC, useMemo } from "react";

interface Props {
  format: string;
  value: number;
}

export const TimeLabel: FC<Props> = (props) => {
  const { format, value } = props;
  const txt = useMemo<string>(() => {
    return dayjs(value).format(format || "DD/MM/YYYY");
  }, [value, format]);
  return <span>{txt}</span>;
};
