# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Архитектура приложения

Приложение построено по парадигме **MVP (Model–View–Presenter)**, что обеспечивает чёткое разделение ответственности и облегчает поддержку и масштабирование кода.
### Слои:
- **View**  
  Отвечает за отображение данных и взаимодействие с пользователем. Представляет собой набор компонентов, обновляющихся в ответ на изменения модели.
- **Model**  
  Хранит и управляет данными приложения. Обеспечивает бизнес-логику и абстрагирует работу с внешними источниками данных.
- **Presenter**  
  Является посредником между View и Model.  
  Получает события от View, обновляет Model, и наоборот — реагирует на изменения в Model, инициируя обновление View. Взаимодействие основано на паттерне событий через `EventEmitter`.

Такой подход делает архитектуру гибкой, модульной и удобной для тестирования.

## Описание классов, их предназначение и функции.
### Базовые компоненты

**Путь:** `src/components/base/`

---
#### `Api`

Компонент взаимодействия с бэкэндом.  
Реализует интерфейс `IApi`.

**Конструктор:**
- `baseUrl: string` — базовый URL бэкэнда.
- `options?: RequestInit = {}` — необязательные настройки запроса (например, хэдеры).

**Особенности:**
- Используется только через наследников.
- Интерфейс `IApi` предоставляет методы:
  - `get(uri: string): Promise<object>` — отправка GET-запроса.
  - `post(uri: string, data: object, method: ApiPostMethods): Promise<object>` — отправка POST-запроса с указанием метода (POST, PUT и т.д.).
- Приватные методы класса:
  - `protected handleResponse(response: Response): Promise<object>` - обрабатывает полученный с сервера ответ типа Response.

---
#### `EventEmitter`

Брокер событий в классической реализации.  Служит механизмом связи между частями приложения. Класс используется в **презентере** для обработки пользовательских действий и координации логики, а также в **модели** и **представлении** для генерации и реакции на события, происходящие в приложении.
Реализует интерфейс `IEvents`.

**Конструктор:** без параметров.

**Методы интерфейса:**
- `on<T extends object>(event: EventName, callback: (data: T) => void): void` — установить обработчик события.
- `emit<T extends object>(event: string, data?: T): void` — инициировать событие.
- `trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` — создать коллбек, генерирующий событие при вызове.
**Методы класса:**
- `off(eventName: EventName, callback: Subscriber)` — удаляет указанный обработчик события.
- `onAll(callback: (event: EmitterEvent) => void)` — подписывает на все события, независимо от их имени.
- `offAll()` — удаляет все зарегистрированные обработчики событий.

---
#### `Component`

Абстрактный обобщенный класс с базовой логикой графического компонента.  
Используется только через наследников.

**Конструктор:**
- `container: HTMLElement` — DOM-элемент-контейнер для компонента.

**Методы:**
- `toggleClass(element: HTMLElement, className: string, force?: boolean)` — переключает класс. С параметром `force` может насильно добавить или удалить класс.
- `render(data?: Partial): HTMLElement` — возвращает корневой DOM-элемент.
**Приватные методы:**
- `protected setText(element: HTMLElement, value: unknown)` — устанавливает текст в элемент.
- `protected setDisabled(element: HTMLElement, state: boolean)` — блокирует/разблокирует элемент.
- `protected setHidden(element: HTMLElement)` — скрывает элемент.
- `protected setVisible(element: HTMLElement)` — делает элемент видимым.
- `protected setImage(element: HTMLImageElement, src: string, alt?: string)` — задаёт изображение и альтернативный текст.

---
#### `Model<T>`

Абстрактный обобщенный класс для описания модели данных.  
Используется только через наследников.

**Конструктор:**
- `data: Partial<T>` — объект с начальными данными.
- `events: IEvents` — экземпляр брокера событий.

**Метод:**
- `emit<T extends object>(eventName: string, data?: T)` — сообщает об изменении модели.

---
### Слой моделей данных

**Путь:** `src/components/model/`

---
#### `CardModel`

Класс, описывающий модель карточки товара. Наследует абстрактный обобщённый класс `Model`, указывая в качестве типа данных структуру товара `ProductItem`.

**Тип `ProductItem`:**
```ts
export type ProductItem = {
  id: string;             // id товара
  description: string;    // описание товара
  image: string;          // ссылка на изображение товара
  title: string;          // название товара
  category: string;       // категория товара
  price: number | null;   // цена товара
};

```

---
#### `OrderModel`

Класс, описывающий модель заказа. Наследует абстрактный обобщённый класс `Model`, указывая в качестве типа данных структуру заказа `Order`.

**Тип `Order`:**
```ts
export type Order = {
  payment: string;      // тип оплаты
  email: string;        // email покупателя
  phone: string;        // телефон покупателя
  address: string;      // адрес доставки
  total: number;        // суммарная стоимость товаров
  items: string[];      // массив id товаров
};
```

