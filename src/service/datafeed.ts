// import { getTimeZoneCity } from '@/utils/date';
import type {
	DatafeedConfiguration,
	DomeCallback,
	ErrorCallback,
	GetMarksCallback,
	HistoryCallback,
	IBasicDataFeed,
	LibrarySymbolInfo,
	Mark,
	OnReadyCallback,
	ResolveCallback,
	SearchSymbolsCallback,
	ServerTimeCallback,
	SubscribeBarsCallback,
	TimescaleMark,
	Bar,
	PeriodParams,
	ResolutionString,
} from '@/static/charting_library/charting_library';
import orderlyService from './orderlyService';

export const Resolutions = [
	'1',
	// '3',
	'5',
	'15',
	'30',
	'60',
	'240',
	// '12h',
	// '1d',
	// '1w',
	// '1mon',
	// '1y',
	'1D',
	'1W',
	'1M',
];

const symbols = [
	'SPOT_AURORA_USDC',
	'SPOT_ETH_USDC',
	'SPOT_NEAR_USDC',
	'SPOT_REF_USDC',
	'SPOT_SWEAT_USDC',
	'SPOT_WBTC_USDC',
	'SPOT_WOO_USDC',
];

export class DataFeed implements IBasicDataFeed {
	// calculateHistoryDepth?(
	// 	resolution: string,
	// 	resolutionBack,
	// 	intervalBack: number,
	// ) {
	// 	throw new Error('Method not implemented.');
	// }
	getMarks?(
		symbolInfo: LibrarySymbolInfo,
		from: number,
		to: number,
		onDataCallback: GetMarksCallback<Mark>,
		resolution: string,
	): void {
		throw new Error('Method not implemented.');
	}
	getTimescaleMarks?(
		symbolInfo: LibrarySymbolInfo,
		from: number,
		to: number,
		onDataCallback: GetMarksCallback<TimescaleMark>,
		resolution: string,
	): void {
		throw new Error('Method not implemented.');
	}
	//   getServerTime?(callback: ServerTimeCallback): void {
	//     throw new Error("Method not implemented.");
	//   }
	searchSymbols(
		userInput: string,
		exchange: string,
		symbolType: string,
		onResult: SearchSymbolsCallback,
	): void {
		throw new Error('Method not implemented.');
	}
	resolveSymbol(
		symbolName: string,
		onResolve: ResolveCallback,
		onError: ErrorCallback,
	): void {
		const symbolArr = symbolName.split('_');
		const symbolInfo: LibrarySymbolInfo = {
			// name: `${symbolArr[1]}/${symbolArr[2]}`,
			name: symbolName,
			full_name: symbolName,
			// description: symbolName,
			description: `${symbolArr[1]}/${symbolArr[2]}`,
			type: 'crypto',
			session: '24x7',
			exchange: '',
			listed_exchange: '',
			pricescale: 100,
			minmov: 1,
			supported_resolutions:
				Resolutions as LibrarySymbolInfo['supported_resolutions'],
			has_intraday: true,
			// intraday_multipliers: Resolutions,
			has_daily: true,

			// has_weekly_and_monthly: true,
			// has_empty_bars: true,
			// has_no_volume: false,
			// visible_plots_set:
			// // volume_precision: Number(volumePrecision),
			// timezone: getTimeZoneCity() || 'Asia/Shanghai',
			timezone: 'Etc/UTC',
			format: 'price',
		};
		setTimeout(() => {
			onResolve(symbolInfo);
		}, 0);
	}
	getBars(
		symbolInfo: LibrarySymbolInfo,
		resolution: ResolutionString,
		periodParams: PeriodParams,
		onResult: HistoryCallback,
		onError: ErrorCallback,
	): void {
		// console.log(
		// 	'tradingview getBars ====>>>>>',
		// 	symbolInfo,
		// 	resolution,
		// 	periodParams,
		// );
		fetch(
			`https://api.orderly.org/tv/history?symbol=${symbolInfo.full_name}&resolution=${resolution}&from=${periodParams.from}&to=${periodParams.to}&countBack=${periodParams.countBack}`,
		)
			.then((res) => res.json())
			.then((res) => {
				// console.log(res);
				if (res.s !== 'ok') {
					onResult([], { noData: true });
					return;
				}
				const bars = res.t.map((t: number, index: number) => {
					return {
						open: res.o[index],
						high: res.h[index],
						low: res.l[index],
						close: res.c[index],
						time: t * 1000,
						volume: res.v[index],
					};
				});
				onResult(bars, { noData: false });
			});
		// orderlyService.api.trade
		// 	.getKline({
		// 		symbol: 'SPOT_NEAR_USDC',
		// 		type: '1d',
		// 		limit: periodParams.countBack,
		// 	})
		// 	.then((res) => {
		// 		onResult(
		// 			res.reverse().map((item) => {
		// 				// console.log(item);
		// 				return {
		// 					open: item.open,
		// 					high: item.high,
		// 					low: item.low,
		// 					close: item.close,
		// 					time: item.end_timestamp,
		// 					volume: item.volume,
		// 				};
		// 			}),
		// 			{
		// 				noData: !Array.isArray(res) || !res.length,
		// 			},
		// 		);
		// 	});
	}

	subscribeBars(
		symbolInfo: LibrarySymbolInfo,
		resolution: string,
		onTick: SubscribeBarsCallback,
		listenerGuid: string,
		onResetCacheNeededCallback: () => void,
	): void {
		// throw new Error('Method not implemented.');
	}
	unsubscribeBars(listenerGuid: string): void {
		// throw new Error('Method not implemented.');
	}
	subscribeDepth?(symbol: string, callback: DomeCallback): string {
		// throw new Error('Method not implemented.');
		return '';
	}
	unsubscribeDepth?(subscriberUID: string): void {
		// throw new Error('Method not implemented.');
	}
	onReady(callback: OnReadyCallback): void {
		// this._onReadyCallback = callback;
		const config: DatafeedConfiguration = {
			supported_resolutions: Resolutions,
			exchanges: [],
			symbols_types: [],
			supports_marks: false,
			supports_timescale_marks: false,

			// symbols_types: [
			// 	{ name: 'All types', value: '' },
			// 	{ name: 'Stock', value: 'stock' },
			// 	{ name: 'Index', value: 'index' },
			// ],
		};

		orderlyService.on('connected', () => {
			callback(config);
		});
	}
}
