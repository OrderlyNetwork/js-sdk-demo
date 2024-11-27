'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { PortfolioLayout } from '../layout';
const View = dynamic(() => import('./view'), { ssr: false });

const APIKeyPage: React.FC = () => {
	return (
		<PortfolioLayout>
			<View />
		</PortfolioLayout>
	);
};

export default APIKeyPage;
