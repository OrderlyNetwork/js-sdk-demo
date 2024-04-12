import React from 'react';
import OrderlyContainer from '../common/OrderlyContainer';
import { Portfolio } from '@orderly.network/react';

const View: React.FC = () => {
	return (
		<OrderlyContainer>
			<Portfolio />
		</OrderlyContainer>
	);
};

export default View;
