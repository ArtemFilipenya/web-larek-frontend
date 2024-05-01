import { Component } from './base/components';
import { IEvents } from './base/events';
import { ensureElement, ensureAllElements } from '../utils/utils';
import { IForm, IContactsFormData, IPaymentForm} from '../types/index';

export class Form<T> extends Component<IForm> {
    // Объявление защищенных переменных для доступа к элементам формы
    protected submitButton: HTMLButtonElement;
    protected errorContainer: HTMLElement;

    // Конструктор класса Form
    constructor(protected formElement: HTMLFormElement, protected events: IEvents) {
        super(formElement);  // Вызов конструктора базового класса

        // Инициализация кнопки отправки формы и контейнера для ошибок
        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.formElement);
        this.errorContainer = ensureElement<HTMLElement>('.form__errors', this.formElement);

        // Подписка на события изменения и отправки формы
        this.formElement.addEventListener('input', this.handleInputChange.bind(this));
        this.formElement.addEventListener('submit', this.handleSubmit.bind(this));
    }

    // Обработчик изменений в полях формы.
    // Испускает событие с информацией о измененном поле
    private handleInputChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        const fieldName = target.name as keyof T;
        const value = target.value;
        this.events.emit(`${this.formElement.name}.${String(fieldName)}:change`, {
            field: fieldName,
            value,
        });
    }

    // Обработчик события отправки формы.
    // Предотвращает стандартное поведение и испускает событие отправки
    private handleSubmit(event: Event): void {
        event.preventDefault();
        this.events.emit(`${this.formElement.name}:submit`);
    }

    // Сеттер для установки состояния валидности формы
    // Отключает или включает кнопку отправки в зависимости от валидности
    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    // Сеттер для отображения ошибок в контейнере ошибок формы
    set errors(value: string[]) {
        this.errorContainer.textContent = value.join(', '); // Отображение ошибок через запятую
    }

    // Метод для рендеринга состояния формы
    // Обновляет форму, применяя новое состояние элементов и обновляя валидность и ошибки
    render(state: Partial<T> & IForm): HTMLFormElement {
        const { valid, errors, ...inputs } = state;
        super.render({ valid, errors });  // Вызов рендера базового класса
        Object.assign(this, inputs);  // Применение новых значений полей формы
        return this.formElement;  // Возврат обновленного элемента формы
    }
}

export class ContactsForm extends Form<IContactsFormData> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(formElement: HTMLFormElement, events: IEvents) {
        super(formElement, events);

        // Найти инпуты и сохранить их для дальнейшего использования
        this.emailInput = formElement.querySelector('[name="email"]') as HTMLInputElement;
        this.phoneInput = formElement.querySelector('[name="phone"]') as HTMLInputElement;
        
        // Убедимся, что элементы существуют
        if (!this.emailInput || !this.phoneInput) {
            throw new Error("Required form elements are missing");
        }
    }

    // Сеттер для установки значения телефона
    set phone(value: string) {
        this.phoneInput.value = value;
        this.emitInputChange('phone', value);
    }

    // Сеттер для установки значения email
    set email(value: string) {
        this.emailInput.value = value;
        this.emitInputChange('email', value);
    }

    private emitInputChange(fieldName: keyof IContactsFormData, value: string): void {
        this.events.emit(`${this.formElement.name}.${String(fieldName)}:change`, {
            field: fieldName,
            value: value,
        });
    }
}

export class PaymentForm extends Form<IPaymentForm> {
	protected paymentButtons: HTMLButtonElement[];

	constructor(formElement: HTMLFormElement, events: IEvents) {
		super(formElement, events);

		// Найти все элементы с классом `.button_alt` и сохранить их
		this.paymentButtons = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			formElement
		);
		
		// Добавление обработчика событий для каждой кнопки
		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.payment = button.name;
				events.emit('payment:change', { name: button.name });
			});
		});
	}

	// Сеттер для установки адреса доставки
	set address(value: string) {
		const addressInput = this.formElement.querySelector('[name="address"]') as HTMLInputElement;
		if (!addressInput) {
			throw new Error("Address input is missing in the form");
		}
		addressInput.value = value;
	}

	// Сеттер для установки активной оплаты
	set payment(name: string) {
		this.paymentButtons.forEach((button) => {
			button.classList.toggle('button_alt-active', button.name === name);
		});
	}

}