import { Cart } from './bascket.js';
import { Catalog } from './catalog.js';

async function initApp() {
    try {
        const catalogRoot = document.getElementById('catalog-root');
        const cartRoot = document.getElementById('cart-root');
        const filterRoot = document.getElementById('filter-root');

        const cart = new Cart(cartRoot);
        const catalog = new Catalog(catalogRoot, cart, filterRoot);
    } catch (error) {
        console.error('Ошибка при инициализации приложения:', error);
    }
}

window.addEventListener("DOMContentLoaded", initApp);
