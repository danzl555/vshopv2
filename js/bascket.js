export class Cart {
    // Константы
    static TOTAL_LABEL = 'Total: '; // Метка для общего итога
    static CHECKOUT_BUTTON_TEXT = 'CHECKOUT'; // Текст кнопки "CHECKOUT"

    constructor(cartRoot) {
        this.cartItems = {}; // Хранит товары в корзине
        this.cartRoot = cartRoot; // Корневой элемент корзины
        this.cartContent = this.createCartContent();
        this.initFromLocalStorage();

        // Слушатель событий для добавления продукта в корзину
        document.addEventListener('productAdded', (event) => {
            this.addToCart(event.detail);
        });
    }

    // Создание всех элементов корзины
    createCartContent() {
        const prodBasket = document.createElement('div');
        prodBasket.classList.add('prod-bascket');

        this.productCartBasket = document.createElement('div');
        this.productCartBasket.classList.add('product-cart-bascket');
        prodBasket.appendChild(this.productCartBasket); 

        const totalCheckout = document.createElement('div');
        totalCheckout.classList.add('total-checkout');

        const total = document.createElement('p');
        total.classList.add('total');
        total.textContent = Cart.TOTAL_LABEL; // Используем константу для метки

        this.totalPriceElement = document.createElement('span');
        this.totalPriceElement.classList.add('total__price');
        total.appendChild(this.totalPriceElement); 

        const checkoutButton = document.createElement('button');
        checkoutButton.classList.add('checkout-btn');
        checkoutButton.textContent = Cart.CHECKOUT_BUTTON_TEXT; // Используем константу для текста кнопки

        checkoutButton.addEventListener('click', () => this.checkout());

        totalCheckout.appendChild(total);
        totalCheckout.appendChild(checkoutButton);
        prodBasket.appendChild(totalCheckout);

        this.cartRoot.appendChild(prodBasket); 

        return this.productCartBasket; 
    }

    initFromLocalStorage() {
        if (localStorage.getItem('cartItems')) {
            this.cartItems = JSON.parse(localStorage.getItem('cartItems'));
            Object.values(this.cartItems).forEach(item => {
                this.displayCartItem(item.product, item.quantity);
            });
            this.updateTotalPrice();
        }
    }

    addToCart(product) {
        if (this.cartItems[product.id]) {
            this.cartItems[product.id].quantity++;
        } else {
            this.cartItems[product.id] = { product, quantity: 1 };
        }
        this.displayCartItem(product, this.cartItems[product.id].quantity);
        this.updateTotalPrice();
        this.saveToLocalStorage();
    }

    displayCartItem(product, quantity) {
        // Удаляем существующий элемент, если он уже есть
        const existingCartItem = this.productCartBasket.querySelector(`.cart-item-${product.id}`);
        
        if (!existingCartItem) {
            const newCartItem = document.createElement('div');
            newCartItem.classList.add('product-card', `cart-item-${product.id}`);

            const img = document.createElement('img');
            img.src = product.thumbnail;
            img.alt = product.title;

            const productInfo = document.createElement('div');
            productInfo.classList.add('product-info');

            const title = document.createElement('h3');
            title.textContent = product.title;

            const quantityElement = document.createElement('p');
            quantityElement.classList.add('quantity');
            quantityElement.textContent = `x${quantity}`;

            const priceElement = document.createElement('p');
            priceElement.classList.add('price');
            priceElement.textContent = `$${(quantity * product.price).toFixed(2)}`;

            productInfo.appendChild(title);
            productInfo.appendChild(quantityElement);
            productInfo.appendChild(priceElement);

            const closeBtn = document.createElement('span');
            closeBtn.classList.add('close-btn');
            closeBtn.innerHTML = '&times;';

            closeBtn.addEventListener('click', () => this.removeFromCart(product.id));

            newCartItem.appendChild(img);
            newCartItem.appendChild(productInfo);
            newCartItem.appendChild(closeBtn);

            this.productCartBasket.appendChild(newCartItem);
        } else {
            // Обновляем количество и цену существующего товара
            const quantityElement = existingCartItem.querySelector('.quantity');
            const priceElement = existingCartItem.querySelector('.price');
            quantityElement.textContent = `x${quantity}`;
            priceElement.textContent = `$${(quantity * product.price).toFixed(2)}`;
        }
    }

    removeFromCart(productId) {
        const cartItem = this.productCartBasket.querySelector(`.cart-item-${productId}`);
        
        if (cartItem) {
            cartItem.remove();
            delete this.cartItems[productId];
            this.updateTotalPrice();
            this.saveToLocalStorage();
        }
    }

    updateTotalPrice() {
        const total = Object.values(this.cartItems).reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        this.totalPriceElement.textContent = `$${total.toFixed(2)}`;
    }

    saveToLocalStorage() {
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }

    checkout() {
        this.cartItems = {};
        this.productCartBasket.innerHTML = '';
        this.updateTotalPrice();
        localStorage.removeItem('cartItems');
    }
}
