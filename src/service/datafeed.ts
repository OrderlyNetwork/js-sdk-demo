import { getTimeZoneCity } from '@/utils/date';
import {
	DatafeedConfiguration,
	DomeCallback,
	ErrorCallback,
	GetMarksCallback,
	HistoryCallback,
	HistoryDepth,
	IBasicDataFeed,
	LibrarySymbolInfo,
	Mark,
	OnReadyCallback,
	ResolutionBackValues,
	ResolveCallback,
	SearchSymbolsCallback,
	ServerTimeCallback,
	SubscribeBarsCallback,
	TimescaleMark,
} from 'static/charting_library/charting_library.min';
import orderlyService from './orderlyService';

export const Resolutions = [
	'1',
	'3',
	'5',
	'15',
	'30',
	'60',
	'120',
	'180',
	'240',
	'480',
	// '1D',
	// '1W',
	// '1M',
];

export class DataFeed implements IBasicDataFeed {
	calculateHistoryDepth?(
		resolution: string,
		resolutionBack: ResolutionBackValues,
		intervalBack: number,
	): HistoryDepth | undefined {
		throw new Error('Method not implemented.');
	}
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
		const symbolInfo: LibrarySymbolInfo = {
			name: symbolName,
			full_name: symbolName,
			description: symbolName,
			type: 'index',
			session: '24x7',
			exchange: '',
			listed_exchange: '',
			// ticker: symbolName,
			// // pricescale: Math.pow(10, this.config.getCurrentPricePrecision?.(symbolName)),
			pricescale: 100,
			minmov: 1,
			supported_resolutions:
				Resolutions as LibrarySymbolInfo['supported_resolutions'],
			has_intraday: true,
			intraday_multipliers: Resolutions,
			has_daily: true,
			has_weekly_and_monthly: true,
			has_empty_bars: true,
			has_no_volume: false,
			// // volume_precision: Number(volumePrecision),
			// timezone: getTimeZoneCity() || 'Asia/Shanghai',
			timezone: 'Asia/Shanghai',
			format: 'price',
		};
		setTimeout(() => {
			onResolve(symbolInfo);
		}, 0);
	}
	getBars(
		symbolInfo: LibrarySymbolInfo,
		resolution: string,
		rangeStartDate: number,
		rangeEndDate: number,
		onDataCallback: HistoryCallback,
		onError: ErrorCallback,
		isFirstCall: boolean,
	): void {
		console.log('tradingview getBars ====>>>>>', symbolInfo, resolution);
		// onDataCallback([], { noData: true });
		//   const { symbol, exchange } = symbolInfo;
		//   const params = {
		//     symbol,
		//     exchange,
		//     resolution,
		//     from: rangeStartDate,
		//     to: rangeEndDate,
		//   };
		// orderlyService.api.trade.getKline(params).then((res) => {});
		//   this.api
		//     .getKline(params)
		//     .then((res) => {
		//       const data = res.data;
		//       const bars = data.map((item) => {
		//         return {
		//           time: item[0],
		//           low: item[1],
		//           high: item[2],
		//           open: item[3],
		//           close: item[4],
		//           volume: item[5],
		//         };
		//       });
		//       onResult(bars, { noData: false });
		//     })
		//     .catch((err) => {
		//       console.log(err);
		//       onError(err);
		//     });
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
