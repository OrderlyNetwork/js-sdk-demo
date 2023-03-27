import React from 'react';
import { Spin } from '@douyinfe/semi-ui';

const Loading = () => {
	return (
		<div
			className={'w-screen h-screen flex flex-row justify-center items-center'}
		>
			<Spin />
		</div>
	);
};

export default Loading;
