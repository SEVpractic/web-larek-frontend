import { EventEmitter } from './components/base/events';
import { MainModel } from './components/model/MainModel';
import { ProductApi } from './components/model/ProductApi';
import './scss/styles.scss';

import { API_URL } from './utils/constants';

const eventEmitter = new EventEmitter();
const productApi = new ProductApi(API_URL);
const mainModel = new MainModel({}, eventEmitter);

//отладочные сообщения
eventEmitter.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

productApi.getProductList()
  .then(res => mainModel.setCatalogItems(res))
  .catch(err => {
    console.error(err);
});