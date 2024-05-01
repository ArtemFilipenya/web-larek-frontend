import { Component } from './base/components';
import { ensureElement } from '../utils/utils';
import { IProduct, IProductCardActions } from '../types/index';

export class ProductCard extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _category?: HTMLElement;
    protected _description?: HTMLElement;
    protected _price?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _data: IProduct;

    constructor(container: HTMLElement, actions?: IProductCardActions) {
        super(container);
        this._data = actions?.data || ({} as IProduct);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._image = container.querySelector<HTMLImageElement>('.card__image');
        this._button = container.querySelector<HTMLButtonElement>('.card__button');
        this._description = container.querySelector<HTMLElement>('.card__text');
        this._category = container.querySelector<HTMLElement>('.card__category');
        this._price = container.querySelector<HTMLElement>('.card__price');

        this.initializeActions(actions);
    }

    private initializeActions(actions?: IProductCardActions): void {
        if (actions?.onClick) {
            const target = this._button || this.container;
            target.addEventListener('click', (event) => {
                actions.onClick(event, this._data);
            });
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        if (this._title) this._title.textContent = value;
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        if (this._image) {
            this._image.src = value;
            this._image.alt = this.title;
        }
    }

    set buttonText(value: string) {
        if (this._button) {
            this._button.textContent = value;
            this._button.disabled = (value === 'Уже в корзине');
        }
    }

    set price(value: number | null) {
        if (this._price) {
            // Отображение цены или индикатора "Бесценно"
            this._price.textContent = value ? `${value} синапсов` : 'Бесценно';
        }
        if (this._button) {
            // Установка кнопки в неактивное состояние, если цена равна null
            this._button.disabled = value === null;
            // Изменение текста кнопки в зависимости от наличия цены
            this._button.textContent = value === null ? 'Не доступен к покупке' : 'В корзину';
        }
    }

    setCategory(value: string) {
        if (this._category) {
            this._category.textContent = value;
        }
    }

    set description(value: string | null) {
        if (value) {
            if (this._description) this._description.textContent = value;
        } else {
            this._description?.remove();
        }
    }

    get description(): string | null {
        return this._description?.textContent || null;
    }


}