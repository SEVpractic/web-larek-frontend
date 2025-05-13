import { EventEmitter } from './components/base/events';
import { MainModel } from './components/model/MainModel';
import { ProductApi } from './components/model/ProductApi';
import { CardView } from './components/view/CardView';
import { PageView } from './components/view/PageView';
import './scss/styles.scss';
import { ProductItem } from './types';

import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

const eventEmitter = new EventEmitter();
const productApi = new ProductApi(API_URL);
const mainModel = new MainModel({}, eventEmitter);
const pageView = new PageView(document.body, eventEmitter);

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
          eventEmitter.emit('gallery:click', eventEmitter);
        }
      }
    );

    return card.render({
      id: item.id,
      image: item.image,
      category: item.category,
      title: item.title,
      price: item.price
    });
  });

  pageView.gallery = cards;
  pageView.counter = mainModel.items.length;
});

productApi.getProductList()
  .then(res => mainModel.catalogItems =res)
  .catch(err => {
    console.error(err);
});