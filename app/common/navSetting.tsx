import { useLocalStorage } from '@orderly.network/hooks';
import { Switch, Divider, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@orderly.network/react';

export const NavSetting = () => {
	const [subOrder, setSubOrder] = useLocalStorage('orderly_subscribe_order', true);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<div className='orderly-h-[48px] orderly-flex  orderly-items-center'>
                    <SettingIcon />
                </div>
			</DropdownMenuTrigger>
			<DropdownMenuContent onOpenAutoFocus={(e: any) => e.preventDefault()} onCloseAutoFocus={(e: any) => e.preventDefault()} className="orderly-p-4 orderly-w-[220px] orderly-text-xs">
				<div>
					<div className='orderly-text-base-contrast-80'>Settings</div>
					<Divider className='orderly-my-4'/>
					<div className="orderly-flex orderly-mx-2 orderly-gap-2 orderly-justify-between">
                        <div>Order update</div>
						<Switch
							color={'primary'}
							checked={subOrder}
							onCheckedChange={(checked: boolean) => {
								setSubOrder(checked);
							}}
						/>
					</div>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const SettingIcon = () => {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="white"
			fillOpacity="0.98"
			xmlns="http://www.w3.org/2000/svg"
			className="orderly-fill-white/50 hover:orderly-fill-white"
		>
			<mask id="mask0_6127_8179" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
				<rect width="20" height="20" fill="#D9D9D9" />
			</mask>
			<g mask="url(#mask0_6127_8179)">
				<path d="M7.64583 18.3333L7.33333 15.7083C7.19444 15.625 7.04167 15.5347 6.875 15.4375C6.70833 15.3402 6.55556 15.25 6.41667 15.1666L3.97917 16.1875L1.625 12.125L3.70833 10.5416V9.45829L1.625 7.87496L3.97917 3.81246L6.41667 4.83329C6.55556 4.74996 6.70833 4.65968 6.875 4.56246C7.04167 4.46524 7.19444 4.37496 7.33333 4.29163L7.64583 1.66663H12.3542L12.6667 4.29163C12.8056 4.37496 12.9583 4.46524 13.125 4.56246C13.2917 4.65968 13.4444 4.74996 13.5833 4.83329L16.0208 3.81246L18.375 7.87496L16.3125 9.45829V10.5416L18.375 12.125L16.0208 16.1875L13.5833 15.1666C13.4444 15.25 13.2917 15.3402 13.125 15.4375C12.9583 15.5347 12.8056 15.625 12.6667 15.7083L12.3542 18.3333H7.64583ZM10 12.9791C10.8194 12.9791 11.5208 12.6875 12.1042 12.1041C12.6875 11.5208 12.9792 10.8194 12.9792 9.99996C12.9792 9.18051 12.6875 8.47913 12.1042 7.89579C11.5208 7.31246 10.8194 7.02079 10 7.02079C9.18055 7.02079 8.47917 7.31246 7.89583 7.89579C7.3125 8.47913 7.02083 9.18051 7.02083 9.99996C7.02083 10.8194 7.3125 11.5208 7.89583 12.1041C8.47917 12.6875 9.18055 12.9791 10 12.9791Z" />
			</g>
		</svg>
	);
};
