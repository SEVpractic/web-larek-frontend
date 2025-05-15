import { IEvents, Main, ProductItem, Order, ValidationResult } from "../../types";
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

    this.emitChanges('catalog:changed', this.getAllCards());
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

  setOrderField(field: 'address' | 'phone' | 'email' | 'payment', value: string) {
    if (!this._order) return;
    this._order[field] = value;
    this.validateOrder();
  }

  getOrderField(field: 'address' | 'phone' | 'email' | 'payment'):  string {
    return this._order?.[field] ?? '';
  }

  validateOrder(): ValidationResult {
    const result: ValidationResult = {};
    result.isPaymentFormValid = true;
    result.isContactsFormValid = true;

    if (!this._order.payment) {
      result.payment = "Не выбран способ оплаты";
      result.isPaymentFormValid = false;
    }
    if (!this._order.address) {
      result.address = "Не введен адрес доставки";
      result.isPaymentFormValid = false;
    }
    if (!this._order.email) {
      result.email = "Не указан email";
      result.isContactsFormValid = false;
    }    
    if (!this._order.phone) {
      result.phone = "Не указан номер телефона";
      result.isContactsFormValid = false;
    }

    this.emitChanges('form_input_errors:changed', result);
    return result;
  }
}