import { Product } from '../components/appState';

export type TProductCategory = 'soft-skill' | 'other' | 'additional' | 'button' | 'hard-skill';
export type TPaymentMethod = 'online' | 'cash-on-delivery' | 'credit-card';

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