import { Action, Order } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";


export class SuccessView extends Component<Order> {
  private _orderSuccessCloseBtn: HTMLButtonElement;
  private _orderSuccessDescription: HTMLElement;

  constructor(container: HTMLElement, actions?: Action) {
    super(container);

    this._orderSuccessCloseBtn = container.querySelector('.order-success__close');
    this._orderSuccessDescription = ensureElement<HTMLElement>('.order-success__description', container);

    if (actions?.onClick) {
      this._orderSuccessCloseBtn.addEventListener('click', actions.onClick);
    }
  }

  set total (total: number) {
    this.setText(this._orderSuccessDescription, `Списано ${total} синапсов`);
  }
}