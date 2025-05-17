import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { MainModel } from './components/model/MainModel';
import { ProductApi } from './components/model/ProductApi';
import { BasketView } from './components/view/BasketView';
import { CardView } from './components/view/CardView';
import { OrderView } from './components/view/OrderView';
import { PageView } from './components/view/PageView';
import { SuccessView } from './components/view/SuccessView';
import './scss/styles.scss';
import {
	Card,
	cardButtonTexts,
	ValidationResult,
	PaymentType,
	ProductItem,
} from './types';

import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const eventEmitter = new EventEmitter();
const productApi = new ProductApi(API_URL);
const mainModel = new MainModel({}, eventEmitter);
const pageView = new PageView(document.body, eventEmitter);
const modal = new Modal(modalContainer, eventEmitter);
const basketView = new BasketView(cloneTemplate(basketTemplate), eventEmitter);
const orderPaymentView = new OrderView(
	cloneTemplate(orderTemplate),
	eventEmitter
);
const orderContatsView = new OrderView(
	cloneTemplate(contactsTemplate),
	eventEmitter
);
const successView = new SuccessView(cloneTemplate(successTemplate), {
	onClick: () => {
		modal.close();
	},
});

//отладка
// eventEmitter.onAll(({ eventName, data }) => {
// 	console.log(eventName, data);
// });

eventEmitter.on<ProductItem[]>('catalog:changed', (items) => {
	const cards = items.map((item) => {
		const card = new CardView(cloneTemplate(cardCatalogTemplate), {
			onClick: () => {
				eventEmitter.emit('gallery:click', item);
			},
		});

		return card.render(item);
	});

	pageView.gallery = cards;
	pageView.counter = mainModel.items.length;
});

eventEmitter.on<ProductItem>(
	'gallery:click',
	(el) => (mainModel.preview = el.id)
);

eventEmitter.on<Card>('preview:changed', (item) => {
	const card = new CardView(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			eventEmitter.emit('card:click', item);
			modal.close();
		},
	});

	modal.render({
		content: card.render({
			...item,
			buttonText: cardButtonTexts.get(mainModel.getCartActionStatus(item.id)),
			isButtonDisabled: mainModel.getCartActionStatus(item.id) === 'disabled',
		}),
	});
});

eventEmitter.on<ProductItem>('card:click', (item) =>
	mainModel.toggleProductInOrder(item.id)
);

eventEmitter.on('modal:open', () => (pageView.lock = true));

eventEmitter.on('modal:close', () => (pageView.lock = false));

eventEmitter.on<ProductItem[]>('basket:changed', (items) => {
	pageView.counter = mainModel.items.length;
	basketView.basketList = items.map((item, index) => {
		const card = new CardView(cloneTemplate(cardBasketTemplate), {
			onClick: () => eventEmitter.emit('card:click', item),
		});
		return card.render({ ...item, basketItemIndex: index++ });
	});
	basketView.basketPrice = mainModel.total;
});

eventEmitter.on('basket:click', () => {
	modal.render({
		content: basketView.render(),
	});
});

eventEmitter.on('order_form:open', () => {
	orderPaymentView.clearAllInputs();
	orderPaymentView.activePaymentBtn = mainModel.getOrderFieldValue(
		'payment'
	) as PaymentType;
	modal.render({
		content: orderPaymentView.render({
			address: mainModel.getOrderFieldValue('address'),
			errors: '',
			valid: mainModel.validateOrder().isPaymentFormValid,
		}),
	});
});

eventEmitter.on(
	/^(order|contacts).*change$/,
	(data: {
		field: 'address' | 'phone' | 'email' | 'payment';
		value: string;
	}) => {
		mainModel.setOrderFieldValue(data.field, data.value);
		if (data.field === 'payment') {
			orderPaymentView.activePaymentBtn = data.value as PaymentType;
		}
	}
);

eventEmitter.on<ValidationResult>(
	'form_input_errors:changed',
	(validationResult) => {
		orderPaymentView.valid = validationResult.isPaymentFormValid;
		orderPaymentView.errors = [
			validationResult.payment,
			validationResult.address,
		]
			.filter((el) => !!el)
			.join('; ');

		orderContatsView.valid = validationResult.isContactsFormValid;
		orderContatsView.errors = [validationResult.email, validationResult.phone]
			.filter((el) => !!el)
			.join('; ');
	}
);

eventEmitter.on('order:submit', () => {
	modal.render({
		content: orderContatsView.render({
			email: mainModel.getOrderFieldValue('email'),
			phone: mainModel.getOrderFieldValue('phone'),
			errors: '',
			valid: mainModel.validateOrder().isContactsFormValid,
		}),
	});
});

eventEmitter.on('contacts:submit', () => {
	productApi
		.postOrder(mainModel.order)
		.then((res) => {
			mainModel.clearOrder();
			modal.render({
				content: successView.render({ total: res.total }),
			});
		})
		.catch((err) => {
			console.error(`Ошибка при оплате заказа ${err}`);
		});
});

productApi
	.getProductList()
	.then((res) => (mainModel.catalogItems = res))
	.catch((err) => {
		console.error(err);
	});
