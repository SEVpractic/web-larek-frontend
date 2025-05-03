export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export type ProductItemRespose = {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
};

export type OrderRequestBody = {
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

export interface IApi {
	readonly baseUrl: string;

	get(uri: string): Promise<object>;
	post(uri: string, data: object, method: ApiPostMethods): Promise<object>;
}

export interface IProductModel {
  GetProductItem(id: string): ProductItemRespose;
}

export interface IOrderModel {
  PostOrder(orderBody: OrderRequestBody): OrderRespose;
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
