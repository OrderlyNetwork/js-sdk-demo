import React, { FC } from "react";
import {AccountInfo} from "@/components/common/accountInfo";

export const MainHeader: FC = () => {
  return <div className="flex flex-row items-center">
    <div className={'flex-1'}></div>
    <div>
      <AccountInfo/>
    </div>
  </div>;
};
