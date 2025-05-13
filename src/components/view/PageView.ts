import { IEvents, Page, ProductItem } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export class PageView extends Component<ProductItem> {
  protected _headerBasket: HTMLElement;
  protected _basketCounter: HTMLElement;
  protected _gallery: HTMLElement;
  protected _pageWrapper: HTMLElement;

  constructor(container: HTMLElement, protected readonly eventEmiter: IEvents) {
    super(container);
    
    this._headerBasket = ensureElement<HTMLButtonElement>('.header__basket');
    this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
    this._gallery = ensureElement<HTMLElement>('.gallery');
    this._pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
    
    this._headerBasket.addEventListener('click', () => {
      this.eventEmiter.emit('basket:click');
    });
  }

  set counter(count: number) {
    this.setText(this._basketCounter, String(count));
  }

  set gallery(items: HTMLElement[]) {
    this._gallery.replaceChildren(...items);
  }

  set lock(isLock: boolean) {
    if (isLock) {
        this.toggleClass(this._pageWrapper, 'page__wrapper_locked', true);
    } else {
        this.toggleClass(this._pageWrapper, 'page__wrapper_locked', false);
    }
  }
}