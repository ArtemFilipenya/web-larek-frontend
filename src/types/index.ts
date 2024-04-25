// Уточнение категорий продуктов
export type TProductCategory = 'soft-skill' | 'other' | 'additional' | 'button' | 'hard-skill';

// Расширение типов оплаты
export type TPaymentMethod = 'online' | 'cash-on-delivery' | 'credit-card';

// Интерфейс для описания продукта
export interface IProduct {
    productId: string;
    categoryName: TProductCategory;
    productName: string;
    description: string;
    price: number | null;
    imageUrl?: string;
    isSelected?: boolean;
}

// Интерфейс для элементов корзины
export interface IBasketItem {
    product: IProduct;
    quantity: number;
    subtotal: number;
}

// Интерфейс для данных корзины
export interface IBasket {
    items: IBasketItem[];
    totalAmount: number;
}

// Интерфейс для формы заказа
export interface IOrderDetails {
    paymentMethod: TPaymentMethod;
    shippingAddress: string;
    contactEmail: string;
    contactPhone: string;
    estimatedDeliveryDate?: Date;
}

// Интерфейс для ответа об успешном оформлении заказа
export interface IOrderConfirmation {
    orderId: string;
    orderTotal: number;
    confirmationMessage: string;
}

// Интерфейс для состояния приложения
export interface IApplicationState {
    productCatalog: IProduct[];
    shoppingBasket: IBasket;
    currentOrder: IOrderDetails | null;
    previewProduct: IProduct | null;
}

// Интерфейс для действий с карточкой товара
export interface IProductCardActions {
    onAddToCart: (productId: string, quantity: number) => void;
    onRemoveFromCart: (productId: string, quantity: number) => void;
}