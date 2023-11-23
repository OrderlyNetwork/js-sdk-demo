'use client';

import '@orderly.network/react/dist/styles.css';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// export function

const MainView = dynamic(() => import('./view'), { ssr: false });

export default function PerpPage({ params }: { params: { slug: string } }) {
	// const router = useRouter()
	console.log('params', params);

	return <MainView symbol="" onSymbolChange={(symbol) => {
		console.log('update symbol', symbol);
	}} />;
}
