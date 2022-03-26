type TButtonSideBarTheme = {
	dark: boolean;
};

export interface IButtonSideBar {
	theme: TButtonSideBarTheme;
	title: string;
	onClick?: () => void;
}
