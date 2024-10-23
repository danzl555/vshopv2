import { fetchProducts, getUniqueTags, getUniqueBrands } from '../api/api';

export class Filter {
    constructor(catalog) {
        this.catalog = catalog;
        this.activeTags = new Set(); // Храним выбранные теги
        this.activeBrands = new Set(); // Храним выбранные бренды
        this.initFilters();
        this.setupFilterButton(); // Настраиваем кнопку фильтров
    }

    async initFilters() {
        try {
            this.products = await this.fetchAllProducts(); // Загружаем все продукты

            // Получаем уникальные теги и бренды
            const uniqueTags = getUniqueTags(this.products);
            const uniqueBrands = getUniqueBrands(this.products);

            // Находим контейнеры для фильтров
            const tagsFilterContainer = document.querySelector('.filter__tags-filter');
            const brandsFilterContainer = document.querySelector('.filter__brands-filter');

            // Создаём чекбоксы для тегов и брендов
            this.createCheckboxes(uniqueTags, tagsFilterContainer, 'tag');
            this.createCheckboxes(uniqueBrands, brandsFilterContainer, 'brand');
        } catch (error) {
            console.error('Ошибка при инициализации фильтров:', error);
        }
    }

    async fetchAllProducts() {
        const allProducts = [];
        let skip = 0;
        const limit = 30; // Задаем лимит на количество товаров за один запрос

        while (true) {
            const response = await fetch(`https://dummyjson.com/products?skip=${skip}&limit=${limit}`);
            const data = await response.json();
            allProducts.push(...data.products);

            // Проверяем, есть ли еще продукты
            if (allProducts.length >= data.total) {
                break; // Если загружено больше или равно общему количеству, выходим из цикла
            }

            skip += limit; // Увеличиваем количество пропускаемых товаров
        }

        return allProducts; // Возвращаем все загруженные продукты
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
            checkbox.checked = type === 'tag' ? this.activeTags.has(item) : this.activeBrands.has(item);

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(item));

            container.appendChild(label);

            // Обработка изменения состояния чекбокса
            label.addEventListener('click', () => {
                if (checkbox.checked) {
                    if (type === 'tag') {
                        this.activeTags.delete(item);
                        label.classList.remove('active'); // Убираем активный стиль
                    } else {
                        this.activeBrands.delete(item);
                        label.classList.remove('active'); // Убираем активный стиль
                    }
                    checkbox.checked = false;
                } else {
                    if (type === 'tag') {
                        this.activeTags.add(item);
                        label.classList.add('active'); // Добавляем активный стиль
                    } else {
                        this.activeBrands.add(item);
                        label.classList.add('active'); // Добавляем активный стиль
                    }
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
            if (filterContainer.style.display === 'none' || filterContainer.style.display === '') {
                filterContainer.style.display = 'block'; // Показываем фильтры
            } else {
                filterContainer.style.display = 'none'; // Скрываем фильтры
            }
        });
    }
}
