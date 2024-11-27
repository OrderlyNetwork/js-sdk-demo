'use client';

import { PropsWithChildren, useMemo } from 'react';
import { OverviewModule, PortfolioLayoutWidget } from '@orderly.network/portfolio';
import { useNav } from '../common/useNav';
import { OrderlyConfig } from '../config';
import { CampaignPositionEnum } from '@orderly.network/ui-scaffold';
import { usePathname } from 'next/navigation';

export const PortfolioLayout = (props: PropsWithChildren<{}>) => {
	const { app } = OrderlyConfig();

    const pathname = usePathname();

	const { onRouteChange, mainMenus, campaigns, initialProduct, products } = useNav();

	const current = useMemo(() => {
        if (pathname.endsWith('/portfolio')) return '/portfolio';
        if (pathname.endsWith('/portfolio/fee')) return '/portfolio/feeTier';
        if (pathname.endsWith('/portfolio/api-key')) return '/portfolio/apiKey';
        return pathname.replace('en/', '');
    }, [pathname]);

    console.log("current is", current);
    

	return (
		<PortfolioLayoutWidget
			footerProps={app.footerStatusBarProps}
			// @ts-ignore
			leftSideProps={{
				current: current,
			}}
			// @ts-ignore
			mainNavProps={{
				mainMenus,
				products,
				initialMenu: '/portfolio',
				// @ts-ignore
				initialProduct,
				campaignPosition: CampaignPositionEnum.navTailing,
				campaigns,
			}}
			routerAdapter={{
				onRouteChange,
				currentPath: current,
			}}
		>
			{props.children}
		</PortfolioLayoutWidget>
	);
};
