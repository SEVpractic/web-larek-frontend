import { IEvents, Order } from "../../types";
import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export class BasketView extends Component<Order> {
	private _basketList: HTMLElement;
	private _basketPrice: HTMLElement;
	private _basketButton: HTMLButtonElement; 
  
  constructor(container: HTMLElement, protected readonly eventEmiter: IEvents) {
    super(container);
    
    this._basketList = ensureElement<HTMLButtonElement>('.basket__list', this.container);
    this._basketPrice = this.container.querySelector('.basket__price');
    this._basketButton = this.container.querySelector('.basket__button');

    if (this._basketButton) {
        this._basketButton.addEventListener('click', () => {
            eventEmiter.emit('order_form:open');
        });
    }
  }

  set basketList(items: HTMLElement[]) {
    if (items.length) {
        this._basketList.replaceChildren(...items);
        this.setDisabled(this._basketList, false);
    } else {
        this._basketList.replaceChildren(
            createElement('p', { textContent: 'В корзине нет товаров' })
        );
        this.setDisabled(this._basketList, true);
    }
  }

  set basketPrice(total: number) {
    this.setText(this._basketPrice, `${total} синапсов`);
  }
}