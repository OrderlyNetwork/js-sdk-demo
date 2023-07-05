import React, { lazy, Suspense, useEffect, useLayoutEffect } from 'react';
import type { HeadFC, PageProps } from 'gatsby';
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

export const Head: HeadFC = () => (
	<>
		<title>Orderly SDK Demo</title>
		<script src="/charting_library/charting_library.standalone.js"></script>
	</>
);
