import { Card } from './card.js';
import { Filter } from './filter.js';
import { loadProducts } from '../api/api.js';

export class Catalog {
    static PRODUCTS_PER_PAGE = 9;
    static SHOW_MORE_BUTTON_TEXT = 'Show More';
    static WARN_LOAD_FAILED = 'Не удалось загрузить продукты';
    static WARN_INVALID_DATA = 'Продукты не загружены или неверный формат данных';

    constructor(catalogRoot, cart, filterRoot) {
        this.cart = cart;
        this.catalogRoot = catalogRoot;
        this.filterRoot = filterRoot;
        this.productCache = {};
        this.currentProductId = 0; // Начинаем с ID 1
        this.totalProducts = 0;

        this.productsContainer = document.createElement('div');
        this.productsContainer.classList.add('products-container');

        this.showMoreContainer = document.createElement('div');
        this.showMoreContainer.classList.add('show-more-container');

        this.showMoreButton = document.createElement('button');
        this.showMoreButton.textContent = Catalog.SHOW_MORE_BUTTON_TEXT;
        this.showMoreButton.classList.add('show-more-button');
        this.showMoreContainer.appendChild(this.showMoreButton);

        this.catalogRoot.append(this.productsContainer, this.showMoreContainer);

        this.init();
    }

    async init() {
        await this.loadInitialProducts();
        this.showMoreButton.addEventListener('click', async () => {
            await this.loadMoreProducts();
        });
    }

    async loadInitialProducts() {
        try {
            const { products, total } = await loadProducts(this.currentProductId, Catalog.PRODUCTS_PER_PAGE);
            this.totalProducts = total;

            if (products && products.length > 0) {
                this.cacheProducts(products);
                this.renderProducts(products);

                // Инициализация фильтров только после успешной загрузки продуктов
                this.filter = new Filter(this.filterRoot, this); 
                this.filter.updateFilters(Object.values(this.productCache));
            } else {
                console.warn(Catalog.WARN_LOAD_FAILED);
            }
        } catch (error) {
            console.error('Ошибка при загрузке начальных продуктов:', error);
        }
    }

    cacheProducts(products) {
        products.forEach(product => {
            if (!this.productCache[product.id]) {
                this.productCache[product.id] = product;
            }
        });
        console.log('Кэшированные продукты:', this.productCache);
        this.currentProductId += products.length; // Обновляем текущий ID
    }

    renderProducts(products) {
        this.productsContainer.innerHTML = ''; // Очищаем контейнер перед рендерингом
        products.forEach(product => {
            if (!this.productCache[product.id]) return;
            const card = new Card(product);
            card.addToCartCallback = () => this.cart.addToCart(product);
            this.productsContainer.appendChild(card.render());
        });
    }

    async loadMoreProducts() {
        if (this.currentProductId > this.totalProducts) {
            this.showMoreContainer.style.display = 'none'; // Скрываем кнопку, если все продукты загружены
            return;
        }

        try {
            const { products } = await loadProducts(this.currentProductId, Catalog.PRODUCTS_PER_PAGE);
            if (products && products.length > 0) {
                this.cacheProducts(products);
                this.resetFilters(); // Сбрасываем фильтры перед рендерингом
                this.renderProducts(Object.values(this.productCache)); // Рендерим все кэшированные продукты
            }
        } catch (error) {
            console.error('Ошибка при загрузке дополнительных продуктов:', error);
        }
    }

    resetFilters() {
        this.filter.activeTags.clear();
        this.filter.activeBrands.clear();
        this.filter.updateFilters(Object.values(this.productCache)); // Обновляем фильтры с учетом всех кэшированных продуктов
    }

    filterProducts() {
        this.productsContainer.innerHTML = '';
        const filteredProducts = Object.values(this.productCache).filter(product => {
            const matchesTags = this.filter.activeTags.size === 0 || product.tags.some(tag => this.filter.activeTags.has(tag));
            const matchesBrand = this.filter.activeBrands.size === 0 || this.filter.activeBrands.has(product.brand);
            return matchesTags && matchesBrand;
        });
        this.renderProducts(filteredProducts);
    }
}
