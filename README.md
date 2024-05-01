# Проектная работа "Веб-ларек"

# Описание проекта

Проект представляет собой набор компонентов и интерфейсов для работы с интернет-магазином. В проекте реализованы компоненты для отображения каталога товаров, корзины, модального окна, страницы заказа и других элементов интерфейса.

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


# Архитектура Проекта

### Модуль Model
**Описание:** Модели в архитектуре отвечают за бизнес-логику и обработку данных приложения. Они независимы от пользовательского интерфейса и взаимодействуют с источниками данных, такими как базы данных или внешние сервисы.

#### 1. **AppState**
- **Описание:** Управляет централизованно состоянием приложения, включая данные о товарах в корзине и каталоге, а также информацию о заказе.
- **Методы:**
  - `addProductToBasket(item)`: Добавляет товар в корзину.
  - `removeProductFromBasket(item)`: Удаляет товар из корзины.
  - `clearBasket()`: Очищает корзину.
  - `setProductList(items)`: Устанавливает список товаров в каталог.
- **Наследование:** Происходит от класса `Model`, использует его метод `emitChanges` для уведомления о изменениях.

#### 2. **Model**
- **Описание:** Базовый класс для всех моделей, поддерживает механизмы оповещения об изменениях в данных.
- **Методы:**
  - `emitChanges(event, data)`: Испускает события изменений, которые могут быть перехвачены любым компонентом или контроллером.

### Модуль View

**Описание:** View компоненты отвечают за отображение данных моделей в пользовательском интерфейсе. Они реагируют на изменения в моделях и обновляют интерфейс.

#### 1. **ProductCard**
- **Описание:** Визуальное представление продукта в виде карточки.
- **Методы:** 
  - `setTitle(title), setDescription(desc), setPrice(price)`: Устанавливают соответствующие атрибуты продукта.
- **Наследование:** Расширяет `Component`, использует его методы для отрисовки и обновления.

#### 2. **Component**
- **Описание:** Базовый класс для всех элементов интерфейса, предоставляет общие методы для управления DOM.
- **Методы:**
  - `render(data)`: Генерирует HTML код компонента и обновляет его состояние.

#### 3. **Basket**
- **Описание:** Компонент для отображения и управления корзиной покупок.
- **Методы:**
  - `set items(items)`: Обновляет список товаров в корзине.
  - `set total(total)`: Вычисляет общую стоимость товаров в корзине.
- **Наследование:** Расширяет `Component`.

### Модуль Controller

**Описание:** Контроллеры координируют взаимодействие между моделью и представлением. Они обрабатывают пользовательский ввод и обновляют модель или представление в зависимости от взаимодействия пользователя.

#### Примеры взаимодействия компонентов

1. **Добавление товара в корзину:**
   - Пользователь кликает на кнопку "Добавить в корзину" на карточке товара.
   - Контроллер перехватывает это действие и вызывает метод `addProductToBasketв модели `AppState`.

   - `AppState` добавляет товар в состояние корзины и отправляет уведомление об изменении состояния корзины.
   - Компонент `Basket` обновляет отображение корзины с новыми данными.

2. **Оформление заказа:**
   - Пользователь переходит к оформлению заказа и заполняет необходимые данные.
   - Контроллер обрабатывает отправку формы, извлекает данные, валидирует их и передает в модель `AppState` для создания заказа.
   - При успешном создании заказа, `AppState` обновляет состояние заказа и очищает корзину.
   - Представление обновляется, отображая информацию о успешном оформлении заказа.

### Коммуникация и Управление Событиями

- **EventEmitter:** Используется для организации шаблона "наблюдатель" в приложении, позволяя компонентам реагировать на изменения в данных или состоянии других компонентов.
- **Методы:** `emit(event, data)`, `on(event, handler)`, `off(event, handler)` – методы для генерации событий, подписки на события и отписки от событий.

### Сетевые Запросы и Взаимодействие с API

- **IAppApi:** Интерфейс, определяющий методы для общения с серверным API, такие как получение списка товаров и отправка данных о заказе.
- **Методы:**
  - `getProductList()`: Выполняет запрос к серверу для получения списка товаров.
  - `postPaymentProduct(order: IPaymentDetails)`: Отправляет информацию о заказе на сервер.

  #### Основные типы данных

```typescript
// Типы данных для категорий продуктов
export type TProductCategory = 'soft-skill' | 'other' | 'additional' | 'button' | 'hard-skill';

// Типы данных для методов оплаты
export type TPaymentMethod = 'online' | 'cash-on-delivery' | 'credit-card';
```

#### Интерфейсы моделей данных

```typescript
//Продукт
export interface IProduct {
    id: string;
    title: string;
    image: string;
    price: number;
    category: string;
    description?: string;
}

// Интерфейс для элементов корзины
export interface INumberProduct extends IProduct {
  index: number;
}

export interface IBasket {
  items: HTMLElement[];
  totalAmount: number;
}

export interface IProductBasketActions {
  onClick: (event: MouseEvent) => void;
}

export interface IForm {
    valid: boolean;
    errors: string[];
}

export interface IContactsFormData {
    email: string;
    phone: string;
  [key: string]: any;
}

// Заказ товара
export interface IPaymentDetails {
  payment: TPaymentMethod | string;
    address: string;
  email: string;
  phone: string;
  total: number;
  items: string[];
}

export interface IPaymentForm {
  payment: string;
  address: string;
  email: string;
  phone: string;
}

export interface IPaymentResult {
  id: string;
  total: number;
}

export type FormErrors = Partial<Record<keyof IPaymentDetails , string>>;

// Ответ API
export interface ApiResponse {
  items: IProduct[];
}

// Информация о состоянии приложения
export interface IApplicationState {
    basket: Product[]; // товары в корзине
    catalog: Product[]; // список всех товаров
    order: IPaymentDetails | null; // информация о заказе
  preview: IProduct | null;
}

export interface IModalData {
  content: HTMLElement;
  product?: IProduct;
}

export interface IProductCardActions {
  onClick: (event: MouseEvent, product: IProduct) => void;
  data?: IProduct;
}

export interface IAppApi {
    getProductList(): Promise<IProduct[]>;
    postPaymentProduct(order: IPaymentDetails): Promise<IPaymentResult>;
}

export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}
```

### Безопасность и обработка ошибок

- **Обработка исключений:** Все сетевые запросы и обработка данных снабжены механизмами обработки ошибок, которые ловят исключения и предоставляют информацию пользователю или системе логирования.
- **Валидация данных:** Прежде чем данные отправляются на сервер или используются в логике приложения, они проходят через слой валидации, который проверяет их на соответствие ожидаемым форматам и значениям.
