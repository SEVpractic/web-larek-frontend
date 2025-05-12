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

export type Main = {
	catalogItems: Map<string, ProductItem>;
	order: string | null;
	preview: Order;
}

export interface IApi {
	readonly baseUrl: string;

	get(uri: string): Promise<object>;
	post(uri: string, data: object, method: ApiPostMethods): Promise<object>;
}

export interface IProductApi {
  getProductItem(id: string): Promise<ProductItem>;
	getProductList(): Promise<ProductItem[]>;
	postOrder(orderBody: Order): Promise<OrderRespose>;
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
	payment: string;
  address: string;
	cardBtn: HTMLButtonElement;
	cashBtn: HTMLButtonElement;
}

export type ContactsFormView = {
	email: string;
	phone: string;
}

export type SuccessView = {
	orderSuccessDescription: HTMLButtonElement;
	orderSuccessClose: HTMLButtonElement;
}

export type FormError = Partial<Record<keyof Order, string>>;