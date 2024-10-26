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
        this.currentProductIndex = 0;
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
        try {
            const { products, total } = await loadProducts(0, Catalog.PRODUCTS_PER_PAGE);
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
            console.error('Ошибка при инициализации каталога:', error);
        }

        this.showMoreButton.addEventListener('click', async () => {
            await this.loadMoreProducts();
            this.resetFilters();
            this.productsContainer.innerHTML = '';
            this.renderProducts(Object.values(this.productCache));
        });
    }

    resetFilters() {
        this.filter.activeTags.clear();
        this.filter.activeBrands.clear();
        this.filter.updateFilters(Object.values(this.productCache));
    }

    cacheProducts(products) {
        products.forEach(product => {
            if (!this.productCache[product.id]) {
                this.productCache[product.id] = product;
            }
        });
        console.log('Кэшированные продукты:', this.productCache);
    }

    renderProducts(products) {
        products.forEach(product => {
            if (!this.productCache[product.id]) return;
            const card = new Card(product);
            card.addToCartCallback = () => this.cart.addToCart(product);
            this.productsContainer.appendChild(card.render());
        });
        this.currentProductIndex += products.length;

        if (this.currentProductIndex >= this.totalProducts) {
            this.showMoreContainer.style.display = 'none';
        }
    }

    async loadMoreProducts() {
        if (this.currentProductIndex >= this.totalProducts) {
            this.showMoreContainer.style.display = 'none';
            return;
        }

        try {
            const { products } = await loadProducts(this.currentProductIndex, Catalog.PRODUCTS_PER_PAGE);
            this.cacheProducts(products);
        } catch (error) {
            console.error('Ошибка при загрузке дополнительных продуктов:', error);
        }
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
