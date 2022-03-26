import { FC } from 'react';

// Import types
import { INetwork } from './type';

// Import styled components
import { NetworkWrapper, NetworkLabel, NetworkCurrency } from './NetworkStyled';

export const Network: FC<INetwork> = ({ network }) => {
	return (
		<NetworkWrapper>
			<NetworkLabel>Network</NetworkLabel>
			<NetworkCurrency>{network}</NetworkCurrency>
		</NetworkWrapper>
	);
};
