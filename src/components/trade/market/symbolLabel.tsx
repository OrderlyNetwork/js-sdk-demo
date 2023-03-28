import { TradingPair } from '@/redux/tradingSlice';
import { IconChevronDown } from '@douyinfe/semi-icons';
import { Skeleton } from '@douyinfe/semi-ui';
import React, { FC, useMemo } from 'react';

interface Props {
	tradingPair?: TradingPair;
	loading: boolean;
	open: boolean;
}

export const SymbolLabel: FC<Props> = (props) => {
	const { tradingPair, loading, open } = props;

	const placeholder = useMemo(() => {
		return (
			<div className="h-full flex flex-row w-[260px] items-center px-3">
				<Skeleton.Title />
			</div>
		);
	}, []);

	return (
		<Skeleton
			loading={loading}
			active
			placeholder={placeholder}
			className="h-full"
		>
			<div
				className={
					'h-full flex flex-row min-w-[220px] items-center justify-between cursor-pointer px-3'
				}
			>
				<div className="flex flex-row justify-center pr-2">
					<strong className={'text-xl'}>{`${tradingPair?.quote}`}</strong>
					<strong
						className={'text-xl text-gray-400'}
					>{`/${tradingPair?.base}`}</strong>
				</div>

				<IconChevronDown
					className="transition-transform"
					style={{ transform: `rotate(${open ? '180deg' : '0deg'})` }}
				/>
			</div>
		</Skeleton>
	);
};
