import { loadProducts } from '../api/api.js';
import { getUniqueTags, getUniqueBrands } from './helper.js';

export class Filter {
    // Константы
    static FILTER_CONTAINER_DISPLAY = 'block'; // Значение для отображения фильтра
    static FILTER_CONTAINER_HIDE = 'none'; // Значение для скрытия фильтра
    static CHECKBOX_TYPE_TAG = 'tag'; // Тип для тегов
    static CHECKBOX_TYPE_BRAND = 'brand'; // Тип для брендов

    constructor(catalog) {
        this.catalog = catalog;
        this.activeTags = new Set(); // Храним выбранные теги
        this.activeBrands = new Set(); // Храним выбранные бренды

        this.initFilters();
        this.setupFilterButton(); // Настраиваем кнопку фильтров
    }

    async initFilters() {
        try {
            // Инициализируем фильтры с кэшированными продуктами
            this.updateFilters(Object.values(this.catalog.productCache));
        } catch (error) {
            console.error('Ошибка при инициализации фильтров:', error);
        }
    }

    updateFilters(products) {
        if (!products || products.length === 0) {
            console.warn('Нет загруженных продуктов для обновления фильтров');
            return; // Если продуктов нет, ничего не делаем
        }

        // Получаем уникальные теги и бренды только из загруженных продуктов
        const uniqueTags = getUniqueTags(products);
        const uniqueBrands = getUniqueBrands(products);

        // Находим контейнеры для фильтров
        const tagsFilterContainer = document.querySelector('.filter__tags-filter');
        const brandsFilterContainer = document.querySelector('.filter__brands-filter');

        // Создаём чекбоксы для тегов и брендов
        this.createCheckboxes(uniqueTags, tagsFilterContainer, Filter.CHECKBOX_TYPE_TAG);
        this.createCheckboxes(uniqueBrands, brandsFilterContainer, Filter.CHECKBOX_TYPE_BRAND);
    }

    createCheckboxes(items, container, type) {
        container.innerHTML = ''; // Очищаем контейнер перед добавлением новых элементов

        items.forEach(item => {
            const label = document.createElement('label');
            label.classList.add('filter-label', 'label-card'); // Добавляем класс label-card для обводки

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = item;
            checkbox.name = `${type}-filter`;
            checkbox.classList.add(`${type}-checkbox`, 'checkbox-card'); // Добавляем класс checkbox-card
            checkbox.style.display = 'none'; // Скрываем стандартный чекбокс

            // Устанавливаем состояние чекбокса, если элемент уже выбран
            checkbox.checked = type === Filter.CHECKBOX_TYPE_TAG ? this.activeTags.has(item) : this.activeBrands.has(item);

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(item));

            container.appendChild(label);

            // Обработка изменения состояния чекбокса
            label.addEventListener('click', () => {
                if (checkbox.checked) {
                    if (type === Filter.CHECKBOX_TYPE_TAG) {
                        this.activeTags.delete(item);
                    } else {
                        this.activeBrands.delete(item);
                    }
                    label.classList.remove('active'); // Убираем активный стиль
                    checkbox.checked = false;
                } else {
                    if (type === Filter.CHECKBOX_TYPE_TAG) {
                        this.activeTags.add(item);
                    } else {
                        this.activeBrands.add(item);
                    }
                    label.classList.add('active'); // Добавляем активный стиль
                    checkbox.checked = true;
                }
                this.catalog.filterProducts();  // Обновляем отображение товаров в каталоге
            });
        });
    }

    setupFilterButton() {
        const filterButton = document.getElementById('filter-button');
        const filterContainer = document.querySelector('.filter');

        // Обработчик события для кнопки "Фильтры"
        filterButton.addEventListener('click', () => {
            // Переключаем отображение блока фильтров
            if (filterContainer.style.display === Filter.FILTER_CONTAINER_HIDE || filterContainer.style.display === '') {
                filterContainer.style.display = Filter.FILTER_CONTAINER_DISPLAY; // Показываем фильтры
            } else {
                filterContainer.style.display = Filter.FILTER_CONTAINER_HIDE; // Скрываем фильтры
            }
        });
    }
}
