'use client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { _orderlySymbolKey } from '../constant';
import { useLocalStorage } from '@orderly.network/hooks';
import { NavSetting } from './navSetting';

export type Tab = {
	title: string;
	value: string;
};

export type NavbarTabProps = {
	activeTab?: string;
	onTabChange?: (tab: Tab) => void;
	tabs?: Tab[];
};

const NavbarTab: React.FC = () => {
	const [activeTab, setActiveTab] = useState('trade');
	const router = useRouter();
	const pathname = usePathname();

	const tabs = useMemo<Tab[]>(
		() => [
			{
				title: 'Trade',
				value: 'trade',
			},
			{
				title: 'Portfolio',
				value: 'portfolio',
			},
		],
		[],
	);

	const onTabChange = (tab: Tab) => {
		const symbol = localStorage.getItem(_orderlySymbolKey) ?? 'PERP_ETH_USDC';
		router.push(tab.value === 'trade' ? `/perp/${symbol}` : '/portfolio');
	};

	useEffect(() => {
		setActiveTab(pathname === '/portfolio' ? 'portfolio' : 'trade');
	}, [pathname]);

	return (
		<div className="orderly-flex orderly-items-center orderly-h-[48px] orderly-text-[13px] orderly-mr-2">
			{tabs.map((tab) => {
				return (
					<div
						key={tab.value}
						className={`${
							activeTab === tab.value
								? 'orderly-text-[rgba(255,255,255,0.98)]'
								: 'orderly-text-[rgba(255,255,255,0.54)]'
						} hover:orderly-text-[rgba(255,255,255,0.98)] orderly-cursor-pointer orderly-ml-[40px]`}
						onClick={() => {
							onTabChange?.(tab);
						}}
					>
						{tab.title}
					</div>
				);
			})}
			<div className='orderly-w-full'></div>
			<NavSetting />
		</div>
	);
};

export default NavbarTab;
