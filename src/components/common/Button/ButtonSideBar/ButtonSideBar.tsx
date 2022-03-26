import { FC } from 'react';

// Import types
import { IButtonSideBar } from './types';

// Impoty styled component
import { ButtonSideBarWrapper, ButtonSideBarTitle } from './ButtonSideBarStyled';

export const ButtonSideBar: FC<IButtonSideBar> = ({ theme, title, onClick }) => {
	return (
		<ButtonSideBarWrapper onClick={onClick} theme={theme}>
			<ButtonSideBarTitle theme={theme}>{title}</ButtonSideBarTitle>
		</ButtonSideBarWrapper>
	);
};
