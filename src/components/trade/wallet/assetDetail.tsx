import { TokenNum } from "@/components/common/tokenNum";
import { selectAssets } from "@/redux/assetSlice";
import { selectTokensConfig, TokenInfo } from "@/redux/tradingSlice";
import type { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";

export const AssetDetail = () => {
  const asset = useSelector(selectAssets);
  const tokensConfig = useSelector<RootState, Record<string, TokenInfo>>(
    selectTokensConfig
  );

  if (!tokensConfig) return null;

  return (
    <table className="w-full text-xs text-gray-500">
      <tbody>
        {asset.map((token, index) => {
          return (
            <tr key={index}>
              <td>{token.name}</td>

              <td className="text-right">
                <TokenNum
                  value={token.balance.balance || 0}
                  decimal={tokensConfig[token.name]?.decimals}
                  dp={tokensConfig[token.name]?.minimum}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
