import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { MainModel } from './components/model/MainModel';
import { ProductApi } from './components/model/ProductApi';
import { CardView } from './components/view/CardView';
import { PageView } from './components/view/PageView';
import './scss/styles.scss';
import { Card, cardButtonTexts, ProductItem } from './types';

import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const modalContainer = ensureElement<HTMLElement>('#modal-container');

const eventEmitter = new EventEmitter();
const productApi = new ProductApi(API_URL);
const mainModel = new MainModel({}, eventEmitter);
const pageView = new PageView(document.body, eventEmitter);
const modal = new Modal(modalContainer, eventEmitter);

//отладочные сообщения
eventEmitter.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

eventEmitter.on<ProductItem[]>('catalog:changed', () => {
  const cards = mainModel.getAllCards().map(item => {
    const card = new CardView(
      cloneTemplate(cardCatalogTemplate),
      {
        onClick: () => {
          eventEmitter.emit('gallery:click', item);
        }
      }
    );

    return card.render(item);
  });

  pageView.gallery = cards;
  pageView.counter = mainModel.items.length;
});

eventEmitter.on<ProductItem>('gallery:click', el => mainModel.preview = el.id);

eventEmitter.on<Card>('preview:changed', item => {
  const card = new CardView(
    cloneTemplate(cardPreviewTemplate),
    {
      onClick: () => {
        eventEmitter.emit('card:click', item);
        modal.close();
      }
    }
  );

  modal.render({
    content: card.render({
      ...item, 
      buttonText: cardButtonTexts.get(mainModel.getCartActionStatus(item.id))
    })
  });
});

eventEmitter.on<ProductItem>('card:click', item => mainModel.toggleProductInOrder(item.id));

eventEmitter.on('modal:open', () => {
    pageView.lock = true;
});

eventEmitter.on('modal:close', () => {
    pageView.lock = false;
});

productApi.getProductList()
  .then(res => mainModel.catalogItems =res)
  .catch(err => {
    console.error(err);
});