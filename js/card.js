export class Card {
    constructor(product) {
        this.product = product;
        this.element = this.createCard();
    }

    createCard() {
        const card = document.createElement('div');
        card.classList.add('card');

        // Создаем элементы карточки
        const image = document.createElement('img');
        image.src = this.product.thumbnail;
        image.classList.add('product-image');
        image.alt = this.product.title;

        const title = document.createElement('h2');
        title.classList.add('title');
        title.textContent = this.product.title;

        const description = document.createElement('p');
        description.classList.add('desc');
        description.textContent = this.product.description;

        const priceCartDiv = document.createElement('div');
        priceCartDiv.classList.add('price-cart');

        const price = document.createElement('p');
        price.classList.add('price');
        price.textContent = `$${this.product.price}`;

        const buyButton = document.createElement('button');
        buyButton.classList.add('buy-button');

        const buyButtonIcon = document.createElement('img');
        buyButtonIcon.src = './cart-icon.svg';
        buyButtonIcon.alt = 'cart icon';

        buyButton.appendChild(buyButtonIcon);

        // Привязываем событие к кнопке
        buyButton.addEventListener('click', () => {
            // Кастомное событие для добавления товара в корзину
            const event = new CustomEvent('productAdded', { detail: this.product });
            document.dispatchEvent(event);
        });

        priceCartDiv.appendChild(price);
        priceCartDiv.appendChild(buyButton);

        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(priceCartDiv);

        return card;
    }

    render() {
        return this.element;
    }
}
