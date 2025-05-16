import { IEvents, Order, Payment } from "../../types";
import { Form } from "../common/Form";

export class OrderView extends Form<Order> {

  private _cardButton?: HTMLButtonElement;
  private _cashButton?: HTMLButtonElement;
  private _addressInput?: HTMLInputElement;
  private _emailInput?: HTMLInputElement;
  private _phoneInput?: HTMLInputElement;

  constructor(container: HTMLFormElement, protected readonly eventEmiter: IEvents) {
    super(container, eventEmiter);
    
    this._cardButton = container.elements.namedItem('card') as HTMLButtonElement;
    this._cashButton = container.elements.namedItem('cash') as HTMLButtonElement;
    this._addressInput = container.elements.namedItem('address') as HTMLInputElement;
    this._emailInput = container.elements.namedItem('email') as HTMLInputElement;
    this._phoneInput = container.elements.namedItem('phone') as HTMLInputElement;

    if (this._cashButton) {
      this._cashButton.addEventListener('click', () => {
        eventEmiter.emit(
          'order.payment:change', 
          { field: 'payment', value: Payment.cash })
      });
    }

    if (this._cardButton) {
      this._cardButton.addEventListener('click', () => {
        eventEmiter.emit(
          'order.payment:change', 
          { field: 'payment', value: Payment.card })
      });
    }
  }

  set address(val: string) {
    if (!this._addressInput) return;
    this._addressInput.value = val;
  }

  set phone(val: string) {
    if (!this._phoneInput) return;
    this._phoneInput.value = val;
  }

  set email(val: string) {
    if (!this._emailInput) return;
    this._emailInput.value = val;
  }

  set activePaymentBtn(payment: Payment) {
    this.clearPaymentStyle();

    if (!payment) return;

    this.toggleClass(this[payment], 'button_alt-active', true);
  }

  get card() {
    return this._cardButton;
  }

  get cash() {
    return this._cashButton;
  }

  clearPaymentStyle() {
    if (!this._cardButton || !this._cashButton) return;

    this.toggleClass(this._cardButton, 'button_alt-active', false);
    this.toggleClass(this._cashButton, 'button_alt-active', false);
  }

  clearAll() {
    this.email = '';
    this.phone = '';
    this.address = '';
  }
}