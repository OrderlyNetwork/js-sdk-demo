'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { PortfolioLayout } from '../portfolioLayout';
const View = dynamic(() => import('./view'), { ssr: false });

const FeeTierPage: React.FC = () => {
	return (
		<PortfolioLayout>
			<View />
		</PortfolioLayout>
	);
};

export default FeeTierPage;
