'use client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { _orderlySymbolKey } from '../constant';

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
		<div className="flex items-center h-[48px] gap-x-[40px] ml-[60px]">
			{tabs.map((tab) => {
				return (
					<div
						key={tab.value}
						className={`${
							activeTab === tab.value ? 'text-[rgba(255,255,255,0.98)]' : 'text-[rgba(255,255,255,0.54)]'
						} hover:text-[rgba(255,255,255,0.98)]`}
						onClick={() => {
							onTabChange?.(tab);
						}}
					>
						{tab.title}
					</div>
				);
			})}
		</div>
	);
};

export default NavbarTab;
