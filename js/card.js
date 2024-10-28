export class Card {
    // Константы
    static CARD_CLASS = 'card'; // Класс карточки
    static PRODUCT_IMAGE_CLASS = 'product-image'; // Класс изображения продукта
    static TITLE_CLASS = 'title'; // Класс заголовка
    static DESC_CLASS = 'desc'; // Класс описания
    static PRICE_CART_CLASS = 'price-cart'; // Класс контейнера цены и кнопки
    static PRICE_CLASS = 'price'; // Класс цены
    static BUY_BUTTON_CLASS = 'buy-button'; // Класс кнопки покупки
    static BUY_BUTTON_ICON_SRC = './cart-icon.svg'; // Путь к иконке кнопки покупки
    static BUY_BUTTON_ICON_ALT = 'cart icon'; // Альтернативный текст для иконки

    constructor(product) {
        this.product = product;
        this.element = this.createCard();
    }

    createCard() {
        const card = document.createElement('div');
        card.classList.add(Card.CARD_CLASS);

        const image = document.createElement('img');
        image.src = this.product.thumbnail;
        image.classList.add(Card.PRODUCT_IMAGE_CLASS);
        image.alt = this.product.title;

        const title = document.createElement('h2');
        title.classList.add(Card.TITLE_CLASS);
        title.textContent = this.product.title;

        const description = document.createElement('p');
        description.classList.add(Card.DESC_CLASS);
        description.textContent = this.product.description;

        const priceCartDiv = document.createElement('div');
        priceCartDiv.classList.add(Card.PRICE_CART_CLASS);

        const price = document.createElement('p');
        price.classList.add(Card.PRICE_CLASS);
        price.textContent = `$${this.product.price.toFixed(2)}`;

        const buyButton = document.createElement('button');
        buyButton.classList.add(Card.BUY_BUTTON_CLASS);

        const buyButtonIcon = document.createElement('img');
        buyButtonIcon.src = Card.BUY_BUTTON_ICON_SRC;
        buyButtonIcon.alt = Card.BUY_BUTTON_ICON_ALT;

        buyButton.appendChild(buyButtonIcon);

        // Привязываем событие к кнопке
        buyButton.addEventListener('click', () => {
            if (this.addToCartCallback) {
                this.addToCartCallback(this.product); // Вызываем функцию добавления в корзину
            }
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