**Методы:**
- `addItemToOrder(id: string): void` — добавляет товар в заказ, если его там ещё нет.    
- `removeItemFromOrder(id: string): void` — удаляет товар из заказа по id.    
- `getItems(): string[]` — возвращает массив id добавленных товаров.    
- `incrementTotal(price: number | null): void` — увеличивает общую стоимость, если цена задана.    
- `getTotal(): number` — возвращает текущую общую стоимость.    
- `validatePayment(payment: string, address: string): boolean` — проверяет корректность данных формы оплаты.    
- `setPayment(payment: string, address: string): void` — сохраняет данные формы оплаты.    
- `validateContacts(email: string, phone: string): boolean` — проверяет корректность контактной информации.    
- `setContacts(email: string, phone: string): void` — сохраняет контактные данные покупателя.    

---
#### `MainModel`

Класс, описывающий модель главной страницы. Наследует `Model`, типизируется типом `Main`.

**Тип `Main`:**
```ts
export type Main = {
  catalogItems: Map<string, CardModel>;  // карточки в каталоге
  order: OrderModel;                     // модель заказа
};
```

**Методы:**
- `fillCatalog(): void` — заполняет каталог товарами.    
- `getCard(id: string): CardModel` — возвращает карточку по id.    
- `getCards(id: string[]): CardModel[]` — возвращает карточки по массиву id.    
- `getCards(): CardModel[]` — возвращает все карточки из каталога.    
- `getOrder(): OrderModel` — возвращает текущую модель заказа.    
- `clearOrder(): void` — очищает заказ.    

---
#### `ProductApi`

Класс взаимодействия с сервером. Наследует класс `Api`, реализует интерфейс `IProductModel`.

**Конструктор:**
- `baseUrl: string` — адрес API, передаётся в родительский конструктор.

**Методы:**
- `GetProductItem(id: string): ProductItem` — получает товар по id.    
- `GetProductList(id: string): ProductItem[]` — получает список всех товаров.    
- `PostOrder(orderBody: Order): OrderRespose` — отправляет заказ на сервер.

---
### Слой представления (View компоненты)

**Путь:** `src/components/View/`

---
#### `PageView`

Компонент представления главной страницы. Отвечает за отображение каталога товаров и количества товаров в корзине. Позволяет открыть модальные окна: с подробной информацией о товаре (при клике на карточку) и с корзиной (при клике на иконку корзины). При открытии модального окна блокирует прокрутку страницы.
Наследует абстрактный обобщённый класс `Component`, указывая в качестве типа данных структуру главной страницы `Page`.

**Тип `Page`:**
```ts
export type Page = {
  headerBasket: HTMLElement; //кнопка корзины
  basketCounter: HTMLElement; //счетчик элементов в корзине
  gallery: HTMLElement; //галерея карточек
  pageWrapper: HTMLElement; //обертка страницы
}
```

**Конструктор:**
- `container: HTMLElement` — DOM-элемент-контейнер для компонента.
- `events: IEvents` — интерфейс брокера событий.

**Методы:**
- `setCounter(count: number)` — установить количество товаров в корзине.
- `setGallery(items: HTMLElement[])` — поместить массив карточек в галерею.
- `setLock(isLock: boolean)` — заблокировать или разблокировать прокрутку страницы.

___
#### `CardView`

Компонент карточки товара. В зависимости от переданного контейнера формирует один из видов карточки:
- `.gallery__item .card` — карточка из галереи на главной странице    
- `.card .card_full` — карточка в модальном окне (детальный вид)    
- `.basket__item .card .card_compact` — карточка в списке корзины
Наследует абстрактный обобщённый класс `Component`, указывая в качестве типа данных структуру `Card`. 

**Тип `Card`:**
```ts
export type Card = {
  cardImage?: HTMLImageElement; //изображение товра
  cardText?: HTMLElement; //описание товара
  cardCategory?: HTMLElement; //категория товара
  cardTitle: HTMLElement; //название товара
  cardPrice: HTMLElement; //стоимость товара
  cardButton?: HTMLButtonElement; //кнопка карточки товара
  basketItemIndex?: HTMLElement; //индекс карточки товара
}
```

**Конструктор:**
- `container: HTMLElement` — DOM-элемент-контейнер для компонента.
- `actions?: Action` — (необязательный) объект с обработчиками событий (например, клик по кнопке "В корзину").
- `events: IEvents` — интерфейс брокера событий.

**Методы:**
- `set Id(count: string)` — установить значение id элемента.
- `get Id(): string` — вернуть значение id элемента.
- `set cardImage(val: string)` — установить значение ссылки на картинку.
- `set cardText(val: string)` — установить значение описания.
- `set cardCategory(val: string)` — установить значение категории.
- `set cardTitle(val: string)` — установить значение описания карточки.
- `set cardPrice(val: number | null)` — установить значение цены и текст `бесценно`.
- `set basketItemIndex(val: number)` — установить значение цены.
- `setButtonText(val: string)` — установить текст кнопки.
- `get cardButton(): HTMLButtonElement` — возвращает кнопку

___
#### `ModalView`

