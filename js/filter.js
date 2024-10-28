import { loadProducts } from '../api/api.js';
import { getUniqueTags, getUniqueBrands } from './helper.js';

export class Filter {
    // Константы
    static FILTER_CONTAINER_DISPLAY = 'block';
    static FILTER_CONTAINER_HIDE = 'none';
    static CHECKBOX_TYPE_TAG = 'tag';
    static CHECKBOX_TYPE_BRAND = 'brand';
    static ACTIVE_CLASS = 'active-filter'; // Новый класс для активных фильтров

    constructor(root, catalog) {
        this.root = root;
        this.catalog = catalog;
        this.activeTags = new Set();
        this.activeBrands = new Set();

        this.initFilters();
        this.setupFilterButton();
    }

    async initFilters() {
        try {
            this.updateFilters(Object.values(this.catalog.productCache));
        } catch (error) {
            console.error('Ошибка при инициализации фильтров:', error);
        }
    }

    updateFilters(products) {
        if (!products || products.length === 0) {
            console.warn('Нет загруженных продуктов для обновления фильтров');
            return;
        }

        const uniqueTags = getUniqueTags(products);
        const uniqueBrands = getUniqueBrands(products);

        const tagsFilterContainer = this.root.querySelector('.filter__tags-filter');
        const brandsFilterContainer = this.root.querySelector('.filter__brands-filter');

        this.createCheckboxes(uniqueTags, tagsFilterContainer, Filter.CHECKBOX_TYPE_TAG);
        this.createCheckboxes(uniqueBrands, brandsFilterContainer, Filter.CHECKBOX_TYPE_BRAND);
    }

    createCheckboxes(items, container, type) {
        container.innerHTML = '';

        items.forEach(item => {
            const label = document.createElement('label');
            label.classList.add('filter-label', 'label-card');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = item;
            checkbox.name = `${type}-filter`;
            checkbox.classList.add(`${type}-checkbox`, 'checkbox-card');
            checkbox.style.display = 'none';

            checkbox.checked = type === Filter.CHECKBOX_TYPE_TAG ? this.activeTags.has(item) : this.activeBrands.has(item);

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(item));

            // Применение стилей для активного состояния
            if (checkbox.checked) {
                label.classList.add(Filter.ACTIVE_CLASS);
            }

            container.appendChild(label);

            label.addEventListener('click', () => {
                if (checkbox.checked) {
                    if (type === Filter.CHECKBOX_TYPE_TAG) {
                        this.activeTags.delete(item);
                    } else {
                        this.activeBrands.delete(item);
                    }
                    label.classList.remove(Filter.ACTIVE_CLASS); // Убираем активный класс
                    checkbox.checked = false;
                } else {
                    if (type === Filter.CHECKBOX_TYPE_TAG) {
                        this.activeTags.add(item);
                    } else {
                        this.activeBrands.add(item);
                    }
                    label.classList.add(Filter.ACTIVE_CLASS); // Добавляем активный класс
                    checkbox.checked = true;
                }
                this.catalog.filterProducts();
            });
        });
    }

    setupFilterButton() {
        const filterButton = document.getElementById('filter-button');

        filterButton.addEventListener('click', () => {
            if (this.root.style.display === Filter.FILTER_CONTAINER_HIDE || this.root.style.display === '') {
                this.root.style.display = Filter.FILTER_CONTAINER_DISPLAY;
            } else {
                this.root.style.display = Filter.FILTER_CONTAINER_HIDE;
            }
        });
    }
}
