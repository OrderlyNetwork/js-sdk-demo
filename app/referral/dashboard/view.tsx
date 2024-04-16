import React from 'react';
import { Dashboard } from '@orderly.network/referral';
import ReferralContainer from '../../common/ReferralContainer';

const View: React.FC = () => {
	return <ReferralContainer>
        <Dashboard />
    </ReferralContainer>;
};

export default View;
