import Loading from '@/components/trade/loading';
import { setTradingType } from '@/redux/tradingSlice';
import { HeadFC, PageProps } from 'gatsby';
import React, { Suspense, lazy, useEffect } from 'react';
import { useDispatch } from 'react-redux';

const FuturesModule = lazy(() => import('@/components/futures/main'));

const IndexPage: React.FC<PageProps> = (props) => {
	const isSSR = typeof window === 'undefined';

	return (
		<>
			{!isSSR && (
				<Suspense fallback={<Loading />}>
					<FuturesModule />
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
