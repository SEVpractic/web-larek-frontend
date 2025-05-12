import { IEvents, Main, ProductItem, Order, FormError } from "../../types";
import { Model } from "../base/Model";

export class MainModel extends Model<Main> {
  catalogItems: Map<string, ProductItem>;
  preview: string | null;
  order: Order;

  constructor(data: Partial<Main>, protected events: IEvents) {
    super(data, events);
    
    this.catalogItems = new Map();
    this.preview = null;
    this.order = {
      payment: '',
      email: '',
      phone: '',
      address: '',
      total: 0,
      items: []
    };
  }

  setCatalogItems(items: ProductItem[]): void {
    this.catalogItems = new Map(items.map(el => [el.id, el]));

    this.emitChanges('catalog:changed', { catalogItems: this.catalogItems});
  }

  getCard(id: string): ProductItem {
    return this.catalogItems.get(id);
  }

  getCards(ids: string[]): ProductItem[] {
    return ids.map(id => this.catalogItems.get(id))
    .filter((item): item is ProductItem => item !== undefined);
  }

  getAllCards(): ProductItem[] {
    return Array.from(this.catalogItems.values());
  }
  
  hasCardById(id: string): boolean {
    return this.catalogItems.has(id);
  }

  setPreview(id: string | null) {
    if (!this.hasCardById(id)) return;
    this.preview = id;

    this.emitChanges('preview:changed', { item: this.getCard(this.preview) });
  }

  addItemToOrder(id: string): void {
    if (this.hasCardById(id) && !this.order.items.includes(id)) {
      this.order.items.push(id);
      this.setTotal();

      this.emitChanges('basket:changed', { items: this.getCards(this.order.items) });
    }
  } 

  removeItemFromOrder(id: string): void {
    if (this.hasCardById(id) && this.order.items.includes(id)) {
      this.order.items = this.order.items.filter(el => el !== id);
      this.setTotal();

      this.emitChanges('basket:changed', { items: this.getCards(this.order.items) });
    }
  }

  clearOrdersBasket(): void {
    this.order.items = [];
    this.setTotal();

    this.emitChanges('basket:changed', { items: this.getCards(this.order.items) });
  }

  clearOrdersInfo(): void {
    this.order.address = "";
    this.order.email = "";
    this.order.payment = "";
    this.order.phone = "";

    this.emitChanges('order:changed', { order: this.order });
  }

  setTotal(): void {
    this.order.total = this.getCards(this.order.items)
      .reduce((total, item) => total + item.price, 0);
  }

  getTotal(): number {
    return this.order.total;
  }

  getItems(): string[] {
    return this.order.items;
  }

  validatePayment(): boolean {
    const errors: FormError = {};

    if (!this.order.payment) {
      errors.payment = "Не выбран способ оплаты";
    }
    if (!this.order.address) {
      errors.address = "Не введен адрес доставки";
    }

    this.emitChanges('form_input_errors:changed', { errors });

    return Object.keys(errors).length === 0;
  }

  setPayment(payment: string, address: string): void {
    this.order.payment = payment;
    this.order.address = address;

    if (this.validatePayment()) {
      this.emitChanges('order:changed', { order: this.order});
    }
  }

  validateContacts(): boolean {
    const errors: FormError = {};

    if (!this.order.email) {
      errors.email = "Не указан email";
    }
    if (!this.order.phone) {
      errors.phone = "Не указан номер телефона";
    }

    this.emitChanges('form_input_errors:changed', { errors });

    return Object.keys(errors).length === 0;
  } 

  setContacts(email: string, phone: string): void {
    this.order.email = email;
    this.order.phone = phone;

    if (this.validateContacts) {
      this.emitChanges('order:changed', { order: this.order});
    }
  }
}