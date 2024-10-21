export class Cart {
    constructor() {
        this.cartItems = {};
        this.cartRoot = document.querySelector('.product-cart-bascket'); // root элемент корзины
        this.totalPriceElement = document.querySelector('.total__price');
        this.initFromLocalStorage();

        // Добавляем слушатель для кастомного события добавления товара в корзину
        document.addEventListener('productAdded', (event) => {
            this.addToCart(event.detail);
        });
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
        let cartItem = this.cartRoot.querySelector(`.cart-item-${product.id}`);

        if (!cartItem) {
            cartItem = document.createElement('div');
            cartItem.classList.add('product-card', `cart-item-${product.id}`);

            cartItem.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}" />
                <div class="product-info">
                    <h3>${product.title}</h3>
                    <p class="quantity">x${quantity}</p>
                    <p class="price">$${(quantity * product.price).toFixed(2)}</p>
                </div>
                <span class="close-btn">&times;</span>
            `;

            const closeBtn = cartItem.querySelector('.close-btn');
            closeBtn.addEventListener('click', () => this.removeFromCart(product.id));

            this.cartRoot.appendChild(cartItem);
        } else {
            const quantityElement = cartItem.querySelector('.quantity');
            const priceElement = cartItem.querySelector('.price');
            quantityElement.textContent = `x${quantity}`;
            priceElement.textContent = `$${(quantity * product.price).toFixed(2)}`;
        }
    }

    removeFromCart(productId) {
        const cartItem = this.cartRoot.querySelector(`.cart-item-${productId}`);
        cartItem.remove();
        delete this.cartItems[productId];
        this.updateTotalPrice();
        this.saveToLocalStorage();
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
        this.cartRoot.innerHTML = '';
        this.updateTotalPrice();
        localStorage.removeItem('cartItems');
    }
}
