import { Card } from './card.js';
import { Filter } from './filter.js';

export class Catalog {
    constructor(products, catalogRoot, cart) {
        this.products = products;
        this.cart = cart;
        this.catalogRoot = catalogRoot;  // Передаём рут элемент
        this.productCache = {}; // для кэширования карточек
        this.currentProductIndex = 0;
        this.productsPerPage = 9;
        this.showMoreButton = document.createElement('button');
        this.init();
    }

    init() {
        this.showMoreButton.textContent = 'Show More';
        this.showMoreButton.classList.add('show-more-button');
        this.catalogRoot.appendChild(this.showMoreButton);

        // Инициализируем фильтры
        this.filter = new Filter(this);
        this.loadMoreProducts();

        this.showMoreButton.addEventListener('click', () => this.loadMoreProducts());
    }

    filterProducts() {
        this.currentProductIndex = 0; // Сбрасываем индекс перед фильтрацией
        this.catalogRoot.innerHTML = ''; // Очищаем каталог перед отображением отфильтрованных карточек
        this.catalogRoot.appendChild(this.showMoreButton); // Сохраняем кнопку "Показать больше"

        // Фильтруем продукты по выбранным тегам и брендам
        const filteredProducts = this.products.filter(product => {
            const matchesTags = this.filter.activeTags.size === 0 || product.tags.some(tag => this.filter.activeTags.has(tag));
            const matchesBrand = this.filter.activeBrands.size === 0 || this.filter.activeBrands.has(product.brand);
            return matchesTags && matchesBrand;
        });

        this.loadFilteredProducts(filteredProducts);
    }

    loadFilteredProducts(filteredProducts) {
        const endIndex = Math.min(this.currentProductIndex + this.productsPerPage, filteredProducts.length);

        for (let i = this.currentProductIndex; i < endIndex; i++) {
            const product = filteredProducts[i];

            if (!this.productCache[product.id]) {
                const card = new Card(product);
                this.productCache[product.id] = card.render();
            }

            this.catalogRoot.insertBefore(this.productCache[product.id], this.showMoreButton);
        }

        this.currentProductIndex += this.productsPerPage;

        this.showMoreButton.style.display = this.currentProductIndex >= filteredProducts.length ? 'none' : 'block';
    }

    loadMoreProducts() {
        const endIndex = Math.min(this.currentProductIndex + this.productsPerPage, this.products.length);

        for (let i = this.currentProductIndex; i < endIndex; i++) {
            const product = this.products[i];

            if (!this.productCache[product.id]) {
                const card = new Card(product);
                this.productCache[product.id] = card.render();
            }

            this.catalogRoot.insertBefore(this.productCache[product.id], this.showMoreButton);
        }

        this.currentProductIndex += this.productsPerPage;

        if (this.currentProductIndex >= this.products.length) {
            this.showMoreButton.style.display = 'none';
        }
    }
}
