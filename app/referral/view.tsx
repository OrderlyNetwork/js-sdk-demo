import React from 'react';
import { Referral } from '@orderly.network/referral';
import ReferralContainer from '../common/ReferralContainer';

const View: React.FC = () => {
	return <ReferralContainer>
        <Referral />
    </ReferralContainer>;
};

export default View;
