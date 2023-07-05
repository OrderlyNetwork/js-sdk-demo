import React, { FC } from 'react';

export enum FuturesTabsStatus {
	POSITIONS = 'POSITIONS',
	OPENORDER = 'OPENORDER',
	TRADINGHISTORY = 'TRADINGHISTORY',
}

interface Props {
	label: string;
	value: FuturesTabsStatus;
	active: boolean;
	disabled?: boolean;
	onClick: (value: FuturesTabsStatus) => void;
}

export const Tab: FC<Props> = (props) => {
	return (
		<button
			disabled={props.disabled}
			onClick={() => props.onClick(props.value)}
			className={
				props.active
					? `mx-2 py-2 text-primary font-bold active-tab`
					: 'mx-2 py-2 font-bold text-gray-500'
			}
		>
			{props.label}
		</button>
	);
};
