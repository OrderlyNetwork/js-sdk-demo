import { FC } from 'react';

// Import types
import { ILogo } from './types';

// Import styled components
import { Logo } from './LogoStyled';

export const Logotype: FC<ILogo> = ({ url, alt }) => {
	return <Logo src={url} alt={alt} />;
};
