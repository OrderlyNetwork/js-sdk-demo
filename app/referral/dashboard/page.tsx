'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import '@orderly.network/react/dist/styles.css';
import '@orderly.network/referral/dist/styles.css';

const View = dynamic(() => import('./view'), { ssr: false });

const DashboardPage: React.FC = () => {
	return <View />;
};

export default DashboardPage;
