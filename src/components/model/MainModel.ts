import { IEvents, Main, ProductItem, Order, FormError } from "../../types";
import { Model } from "../base/Model";

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
      items: []
    };
  }

  set catalogItems(items: ProductItem[]) {
    this._catalogItems = new Map(items.map(el => [el.id, el]));

    this.emitChanges('catalog:changed', { catalogItems: this._catalogItems});
  }

  getCard(id: string): ProductItem {
    return this._catalogItems.get(id);
  }

  getCards(ids: string[]): ProductItem[] {
    return ids.map(id => this._catalogItems.get(id))
    .filter((item): item is ProductItem => item !== undefined);
  }

  getAllCards(): ProductItem[] {
    return Array.from(this._catalogItems.values());
  }
  
  hasCardById(id: string): boolean {
    return this._catalogItems.has(id);
  }

  set preview(id: string | null) {
    if (!this.hasCardById(id)) return;
    this._preview = id;

    this.emitChanges('preview:changed', this.getCard(this._preview));
  }

  getCartActionStatus(id: string): 'add' | 'remove' | 'disabled' {
    const item = this.getCard(id);
    if (!item || !item.price) return 'disabled';

    if (this._order.items.includes(id)) {
      return 'remove';
    } 
    return 'add'
  }

  toggleProductInOrder(id: string): void {
    if (!this.hasCardById(id)) return;

    if (!this._order.items.includes(id)) {
      this._order.items.push(id);
    } else {
      this._order.items = this._order.items.filter(el => el !== id);
    }

    this.setTotal();
    this.emitChanges('basket:changed', this.getCards(this._order.items));

    console.log('order: ', this._order)
  }

  clearOrdersBasket(): void {
    this._order.items = [];
    this.setTotal();

    this.emitChanges('basket:changed', this.getCards(this._order.items));
  }

  clearOrdersInfo(): void {
    this._order.address = "";
    this._order.email = "";
    this._order.payment = "";
    this._order.phone = "";

    this.emitChanges('order:changed', this._order );
  }

  setTotal(): void {
    this._order.total = this.getCards(this._order.items)
      .reduce((total, item) => total + item.price, 0);
  }

  getTotal(): number {
    return this._order.total;
  }

  get items(): string[] {
    return this._order.items;
  }

  validatePayment(): boolean {
    const errors: FormError = {};

    if (!this._order.payment) {
      errors.payment = "Не выбран способ оплаты";
    }
    if (!this._order.address) {
      errors.address = "Не введен адрес доставки";
    }

    this.emitChanges('form_input_errors:changed', { errors });

    return Object.keys(errors).length === 0;
  }

  setPayment(payment: string, address: string): void {
    this._order.payment = payment;
    this._order.address = address;

    if (this.validatePayment()) {
      this.emitChanges('order:changed', this._order);
    }
  }

  validateContacts(): boolean {
    const errors: FormError = {};

    if (!this._order.email) {
      errors.email = "Не указан email";
    }
    if (!this._order.phone) {
      errors.phone = "Не указан номер телефона";
    }

    this.emitChanges('form_input_errors:changed', { errors });

    return Object.keys(errors).length === 0;
  } 

  setContacts(email: string, phone: string): void {
    this._order.email = email;
    this._order.phone = phone;

    if (this.validateContacts) {
      this.emitChanges('order:changed', this._order);
    }
  }
}