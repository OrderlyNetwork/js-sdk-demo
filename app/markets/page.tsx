'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { OrderlyConfig } from '../config';
import { useNav } from '../common/useNav';
import { CampaignPositionEnum, Scaffold } from '@orderly.network/ui-scaffold';

const View = dynamic(() => import('./view'), { ssr: false });

const MarketsPage: React.FC = () => {
	const { app } = OrderlyConfig();

	const { onRouteChange, mainMenus, campaigns, initialProduct, products } = useNav();
	return (
		<Scaffold
			footerProps={app.footerStatusBarProps}
			leftSidebar={null}
			mainNavProps={{
				mainMenus,
				products,
				initialProduct,
				initialMenu: '/markets',
				campaignPosition: CampaignPositionEnum.navTailing,
				campaigns,
			}}
			routerAdapter={{
				onRouteChange,
			}}
		>
			<div style={{ paddingBottom: 30 }}>
				<View />
			</div>
		</Scaffold>
	);
};

export default MarketsPage;
