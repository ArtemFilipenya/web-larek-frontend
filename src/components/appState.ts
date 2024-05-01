import { IPaymentDetails, IProduct, IPaymentForm, IApplicationState, FormErrors } from '../types/index';
import { Model } from './base/model';

export class Product extends Model<IProduct> {
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    price: number | null;
}

// Класс, описывающий состояние приложения
export class AppState extends Model<IApplicationState> {
    basket: Product[] = [];
    catalog: Product[] = [];
    order: IPaymentDetails = {
        items: [],
        payment: '',
        total: null,
        address: '',
        email: '',
        phone: '',
    };
    formErrors: FormErrors = {};

    // Методы работы с каталогом
    setProductList(items: IProduct[]) {
        this.catalog = items.map(item => new Product(item, this.events));
        this.emitChanges('items:changed');
    }

    // Методы работы с корзиной
	addProductToBasket(item: Product) {
		if (item.price === null) {
			console.log(`Attempted to add a product with null price to the basket`);
			return; // Не добавляем продукт
		}
		this.basket.push(item);
		this.emitChanges('basket:changed');
	}

    removeProductFromBasket(item: IProduct) {
        this.basket = this.basket.filter(product => product.id !== item.id);
        this.emitChanges('basket:changed');
    }

    clearBasket() {
        this.basket = [];
        this.emitChanges('basket:changed');
    }

    getBasketCount() {
        return this.basket.length;
    }

    getBasketTotal() {
        return this.basket.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    // Методы работы с заказом
    setOrderedItems() {
        this.order.items = [...new Set(this.basket.map(item => item.id))];
    }

    setOrderField(field: keyof IPaymentForm, value: string) {
        this.order[field] = value;
        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    setContactsField(field: keyof IPaymentForm, value: string) {
        this.order[field] = value;
        if (this.validateContacts()) {
            this.events.emit('contacts:ready', this.order);
        }
    }

    // Валидации
	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment)
			errors.payment = 'Необходимо указать способ оплаты';
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
        
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

    validateContacts() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    // Проверка наличия продукта в корзине
    isProductInBasket(item: IProduct) {
        return this.basket.some(product => product.id === item.id);
    }
}
