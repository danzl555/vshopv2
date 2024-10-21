import { Cart } from './bascket.js';
import { Catalog } from './catalog.js';
import { fetchProducts } from '../api/api.js';

async function initApp() {
    try {
        const products = await fetchProducts();
        const cart = new Cart();
        const catalog = new Catalog(products, cart);

        const checkoutButton = document.querySelector('.checkout-btn');
        checkoutButton.addEventListener('click', () => cart.checkout());
    } catch (error) {
        console.error('Ошибка при инициализации приложения:', error);
    }
}

window.addEventListener("DOMContentLoaded", initApp);
