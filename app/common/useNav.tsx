import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { _orderlySymbolKey } from '../constant';


export const useNav = () => {

    const router  = useRouter();
    const campaigns = useMemo(() => {
        // return {
        //     name: 'Rewards',
        //     href: '/rewards',
        //     icon: `${process.env.PUBLIC_URL}/images/reward.gif`,
        //     testid: 'oui-testid-main-nav-rewards',
        //     children: [
        //         {
        //             name: 'Trading rewards',
        //             href: '/rewards/trading',
        //             description: 'Trade with WOOFi Pro to earn ORDER',
        //             icon: <TradingRewardsIcon size={16} />,
        //             activeIcon: <TradingRewardsActiveIcon size={16} />,
        //             testid: 'oui-testid-main-nav-rewards-item-tradingRewards',
        //         },
        //         {
        //             name: 'Affiliate',
        //             href: '/rewards/affiliate',
        //             tag: '60% Rebate',
        //             description: 'Earn more as a WOOFi affiliate',
        //             icon: <AffiliatesIcon size={16} />,
        //             activeIcon: <AffiliatesActiveIcon size={16} />,
        //             testid: 'oui-testid-main-nav-rewards-item-affiliate',
        //         },
        //     ],
        // };
        return undefined;
    }, []);
    const mainMenus = useMemo(() => {
        return [
            { name: 'Trading', href: '/trade' },
            { name: 'Portfolio', href: '/portfolio' },
            { name: 'Markets', href: '/markets' },
        ];
    }, []);

    const products = useMemo(() => {
        // return [
        //     { name: 'Spot', href: '/swap' },
        //     { name: 'Perps', href: '/perps' },
        // ];
        return undefined;
    }, []);

    const initialProduct = '/perps';

    const onRouteChange = (option: any) => {

        console.log("on route change", option);
        
        if (option.target === '_blank') {
            window.open(option.href);
            return;
        }

        if (option.href === "/trade") {
            const symbol = localStorage.getItem(_orderlySymbolKey);
            router.push(`/perp/${symbol}`);
            return;
        }

        router.push(option.href);
    };
    return {
        mainMenus,
        campaigns,
        products,
        initialProduct,
        onRouteChange,
    };
};
