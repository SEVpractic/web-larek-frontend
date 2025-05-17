import {
	IEvents,
	Main,
	ProductItem,
	Order,
	ValidationResult,
} from '../../types';
import { Model } from '../base/Model';

export class MainModel extends Model<Main> {
	private _catalogItems: Map<string, ProductItem>;
	private _preview: string | null;
	private _order: Order;

	constructor(data: Partial<Main>, protected events: IEvents) {
		super(data, events);

		this._catalogItems = new Map();
		this._preview = null;
		this._order = {
			payment: '',
			email: '',
			phone: '',
			address: '',
			total: 0,
			items: [],
		};
	}

	set catalogItems(items: ProductItem[]) {
		this._catalogItems = new Map(items.map((el) => [el.id, el]));

		this.emitChanges('catalog:changed', this.catalogItems);
	}

  get catalogItems(): ProductItem[] {
		return Array.from(this._catalogItems.values());
	}

	private getCardById(id: string): ProductItem {
		return this._catalogItems.get(id);
	}

	private getCardsByIds(ids: string[]): ProductItem[] {
		return ids
			.map((id) => this._catalogItems.get(id))
			.filter((item): item is ProductItem => item !== undefined);
	}

	set preview(id: string | null) {
		const card = this.getCardById(id);

		if (!card) return;
		this._preview = id;

		this.emitChanges('preview:changed', card);
	}

	getCartActionStatus(id: string): 'add' | 'remove' | 'disabled' {
		const item = this.getCardById(id);
		if (!item || !item.price) return 'disabled';

		if (this._order.items.includes(id)) {
			return 'remove';
		}
		return 'add';
	}

	toggleProductInOrder(id: string): void {
		if (!this.getCardById(id)?.price) return;

		if (!this._order.items.includes(id)) {
			this._order.items.push(id);
		} else {
			this._order.items = this._order.items.filter((el) => el !== id);
		}

		this.calculateTotal();
		this.emitChanges('basket:changed', this.getCardsByIds(this._order.items));
	}

	clearOrder(): void {
		this._order.address = '';
		this._order.email = '';
		this._order.payment = '';
		this._order.phone = '';
		this._order.items = [];
		this.calculateTotal();
		this.emitChanges('basket:changed', this.getCardsByIds(this._order.items));
	}

	private calculateTotal(): void {
		this._order.total = this.getCardsByIds(this._order.items).reduce(
			(total, item) => total + item.price,
			0
		);
	}

	get total(): number {
		return this._order.total;
	}

	get items(): string[] {
		return this._order.items;
	}

	setOrderFieldValue(
		field: 'address' | 'phone' | 'email' | 'payment',
		value: string
	) {
		if (!this._order) return;
		this._order[field] = value;
		this.validateOrder();
	}

	getOrderFieldValue(field: 'address' | 'phone' | 'email' | 'payment'): string {
		return this._order?.[field] ?? '';
	}

	get order(): Order {
		return this._order;
	}

	validateOrder(): ValidationResult {
		const result: ValidationResult = {};
		result.isPaymentFormValid = true;
		result.isContactsFormValid = true;

		if (!this._order.payment) {
			result.payment = 'Не выбран способ оплаты';
			result.isPaymentFormValid = false;
		}
		if (!this._order.address) {
			result.address = 'Не введен адрес доставки';
			result.isPaymentFormValid = false;
		}
		if (!this._order.email) {
			result.email = 'Не указан email';
			result.isContactsFormValid = false;
		}
		if (!this._order.phone) {
			result.phone = 'Не указан номер телефона';
			result.isContactsFormValid = false;
		}

		this.emitChanges('form_input_errors:changed', result);
		return result;
	}
}
