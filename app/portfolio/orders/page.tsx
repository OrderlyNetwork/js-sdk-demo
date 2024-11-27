'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { PortfolioLayout } from '../portfolioLayout';
const View = dynamic(() => import('./view'), { ssr: false });

const OrdersPage: React.FC = () => {
	return (
		<PortfolioLayout>
			<View />
		</PortfolioLayout>
	);
};

export default OrdersPage;
