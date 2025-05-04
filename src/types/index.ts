export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export type ProductItem = {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
};

export type Order = {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
};

export type OrderRespose = {
	id: string;
	total: number;
};

type CardModel = {};
type OrderModel = {};

export type Main = {
	catalogItems: Map<string, CardModel>;
	order: OrderModel;
}

export interface IApi {
	readonly baseUrl: string;

	get(uri: string): Promise<object>;
	post(uri: string, data: object, method: ApiPostMethods): Promise<object>;
}

export interface IProductApi {
  GetProductItem(id: string): ProductItem;
	GetProductList(id: string): ProductItem[];
	PostOrder(orderBody: Order): OrderRespose;
}

export type EventName = string | RegExp;
export type Subscriber = Function;
export type EmitterEvent = {
	eventName: string;
	data: unknown;
};

export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}

export type Action = {
  onClick: (e: MouseEvent) => void;
};

export type Page = {
	headerBasket: HTMLElement;
	basketCounter: HTMLElement;
	gallery: HTMLElement;
	pageWrapper: HTMLElement;
}

export type Card = {
	cardImage?: HTMLImageElement;
	cardText?: HTMLElement;
	cardCategory?: HTMLElement;
	cardTitle: HTMLElement;
	cardPrice: HTMLElement;
	cardButton?: HTMLButtonElement;
	basketItemIndex?: HTMLElement; 
}

export type Modal = {
	modalСlose: HTMLButtonElement;
	modalContent: HTMLElement; 
}

export type Basket = {
	basketList: HTMLElement;
	basketPrice: HTMLElement;
	basketButton: HTMLButtonElement; 
}

export type Form = {
	submit: HTMLButtonElement;
	formErrors: HTMLElement;
}

export type PaymentForm = {
	cardBtn: HTMLButtonElement;
	cashBtn: HTMLButtonElement;
}

export type ContactsFormView = {}

export type SuccessView = {
	orderSuccessDescription: HTMLButtonElement;
	orderSuccessClose: HTMLButtonElement;
}