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
        this.showMoreButton = document.createElement('button');
        this.showMoreButton.textContent = 'Show More';
        this.showMoreButton.classList.add('show-more-button');
        this.catalogRoot.appendChild(this.showMoreButton);

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

        this.showMoreButton.addEventListener('click', () => this.loadMoreProducts());
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
            this.catalogRoot.insertBefore(card.render(), this.showMoreButton);
        });
        this.currentProductIndex += products.length;

        // Прячем кнопку, если загружены все продукты
        if (this.currentProductIndex >= this.totalProducts) {
            this.showMoreButton.style.display = 'none';
        }
    }

    async loadMoreProducts() {
        if (this.currentProductIndex >= this.totalProducts) {
            this.showMoreButton.style.display = 'none';
            return;
        }

        const { products } = await loadProducts(this.currentProductIndex, this.productsPerPage);
        this.cacheProducts(products);
        this.renderProducts(products);

        // Обновляем фильтры на основе всех загруженных продуктов
        this.filter.updateFilters(Object.values(this.productCache));
    }

    filterProducts() {
        this.catalogRoot.innerHTML = ''; // Очищаем каталог
        this.catalogRoot.appendChild(this.showMoreButton); // Оставляем кнопку
        const filteredProducts = Object.values(this.productCache).filter(product => {
            const matchesTags = this.filter.activeTags.size === 0 || product.tags.some(tag => this.filter.activeTags.has(tag));
            const matchesBrand = this.filter.activeBrands.size === 0 || this.filter.activeBrands.has(product.brand);
            return matchesTags && matchesBrand;
        });
        this.renderProducts(filteredProducts);
    }
}
