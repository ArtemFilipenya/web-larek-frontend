import { Component } from './base/components';

interface ISuccessActions {
    onClick: (event: MouseEvent) => void;
}

export interface ISuccess {
    id: string;
    total: number;
}

export class Success extends Component<ISuccess> {
    protected _button: HTMLButtonElement | null;
    protected _total: HTMLElement | null;

    constructor(container: HTMLElement, actions?: ISuccessActions) {
        super(container);

        this._button = container.querySelector('.order-success__close');
        this._total = container.querySelector('.order-success__description');

        if (actions?.onClick && this._button) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set total(total: number) {
        if (this._total) {
            this._total.textContent = `Списано ${total} синапсов`;
        }
    }
}

