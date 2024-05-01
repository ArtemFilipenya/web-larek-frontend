import './scss/styles.scss';

import { AppAPI } from './components/appApi';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/events';

import { Page } from './components/page';
import { IProduct, IPaymentForm } from './types/index';
import { AppState, Product } from './components/appState';
import { ProductCard } from './components/card';
import { Modal } from './components/modal';
import { Basket, ProductInBasket } from './components/basket';
import { ContactsForm, PaymentForm } from './components/form';
import { Success } from './components/successfullOperation';

// Создаем экземпляр класса EventEmitter для обработки событий
const events = new EventEmitter();

// Создаем экземпляр класса AppAPI для работы с API
const api = new AppAPI(CDN_URL, API_URL);

// Создаем экземпляр класса AppState для управления состоянием приложения
const appData = new AppState({}, events);

// Получаем шаблоны из HTML-документа
const productCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const productPrewiewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const productbasketModal = ensureElement<HTMLTemplateElement>('#card-basket');

const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new PaymentForm(cloneTemplate(orderTemplate), events);
const contact = new ContactsForm(cloneTemplate(contactsTemplate), events);

//запрос к серверу для получения карточек
async function fetchProductList() {
    try {
        const catalog = await api.getProductList();
        appData.setProductList(catalog);
    } catch (err) {
        console.error(err);
    }
}

fetchProductList();

// Обработчик события изменения списка продуктов с улучшенной типизацией
events.on('items:changed', () => {
    page.render();
    page.catalog = appData.catalog.map((item: IProduct) => {
        const card = new ProductCard(cloneTemplate(productCatalogTemplate), {
            onClick: () => {
                events.emit('preview:changed', item);
            },
        });
        card.setCategory(item.category);
        return card.render({
            title: item.title,
            image: item.image,
            price: item.price,
            category: item.category,
        });
    });
});

// Обработчик события изменения текущего товара
events.on('preview:changed', (data: IProduct) => {
    // Создание экземпляра карточки товара с использованием шаблона превью
    const preview = new ProductCard(cloneTemplate(productPrewiewTemplate), {
        onClick: () => {
            // Добавление товара в корзину, если он не добавлен
            if (!appData.isProductInBasket(data)) {
                appData.addProductToBasket(data as Product);
                preview.buttonText = 'Уже в корзине'; // Обновление текста кнопки
                modal.close(); // Закрытие модального окна
            }

            // Обновление счетчика товаров в корзине
            events.emit('basket:update');
            page.counter = appData.basket.length;
        },
    });

    // Заполнение данных превью карточки товара
    preview.image = data.image;
    preview.title = data.title;
    preview.price = data.price;
    preview.setCategory(data.category);
    preview.description = data.description || 'Описание отсутствует'; // Установка описания с проверкой на null
    preview.buttonText = appData.isProductInBasket(data) ? 'Уже в корзине' : 'В корзину';

    // Управление доступностью кнопки покупки на основе наличия цены
    if (!data.price) {
        preview.buttonText = 'Не доступен к покупке'; // Изменение текста кнопки, если цена отсутствует
    }

    // Отображение превью с учетом текущего состояния товара
    modal.content = preview.render();
    modal.open();
});

// Обработчик открытия модального окна
events.on('modal:open', () => {
    page.locked = true;
    if (appData.basket.length === 0) {
        page.checkoutButtonDisabled = true;
    }
});

// Обработчик закрытия модального окна
events.on('modal:close', () => { page.locked = false; });

// удаление карточки из корзины
events.on('basket:remove', (item: Product) => {
    appData.removeProductFromBasket(item);
    events.emit('basket:changed');
    events.emit('counter:changed');
});

// Открытие корзины
events.on('basket:open', () => {
    modal.render({
        content: basket.render({}),
    });
});

// счетчик
events.on('counter:changed', () => {
    page.counter = appData.basket.length;
});

// Отображение элементов в корзине
events.on('basket:changed', () => {
    const basketItems = appData.basket.map((item, index) => {
        // Создаем карточку товара в корзине
        const productItem = new ProductInBasket(cloneTemplate(productbasketModal), {
            onClick: () => events.emit('basket:remove', item), // Добавляем обработчик события удаления товара
        });

        // Отрисовываем карточку товара и возвращаем ее HTML-представление
        return productItem.render({
            title: item.title,
            price: item.price,
            index: index + 1, // Устанавливаем индекс товара в корзине
        });
    });

    const total = appData.getBasketTotal();
    basket.items = basketItems;
    basket.total = total || 0;
    basket.hasItems = basketItems.map(item => item.title);

    if (basketItems.length === 0) {
        page.basketButtonDisabled = true;
    } else {
        page.basketButtonDisabled = false;
    }
});

// смена статуса кнопки покупки в модальном окне
events.on('card:check', (item: Product) => {
    if (appData.basket.indexOf(item) === -1) events.emit('card:add', item);
    else events.emit('card:remove', item);
});

// открываем форму способа оплаты и адреса
events.on('order:open', () => {
    appData.validateOrder();
    modal.render({
        content: order.render({
            address: '',
            payment: '',
            valid: false,
            errors: [],
        }),
    });
});

// открываем форму контактных данных
events.on('order:submit', () => {
    appData.order.total = appData.getBasketTotal();
    appData.order.items = appData.basket
        .filter((item) => item.price !== null && item.price !== 0)
        .map((item) => item.id);
    modal.render({
        content: contact.render({
            email: '',
            phone: '',
            valid: false,
            errors: [],
        }),
    });
});

// изменения ошибок формы
events.on('formErrors:change', (errors: Partial<IPaymentForm>) => {
    const { email, phone, address, payment } = errors;
    order.valid = ![address, payment].some(Boolean);
    contact.valid = ![email, phone].some(Boolean);

    // Установка сообщений об ошибках
    order.errors = Object.values({ address, payment }).filter(Boolean);
    contact.errors = Object.values({ email, phone }).filter(Boolean);
});

// изменения способа оплаты
events.on('payment:change', (item: HTMLButtonElement) => {
    appData.order.payment = item.name;
    appData.validateOrder();
});

// изменения адреса доставки
events.on('address:change', (item: HTMLInputElement) => {
    appData.order.address = item.value;
    appData.validateOrder();
});

// изменения поля формы заказа
events.on( /^order\..*:change/, (data: { field: keyof IPaymentForm; value: string }) => {
        appData.setOrderField(data.field, data.value);
    }
);

// изменения поля формы контактов
events.on( /^contacts\..*:change/,(data: { field: keyof IPaymentForm; value: string }) => {
        appData.setContactsField(data.field, data.value);
    }
);


// оформление заказа и модальное окно об успехе
events.on('contacts:submit', async () => {
    try {
        const res = await api.postPaymentProduct(appData.order);
        const success = new Success(cloneTemplate(successTemplate), {
            onClick: () => {
                modal.close(true); // Закрытие с очисткой корзины
            },
        });
        modal.render({
            content: success.render({
                total: Number(res.total),
            }),
        });
        appData.clearBasket(); // Очистка корзины
        page.counter = 0; // Сброс счётчика
    } catch (error) {
        console.error(error);
    }
});

