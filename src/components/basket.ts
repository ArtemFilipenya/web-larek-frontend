import { Component } from './base/components';
import { createElement, ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';
import { INumberProduct, IBasket, IProductBasketActions } from '../types/index';

export class Basket extends Component<IBasket> {
    protected _list: HTMLElement; // Элемент списка товаров в корзине
    protected _total: HTMLElement; // Элемент для отображения итоговой стоимости товаров
    protected _button: HTMLElement; // Кнопка для оформления заказа

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
         // Инициализация элементов корзины
		 this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		 this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		 this._button = ensureElement<HTMLElement>('.basket__button', this.container);
 
		 this.setupEventListeners(); // Установка слушателей событий
		 this.items = []; // Инициализация списка товаров
    }

    private setupEventListeners() {
        this._button.addEventListener('click', () => this.events.emit('order:open'));
    }

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this.setDisabled(this._button, false);
		} else {
			this._list.replaceChildren(createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' }));
			this.setDisabled(this._button, true);
		}
	}

    set hasItems(items: string[]) {
        this.setDisabled(this._button, !items.length);
    }

    set total(total: number) {
        // Установка итоговой стоимости товаров
        this.setText(this._total, `${total} синапсов`);
    }
}

export class ProductInBasket extends Component<INumberProduct> {
    protected _index: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IProductBasketActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);

        this._button.addEventListener('click', (evt) => {
            this.container.remove();
            actions?.onClick(evt);
        });
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set index(value: number) {
        this.setText(this._index, value.toString());
    }

    set price(value: number) {
        this.setText(this._price, `${value} синапсов`);
    }
}