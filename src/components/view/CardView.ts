import { Action, Card, categories } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export class CardView extends Component<Card> {
	private _cardImage?: HTMLImageElement;
	private _cardText?: HTMLElement;
	private _cardCategory?: HTMLElement;
	private _cardTitle: HTMLElement;
	private _cardPrice: HTMLElement;
	private _cardButton?: HTMLButtonElement;
	private _basketItemIndex?: HTMLElement;

	constructor(container: HTMLElement, actions?: Action) {
		super(container);

		this._cardTitle = ensureElement<HTMLElement>('.card__title', container);
		this._cardPrice = ensureElement<HTMLElement>('.card__price', container);
		this._cardImage = container.querySelector('.card__image');
		this._cardText = container.querySelector('.card__text');
		this._cardCategory = container.querySelector('.card__category');
		this._cardButton = container.querySelector('.card__button');
		this._basketItemIndex = container.querySelector('.basket__item-index');

		if (actions?.onClick) {
			if (this._cardButton) {
				this._cardButton.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set image(val: string) {
		if (!this._cardImage) return;
		this.setImage(this._cardImage, val, this.title);
	}

	set description(val: string) {
		if (!this._cardText) return;
		this.setText(this._cardText, val);
	}

	set category(val: string) {
		if (!this._cardCategory) return;
		this.setText(this._cardCategory, val);
		this._cardCategory.className = `card__category card__category_${categories.get(val)}`;
	}

	set title(val: string) {
		this.setText(this._cardTitle, val);
	}

	set price(val: number | null) {
		this.setText(this._cardPrice, val ? `${val} синапсов` : 'Бесценно');
	}

	set basketItemIndex(val: number) {
		this.setText(this._basketItemIndex, val);
	}

	set buttonText(val: string) {
		this.setText(this._cardButton, val);
	}

	set isButtonDisabled(val: boolean) {
		this.setDisabled(this._cardButton, val);
	}
}
