import dynamic from 'next/dynamic';
import './globals.css';
const OrderlyContainer = dynamic(() => import('./common/OrderlyContainer'), { ssr: false });

// export const metadata: Metadata = {
// 	title: 'Orderly SDK Demo',
// 	description: 'Orderly SDK Demo222'
// };

export const viewport = {
	minimumScale: 1.0,
	maximumScale: 1.0,
	userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" type="image/png" href="/apple-touch-icon.png" />
				<link rel="apple-touch-icon" type="image/png" sizes="16x16" href="/apple-touch-icon.png" />
				{/* <link rel="preconnect" href="https://fonts.gstatic.com" />
				<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
				<link
					href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700&family=Noto+Sans:wght@500;600;700&family=Oswald:wght@200;300;400;500;600;700;800&display=swap"
					rel="stylesheet"
				/> */}
			</head>
			<title id="orderly_sdk_demo_title_key">Orderly SDK Demo</title>
			<meta name="description" content="Orderly SDK Demo" />
			<body>
				<OrderlyContainer>{children}</OrderlyContainer>
			</body>
		</html>
	);
}
