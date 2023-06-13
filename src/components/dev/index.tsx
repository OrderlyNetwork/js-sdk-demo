import React from 'react';
import { Switch } from '@douyinfe/semi-ui';
import orderlyService from '@/service/orderlyService';

export const Dev = () => {
	return (
		<div className="fixed left-2 bottom-2 bg-slate-600/80 p-3 text-white text-xs rounded-md min-w-[300px]">
			{/* <div>Dev</div> */}
			<table className="w-full">
				<tbody>
					<tr>
						<td>Orderly SDK Version</td>
						<td className="text-right">1.0.0</td>
					</tr>
				</tbody>
			</table>
			<div className={'font-bold mt-2'}>Polling</div>
			<table className="w-full">
				<tbody>
					<tr>
						<td>orderBook</td>
						<td className="text-right">
							<Switch size={'small'} />
						</td>
					</tr>
					<tr>
						<td>Disable frontend validation</td>
						<td className="text-right">
							<Switch size={'small'} />
						</td>
					</tr>
					<tr>
						<td>
							<input
								id="ws_topic"
								type="text"
								placeholder="topic"
								value="tickers"
								className="w-full p-1 text-black"
							/>
						</td>
						<td className="text-right">
							<button
								className="border border-white/50 rounded-md px-2 py-1 text-xs"
								onClick={() => {
									const value = (
										document.getElementById('ws_topic') as HTMLInputElement
									).value;
									if (!!value) {
										orderlyService.privateWs.sendSubscription({
											// id: 'client_id1',
											event: 'subscribe',
											// topic: 'SPOT_WOO_USDC@trade',
											topic: value,
										});
									}
								}}
							>
								subscribe
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};
