import { IEvents } from './events';

// Абстрактный класс Model, предназначенный для работы с данными и их изменениями
export abstract class Model<T> {
    // Конструктор класса, принимающий начальные данные и экземпляр интерфейса IEvents для работы с событиями
    constructor(data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data);  // Инициализация модели переданными данными
    }

    // Метод для генерации событий о изменениях в данных модели
    emitChanges(event: string, payload?: object) {
        this.events.emit(event, payload ?? {});  // Генерация события с передачей данных (payload)
    }
}