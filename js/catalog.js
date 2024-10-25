import { Card } from './card.js';
import { Filter } from './filter.js';
import { loadProducts } from '../api/api.js';

export class Catalog {
    constructor(catalogRoot, cart) {
        this.cart = cart;
        this.catalogRoot = catalogRoot;
        this.productCache = {}; // Кэш для всех загруженных продуктов
        this.currentProductIndex = 0;
        this.productsPerPage = 9; // Загрузка по 9 продуктов за раз
        this.totalProducts = 0; // Общее количество продуктов на сервере

        // Создаем контейнер для товаров
        this.productsContainer = document.createElement('div');
        this.productsContainer.classList.add('products-container');

        // Создаем контейнер для кнопки "Show More"
        this.showMoreContainer = document.createElement('div');
        this.showMoreContainer.classList.add('show-more-container');

        // Создаем кнопку "Show More"
        this.showMoreButton = document.createElement('button');
        this.showMoreButton.textContent = 'Show More';
        this.showMoreButton.classList.add('show-more-button');

        // Вставляем кнопку в контейнер для кнопки
        this.showMoreContainer.appendChild(this.showMoreButton);

        // Добавляем контейнер товаров и контейнер с кнопкой "Show More" в корневой элемент каталога
        this.catalogRoot.append(this.productsContainer, this.showMoreContainer);

        this.init();
    }

    async init() {
        try {
            // Загружаем первые продукты
            const { products, total } = await loadProducts(0, this.productsPerPage);
            this.totalProducts = total;

            if (products && products.length > 0) {
                this.cacheProducts(products);
                this.renderProducts(products);
                this.filter = new Filter(this); // Инициализируем фильтры
                this.filter.updateFilters(Object.values(this.productCache)); // Обновляем фильтры
            } else {
                console.warn('Не удалось загрузить продукты');
            }
        } catch (error) {
            console.error('Ошибка при инициализации каталога:', error);
        }

        this.showMoreButton.addEventListener('click', async () => {
            // Загрузить больше продуктов
            await this.loadMoreProducts();
            // Сбросить фильтры вручную
            this.resetFilters();
            // Очищаем контейнер, но оставляем все кэшированные продукты
            this.productsContainer.innerHTML = '';
            // Рендерим все продукты (включая новые загруженные)
            this.renderProducts(Object.values(this.productCache));
        });
    }

    // Функция для сброса фильтров вручную
    resetFilters() {
        this.filter.activeTags.clear(); // Сбрасываем активные теги
        this.filter.activeBrands.clear(); // Сбрасываем активные бренды
        this.filter.updateFilters(Object.values(this.productCache)); // Обновляем фильтры
    }

    // Функция для кэширования продуктов
    cacheProducts(products) {
        products.forEach(product => {
            if (!this.productCache[product.id]) {
                this.productCache[product.id] = product;
            }
        });
        console.log('Кэшированные продукты:', this.productCache);
    }

    // Отображение продуктов на странице
    renderProducts(products) {
        products.forEach(product => {
            if (!this.productCache[product.id]) return; // Проверяем кэш
            const card = new Card(product);
            // Добавляем слушатель на событие для добавления в корзину
            card.addToCartCallback = () => this.cart.addToCart(product);
            this.productsContainer.appendChild(card.render()); // Добавляем карточку в контейнер товаров
        });
        this.currentProductIndex += products.length;

        // Прячем кнопку, если загружены все продукты
        if (this.currentProductIndex >= this.totalProducts) {
            this.showMoreContainer.style.display = 'none'; // Скрываем контейнер с кнопкой
        }
    }

    async loadMoreProducts() {
        if (this.currentProductIndex >= this.totalProducts) {
            this.showMoreContainer.style.display = 'none'; // Скрываем контейнер с кнопкой
            return;
        }

        try {
            const { products } = await loadProducts(this.currentProductIndex, this.productsPerPage);
            this.cacheProducts(products); // Кэшируем новые продукты
        } catch (error) {
            console.error('Ошибка при загрузке дополнительных продуктов:', error);
        }
    }

    filterProducts() {
        this.productsContainer.innerHTML = ''; // Очищаем контейнер товаров
        const filteredProducts = Object.values(this.productCache).filter(product => {
            const matchesTags = this.filter.activeTags.size === 0 || product.tags.some(tag => this.filter.activeTags.has(tag));
            const matchesBrand = this.filter.activeBrands.size === 0 || this.filter.activeBrands.has(product.brand);
            return matchesTags && matchesBrand;
        });
        this.renderProducts(filteredProducts);
    }
}
