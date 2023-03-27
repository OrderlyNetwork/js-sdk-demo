import { IconTreeTriangleDown } from "@douyinfe/semi-icons";
import { Button, Dropdown } from "@douyinfe/semi-ui";
import { DropDownMenuItem } from "@douyinfe/semi-ui/lib/es/dropdown";
import { OrderType } from "orderly-sdk/lib/enums";
import React, { FC, useMemo } from "react";

interface Props {
  value: OrderType;
  onChange: (type: OrderType) => void;
}

export const OrderTypeField: FC<Props> = (props) => {
  const { value, onChange } = props;

  const expandMenu = useMemo<DropDownMenuItem[]>(() => {
    return [
      OrderType.ASK,
      OrderType.BID,
      OrderType.FOK,
      OrderType.IOC,
      OrderType.POST_ONLY,
    ].map((type) => {
      return {
        node: "item",
        name: type,
        onClick: () => onChange(type),
        active: type === value,
      };
    });
  }, [value]);

  const expandActiveLable = useMemo(() => {
    switch (value) {
      case OrderType.LIMIT:
      case OrderType.MARKET:
        return "ASK";

      default:
        return value;
    }
  }, [value]);

  return (
    <div className="mt-2">
      <div className="flex flex-row gap-1">
        <Button
          theme="borderless"
          type={value === OrderType.LIMIT ? "primary" : "tertiary"}
          onClick={() => onChange(OrderType.LIMIT)}
        >
          Limit
        </Button>
        <Button
          theme="borderless"
          type={value === OrderType.MARKET ? "primary" : "tertiary"}
          onClick={() => onChange(OrderType.MARKET)}
        >
          Market
        </Button>
        <Dropdown
          trigger="click"
          position="bottomLeft"
          menu={expandMenu}
          clickToHide
          showTick
        >
          <Button
            theme="borderless"
            type={
              ![OrderType.LIMIT, OrderType.MARKET].includes(props.value)
                ? "primary"
                : "tertiary"
            }
            iconPosition="right"
            icon={<IconTreeTriangleDown size="small" />}
            // onClick={() => onChange(OrderType.ASK)}
          >
            {expandActiveLable}
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};