Класс - представление модального окна. Содержит произвольный контент, может быть закрыт кнопкой-крестиком или по клику на оверлей. Используется для отображения карточки товара или корзины.
Наследует абстрактный обобщённый класс `Component`, указывая в качестве типа данных структуру `Modal`. 

**Тип `Modal`:**
```ts
export type Modal = {
  modalСlose: HTMLButtonElement; //кнопка закрытия окна
  modalContent: HTMLElement; //контент окна
}
```

**Конструктор:**
- `container: HTMLElement` — DOM-элемент-контейнер для компонента.
- `events: IEvents` — интерфейс брокера событий.

**Методы:**
- `set modalContent(count: HTMLElement)` — задать содержимое окна.
- `open()` — открыть модальное окно.
- `close()` — закрыть модальное окно.

___
#### `BasketView`

Компонент отображения содержимого корзины. Отображает список товаров, общую стоимость и кнопку перехода к оформлению заказа.
Наследует абстрактный обобщённый класс `Component`, указывая в качестве типа данных структуру `Basket`. 

**Тип `Basket`:**
```ts
export type Basket = {
  basketList: HTMLElement; //сисок карточек в корзине
  basketPrice: HTMLElement; //итоговая цена
  basketButton: HTMLButtonElement; //кнопка перехода к форме оплаты
}
```

**Конструктор:**
- `container: HTMLElement` — DOM-элемент-контейнер для компонента.
- `events: IEvents` — интерфейс брокера событий.

**Методы:**
- `set basketList(count: HTMLElement[])` — установить содержимое списка карточек.
- `set basketPrice(total: number)` — установить суммарную стоимость.
- `get basketButton(): HTMLButtonElement` — возвращает кнопку

___
#### `FormView`

Класс - обобщенное представление формы ввода информации. Позволяет пользователю взаимодействовать с формой и отображает сообщения об ошибках, при необходимости. В классе созданы эвентлистенеры всех интерактивных элементов с типом `input` и `submit`, для генерации событий.
Наследует абстрактный обобщённый класс `Component`, указывая в качестве типа данных структуру `Form`. 

**Тип `Form`:**
```ts
export type Form = {
  submit: HTMLButtonElement;// кнопка сабмита формы
  formErrors: HTMLElement;// ошибки формы
}
```

**Конструктор:**
- `container: HTMLElement` — DOM-элемент-контейнер для компонента.
- `events: IEvents` — интерфейс брокера событий.

**Методы:**
- `setValid(isValid: boolean)` — установить состояние валидации формы.
- `set formErrors(val: string)` — установить текст ошибок.

**Приватные методы:**
- `protected emitOnChange(field: keyof T, value: string)` — сгенерировать событие при изменении поля
___
#### OrderFormView`

Компонент формы с выбором способа оплаты и адресом доставки. В классе созданы эвентлистенеры кнопок выбора типа оплаты, для генерации событий.
Наследует обобщённый класс `FormView`, указывая в качестве типа данных структуру `Form`. 

**Тип `PaymentForm`:**
```ts
export type PaymentForm = {
  cardBtn: HTMLButtonElement;//кнопка оплаты онлайн
  cashBtn: HTMLButtonElement;//кнопка оплаты при получении
}
```

**Конструктор:**
- `container: HTMLElement` — DOM-элемент-контейнер для компонента.
- `events: IEvents` — интерфейс брокера событий.

**Методы:**
- `setAddress(val: string)` — установить адрес доставки.
- `get cardBtn(): HTMLButtonElement` — возвращает кнопку оплаты онлайн.
- `get cashBtn(): HTMLButtonElement` — возвращает кнопку оплаты при получении.
- setPaymentType(type: 'card' | 'cash' | null ) — установить выбранный тип оплаты.
___
#### `ContactsFormView`

Форма для ввода контактной информации пользователя: email и телефон.
Наследует обобщённый класс `FormView`, указывая в качестве типа данных структуру `ContactsFormView`. 

**Тип `ContactsFormView`:**
```ts
export type ContactsFormView = {}
```

**Конструктор:**
- `container: HTMLElement` — DOM-элемент-контейнер для компонента.
- `events: IEvents` — интерфейс брокера событий.

**Методы:**
- `setEmail(val: string)` — установить email.
- `setPhone(val: string)` — установить телефон.
___
#### `SuccessView`

Компонент финального сообщения после успешного оформления заказа. Показывает сумму заказа и кнопку возврата на главный экран. Cрабатывает после успешной отправки POST запроса.
Наследует абстрактный обобщённый класс `Component`, указывая в качестве типа данных структуру `SuccessView`. 

**Тип `SuccessView`:**
```ts
export type SuccessView = {
  orderSuccessDescription: HTMLButtonElement; //отображение стоимости успешного заказа
  orderSuccessClose: HTMLButtonElement; //кнопка возврата
}
```

**Конструктор:**
- `container: HTMLElement` — DOM-элемент-контейнер для компонента.
- `events: IEvents` — интерфейс брокера событий.

**Методы:**
- `set orderSuccessDescription(total: number)` — установить стоимость заказа.
___

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```