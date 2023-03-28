import orderlyService from '@/service/orderlyService';
import { Form, Modal, Button, Toast } from '@douyinfe/semi-ui';
import clsx from 'clsx';
import React, { FC } from 'react';

interface Props {
	visible: boolean;
	onClose: () => void;
}

export const StorageDeposit: FC<Props> = (props) => {
	const [loading, setLoading] = React.useState(false);

	const balance = '-';

	const onSumbit = (values: any) => {
		// console.log(values);
		if (loading) return;
		setLoading(true);

		orderlyService.assetManager.storage
			.deposit(values.amount)
			.then((res) => {
				console.log(res);
			})
			.catch((e) => {
				// Toast.error(e.message);
			});
		// .finally(() => {
		// 	setLoading(false);
		// });
	};
	return (
		<Modal
			visible={props.visible}
			title={'Deposit'}
			onCancel={props.onClose}
			footer={null}
			maskClosable={false}
		>
			<Form onSubmit={onSumbit}>
				{({ formState, values, formApi }) => {
					return (
						<>
							<div className={'min-h-[100px]'}>
								<Form.Input
									field="amount"
									label="Ammout"
									size="large"
									rules={[{ required: true }]}
									placeholder="0.0"
									// placeholder="0.0 - 1.0"
									suffix={
										<button
											className={'px-2 hover:text-primary'}
											onClick={() => {
												console.log('click');
											}}
										>
											Max
										</button>
									}
								/>
								{/* <div
                className={clsx(
                  "flex flex-row justify-between text-gray-500",
                  token ? "visible" : "hidden"
                )}
              >
        
              </div> */}
							</div>
							<div className={'pb-8 mt-5'}>
								<Button
									disabled={
										!formState.errors ||
										!!formState.errors.amount ||
										!values.amount
									}
									loading={loading}
									htmlType="submit"
									block
									theme={'solid'}
									size="large"
								>
									Deposit
								</Button>
							</div>
						</>
					);
				}}
			</Form>
		</Modal>
	);
};
