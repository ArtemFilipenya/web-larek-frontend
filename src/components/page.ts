import { Component } from './base/components';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { IPage } from '../types/index';

export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;
    protected _checkoutButton?: HTMLButtonElement;
    protected _basketButton?: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.initializeElements();
        this.setupEventListeners();
    }

    private initializeElements(): void {
        this._counter = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this._catalog = ensureElement<HTMLElement>('.gallery', this.container);
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper', this.container);
        this._basket = ensureElement<HTMLElement>('.header__basket', this.container);
        this._checkoutButton = this.findElement<HTMLButtonElement>('.checkout-button');
        this._basketButton = this.findElement<HTMLButtonElement>('.basket-button');
    }

    private setupEventListeners(): void {
        if (this._basket) {
            this._basket.addEventListener('click', this.onBasketClick.bind(this));
        }
    }

    private onBasketClick(): void {
        this.events.emit('basket:open');
    }

    set counter(value: number) {
        this.setText(this._counter, value.toString());
    }

    set catalog(items: HTMLElement[]) {
        if (this._catalog) {
            this._catalog.replaceChildren(...items);
        }
    }

    set locked(value: boolean) {
        this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
    }

set checkoutButtonDisabled(value: boolean) {
    if (this._checkoutButton) {
        console.log(`Setting checkout button disabled state to ${value}`);
        this.setDisabled(this._checkoutButton, value);
    }
}

    set basketButtonDisabled(value: boolean) {
        if (this._basketButton) {
            this.setDisabled(this._basketButton, value);
        }
    }
}