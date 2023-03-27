import { OrderSide, OrderType } from 'orderly-sdk/lib/enums';

export interface OrderDTO {
	symbol: string;
	order_type: OrderType;
	side: OrderSide;
	order_price?: number;
	order_quantity?: number;
	order_amount?: number;
}

export interface OrderFormData {
	type: OrderType;
	side: OrderSide;
	price?: number;
	amount: number;
	symbol: string;
}

abstract class OrderCreator {
	abstract createOrder(formData: OrderFormData): OrderDTO;
	baseOrder(data: OrderFormData): OrderDTO {
		return {
			symbol: data.symbol,
			order_type: data.type,
			side: data.side,
		};
	}
}

export class LimitOrderCreator extends OrderCreator {
	createOrder(data: OrderFormData): OrderDTO {
		return {
			...this.baseOrder(data),
			order_price: data.price,
			order_quantity: data.amount,
		};
	}
}

abstract class QuantitySwitchOrderCreator extends OrderCreator {
	createOrder(data: OrderFormData): OrderDTO {
		// 卖单时
		const _data =
			data.side === OrderSide.SELL
				? {
						order_quantity: Number(data.amount),
				  }
				: {
						order_amount: Number(data.amount),
				  };
		return {
			...this.baseOrder(data),
			..._data,
		};
	}
}

// Market order creator
export class MarketOrderCreator extends QuantitySwitchOrderCreator {}

export class AskOrderCreator extends MarketOrderCreator {
	createOrder(data: OrderFormData): OrderDTO {
		const _data = super.createOrder(data);
		return {
			...this.baseOrder(data),
			..._data,
			// order_price: Number(data.price),
		};
	}
}

export class BidOrderCreator extends QuantitySwitchOrderCreator {
	createOrder(data: OrderFormData): OrderDTO {
		const _data = super.createOrder(data);
		return {
			...this.baseOrder(data),
			..._data,
			order_price: Number(data.price),
		};
	}
}

export class IOCOrderCreator extends QuantitySwitchOrderCreator {
	createOrder(data: OrderFormData): OrderDTO {
		const _data = super.createOrder(data);
		return {
			...this.baseOrder(data),
			..._data,
		};
	}
}

export class FOKOrderCreator extends LimitOrderCreator {}

export class PostOnlyOrderCreator extends LimitOrderCreator {}

export class OrderFactory {
	static createOrder(type: OrderType): OrderCreator | null {
		switch (type) {
			case OrderType.LIMIT:
				return new LimitOrderCreator();
			case OrderType.MARKET:
				return new MarketOrderCreator();
			case OrderType.ASK:
				return new AskOrderCreator();
			case OrderType.BID:
				return new BidOrderCreator();
			case OrderType.IOC:
				return new IOCOrderCreator();
			case OrderType.FOK:
				return new FOKOrderCreator();
			case OrderType.POST_ONLY:
				return new PostOnlyOrderCreator();

			default:
				return null;
		}
	}
}
