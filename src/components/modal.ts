import { Component } from './base/components';
import { IEvents } from './base/events';
import { IModalData } from '../types/index';

export class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this._closeButton = this.findElement<HTMLButtonElement>('.modal__close')!;
    this._content = this.findElement<HTMLElement>('.modal__content')!;

    // Прикрепляем обработчики событий с учетом контекста
    this._closeButton.addEventListener('click', () => this.close(true));
    // Обработчик для клика вне контента модального окна
    this.container.addEventListener('click', () => this.close(true));
    // Предотвращение всплытия события клика внутри контента
    this._content.addEventListener('click', (event) => event.stopPropagation());
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.toggleClass(this.container, 'modal_active', true);
    this.events.emit('modal:open');
  }

  close(clearCart: boolean = false) {
    this.toggleClass(this.container, 'modal_active', false);
    this.content = null;
    if (clearCart) {
        // Очистка корзины
        this.events.emit('cart:clear');
        this.events.emit('basket:changed'); // Уведомление о изменении содержимого корзины
    }
    this.events.emit('modal:close', { clearCart });
}

  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}