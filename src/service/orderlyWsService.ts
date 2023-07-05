import { BehaviorSubject } from 'rxjs';

export interface WsTopic {
	id: string;
	[key: string]: any;
}

export class OrderlyWsService {
	private ws: WebSocket;
	private wsClient: any;
	private missedMessages: any[] = [];

	subject = new BehaviorSubject({});

	constructor(wsClient: any) {
		// console.log(wsClient);

		this.wsClient = wsClient;
		this.ws = wsClient.websocket as WebSocket;

		this.wsClient.setMessageCallback((message: any) => {
			this.subject.next(message);
		});

		// bind event
		this.ws.addEventListener('open', this.onOpen.bind(this));
	}

	subscribe(message: any) {
		console.log('****subscribe', message);
		if (this.ws.readyState === WebSocket.OPEN) {
			this.wsClient.sendSubscription(message);
		} else {
			this.missedMessages.push(message);
		}

		return this.subject;
	}

	unsubscribe(message: any) {
		this.wsClient.sendSubscription(message);
	}

	private onOpen() {
		if (this.missedMessages.length > 0) {
			while (this.missedMessages.length > 0) {
				const message = this.missedMessages.shift();

				this.subscribe(message);
			}
		}
	}
}
