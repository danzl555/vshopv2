import { Card } from './card.js';

export class Catalog {
    constructor(products, cart) {
        this.products = products;
        this.cart = cart;
        this.catalogRoot = document.getElementById('product-container'); 
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

        this.loadMoreProducts();
        this.showMoreButton.addEventListener('click', () => this.loadMoreProducts());
    }

    loadMoreProducts() {
        const endIndex = Math.min(this.currentProductIndex + this.productsPerPage, this.products.length);

        for (let i = this.currentProductIndex; i < endIndex; i++) {
            const product = this.products[i];

            // Проверяем кэш или создаём новую карточку через класс Card
            if (!this.productCache[product.id]) {
                const card = new Card(product);
                this.productCache[product.id] = card.render();
            }

            // Выводим кэш в консоль для проверки
            console.log(`Product ID ${product.id} added to cache`, this.productCache);

            this.catalogRoot.insertBefore(this.productCache[product.id], this.showMoreButton);
        }

        this.currentProductIndex += this.productsPerPage;

        if (this.currentProductIndex >= this.products.length) {
            this.showMoreButton.style.display = 'none';
        }
    }
}
