import React, { lazy, Suspense } from 'react';
import type { HeadFC, PageProps } from 'gatsby';
// import { store } from '@/store/store';
// import { Provider } from 'react-redux';
// import TradeMain from '@/components/trade/main';
import Loading from '@/components/trade/loading';
// import Loadable from '@loadable/component';

const TradeModule = lazy(() => import('@/components/trade/main'));
const IndexPage: React.FC<PageProps> = () => {
	const isSSR = typeof window === 'undefined';
	return (
		<>
			{!isSSR && (
				<Suspense fallback={<Loading />}>
					<TradeModule />
				</Suspense>
			)}
		</>
	);
};

export default IndexPage;

export const Head: HeadFC = () => <title>Orderly SDK Demo</title>;
