import React, { FC, PropsWithChildren } from 'react';

interface Props {
	// chartView: React.ReactNode;
	ordersView: React.ReactNode;
	orderBookView: React.ReactNode;
}

const TradeBodyLayout: FC<PropsWithChildren<Props>> = (props) => {
	return (
		<div className={'grid grid-cols-[_1fr_300px] h-[calc(100vh-48px)]'}>
			<div className={'grid grid-rows-[_1fr_360px]'}>
				<div>{props.children}</div>
				<div>{props.ordersView}</div>
			</div>
			<div className={'border-l border-r border-solid'}>
				{props.orderBookView}
			</div>
		</div>
	);
};

export default TradeBodyLayout;
