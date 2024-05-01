// Абстрактный класс Component, предназначенный для создания и управления компонентами веб-приложения
export abstract class Component<T> {
    protected container: HTMLElement;  // Контейнер, в котором размещается компонент

    // Конструктор класса, принимающий элемент контейнера, в котором будет размещен компонент
    constructor(container: HTMLElement) {
        this.container = container;
    }

    // Метод для переключения класса у элемента
    toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }

    // Защищенный метод для установки текста в элемент
    protected setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }

    // Метод для установки состояния disabled для элементов формы (кнопки, ввода)
    setDisabled(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');  // Установка атрибута disabled
            else element.removeAttribute('disabled');  // Удаление атрибута disabled
        }
    }

    // Скрытие элемента
    protected setHidden(element: HTMLElement) {
        element.style.display = 'none';
    }

    // Показать
    protected setVisible(element: HTMLElement) {
        element.style.removeProperty('display');
    }

    // Защищенный метод для установки изображения в элемент <img>
    protected setImage(element: HTMLImageElement, src: string, alt: string = '') {
        element.src = src;
        element.alt = alt;
    }

    // Метод render для отображения компонента, возможно с частичным обновлением данных
    render(data?: Partial<T>): HTMLElement {
        if (data) {
            Object.assign(this, data);  // Обновление свойств компонента, если переданы данные
        }
        return this.container;  // Возвращение контейнера компонента
    }

    // Защищенный метод для поиска элемента в контейнере по селектору
    protected findElement<T extends HTMLElement>(selector: string): T | null {
        return this.container.querySelector<T>(selector);
    }

    // Защищенный метод для поиска всех элементов в контейнере по селектору
    protected findElements<T extends HTMLElement>(selector: string): NodeListOf<T> {
        return this.container.querySelectorAll<T>(selector);
    }
}

