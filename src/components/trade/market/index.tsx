import React from 'react';
import { SymbolPicker } from '@/components/trade/market/symbolPicker';
import { Prices } from './prices';

const MarketPrice = () => {
	return (
		<div
			className={
				'h-[60px] flex flex-row items-center px-2 border-b border-solid'
			}
		>
			<SymbolPicker />

			<Prices />
		</div>
	);
};

export default MarketPrice;
