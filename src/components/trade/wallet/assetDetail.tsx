import { TokenNum } from '@/components/common/tokenNum';
import { usePrivateWS } from '@/hooks/usePrivateWS';
import { selectAssets } from '@/redux/assetSlice';
import { selectTokensConfig, TokenInfo } from '@/redux/tradingSlice';
import type { RootState } from '@/store/store';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const AssetDetail = () => {
	const assets = useSelector(selectAssets);
	const tokensConfig = useSelector<RootState, Record<string, TokenInfo>>(
		selectTokensConfig,
	);

	const balances = usePrivateWS<any[]>(
		{
			id: 'clientID3',
			topic: 'balance',
			event: 'subscribe',
		},
		{
			dataFilter: (data) => {
				return data['topic'] === 'balance';
			},
			dataMap: (data) => data['data']?.['balances'] ?? [],
			defaultValue: [],
		},
	);

	console.log('******* asset', assets, balances);

	const allBalances = useMemo(() => {
		if (!balances) return assets;
		const keys = Object.keys(balances);

		if (keys.length === 0) return assets;

		return assets.map((asset: any) => {
			if (!tokensConfig) return [];
			const balance = balances[asset.name];
			const config = tokensConfig[asset.name];
			if (!balance) return asset;

			return {
				...asset,
				balance: {
					balance: (balance['holding'] ?? 0) * Math.pow(10, config.decimals),
					pending_transfer: asset.balance.pending_transfer,
				},
			};
		});

		return assets;
	}, [balances, assets, tokensConfig]);

	if (!tokensConfig) return null;

	return (
		<table className="w-full text-xs text-gray-500">
			<tbody>
				{allBalances.map((token, index) => {
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
