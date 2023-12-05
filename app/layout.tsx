import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Orderly SDK Demo',
	description: 'Orderly SDK Demo'
};

export const viewport = {
	minimumScale: 1.0,
	maximumScale: 1.0,
	userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<link rel='icon' type='image/png' href='/apple-touch-icon.png' />
				<link rel='apple-touch-icon' type='image/png' sizes='16x16' href='/apple-touch-icon.png' />
			</head>
			<body className={inter.className}>{children}</body>
		</html>
	);
}
