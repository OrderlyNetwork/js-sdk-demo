import { selectAccountLeverage } from '@/redux/appSlice';
import { Button, Modal } from '@douyinfe/semi-ui';
import clsx from 'clsx';
import React, { FC, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

// const COLORS = [
//     'bg-orange-50',
//     'bg-orange-100',
//     'bg-orange-200',
//     'bg-orange-300',
//     'bg-orange-400',
//     'bg-orange-500',
// ]

const Item: FC<{ value: number; index: number }> = (props) => {
	return (
		<div className="h-8 bg-orange-200 flex-1 hover:scale-110">{`${props.value}x`}</div>
	);
};

export const LeverageButton = () => {
	const [visible, setVisible] = React.useState(false);
	const leverage = useSelector(selectAccountLeverage);
	const [currentLerverage, setCurrentLerverage] = React.useState(1);

	useEffect(() => {
		setCurrentLerverage(leverage ?? 1);
	}, [leverage]);

	const onSelect = (value: number) => () => {
		setCurrentLerverage(value);
		// setVisible(false);
	};
	return (
		<>
			<button
				onClick={() => {
					setVisible(true);
				}}
				type="button"
				className="text-blue-600 border-b border-dashed border-gray-600"
			>
				{`${currentLerverage ?? 10}X`}
			</button>
			<Modal
				title="Adjust Leverage"
				visible={visible}
				onOk={() => {}}
				onCancel={() => {
					setVisible(false);
				}}
				footer={null}
				closeOnEsc={true}
			>
				<div className="text-gray-600">
					All eligible assets are counted as collateral for futures positions.
					You may adjust the maximum leverage below:
				</div>

				<div className="flex flex-row my-8 gap-1">
					<div
						onClick={onSelect(1)}
						className={clsx(
							'h-8  cursor-pointer transition-all flex-1 flex flex-col justify-center items-center hover:scale-110',
							currentLerverage >= 1 ? 'bg-orange-50' : 'bg-gray-100',
						)}
					>
						1x
					</div>
					<div
						onClick={onSelect(2)}
						className={clsx(
							'h-8 cursor-pointer transition-all flex-1 rounded flex flex-col justify-center items-center hover:scale-110',
							currentLerverage >= 2 ? 'bg-orange-100' : 'bg-gray-100',
						)}
					>
						2x
					</div>
					<div
						onClick={onSelect(3)}
						className={clsx(
							'h-8  cursor-pointer transition-all flex-1 rounded flex flex-col justify-center items-center hover:scale-110',
							currentLerverage >= 3 ? 'bg-orange-200' : 'bg-gray-100',
						)}
					>
						3x
					</div>
					<div
						onClick={onSelect(4)}
						className={clsx(
							'h-8  cursor-pointer transition-all flex-1 rounded flex flex-col justify-center items-center hover:scale-110 shadow-2xl',
							currentLerverage >= 4 ? 'bg-orange-300' : 'bg-gray-100',
						)}
					>
						4x
					</div>
					<div
						onClick={onSelect(5)}
						className={clsx(
							'h-8 cursor-pointer transition-all flex-1 rounded flex flex-col justify-center items-center hover:scale-110 shadow-2xl',
							currentLerverage >= 5 ? 'bg-orange-400' : 'bg-gray-100',
						)}
					>
						5x
					</div>
					<div
						onClick={onSelect(10)}
						className={clsx(
							'h-8 cursor-pointer transition-all flex-1 rounded flex flex-col justify-center items-center hover:scale-110 hover:bg-orange-500',
							currentLerverage == 10 ? 'bg-orange-500' : 'bg-gray-100',
						)}
					>
						10x
					</div>
					{/* <div className="h-8 bg-orange-500 flex-1 hover:scale-110">10x</div> */}
				</div>
				<div className="text-gray-600">
					For more detailed info, check our
					<a
						href="https://support.woo.org/hc/en-001/articles/4718459702169-Margin-and-Leverages"
						target="_black"
						className="mx-2 underline underline-offset-4 decoration-dotted"
					>
						Support Center
					</a>
				</div>

				<div className="py-5">
					<Button
						block
						theme="solid"
						size="large"
						onClick={() => {
							setVisible(false);
						}}
					>
						Confirm
					</Button>
				</div>
			</Modal>
		</>
	);
};
