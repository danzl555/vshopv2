export class Card {
    constructor(product) {
        this.product = product;
        this.element = this.createCard();
    }

    createCard() {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <img
                src="${this.product.thumbnail}"
                class="product-image"
                alt="${this.product.title}"
            />
            <h2 class="title">${this.product.title}</h2>
            <p class="desc">${this.product.description}</p>
            <div class="price-cart">
                <p class="price">$${this.product.price}</p>
                <button class="buy-button">
                    <img src="./cart-icon.svg" alt="cart icon" />
                </button>
            </div>
        `;

        const buyButton = card.querySelector('.buy-button');
        buyButton.addEventListener('click', () => {
            // кастомное событие для добавления товара в корзину
            const event = new CustomEvent('productAdded', { detail: this.product });
            document.dispatchEvent(event);
        });

        return card;
    }

    render() {
        return this.element;
    }
}
