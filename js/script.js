import { Cart } from './bascket.js';
import { Catalog } from './catalog.js';
import { fetchProducts } from '../api/api.js';

async function initApp() {
    try {
        const products = await fetchProducts();

        const catalogRoot = document.getElementById('catalog-root'); // Рут для каталога
        const cartRoot = document.getElementById('cart-root'); // Рут для корзины

        const cart = new Cart(cartRoot); 
        const catalog = new Catalog(products, catalogRoot, cart);

    } catch (error) {
        console.error('Ошибка при инициализации приложения:', error);
    }
}

window.addEventListener("DOMContentLoaded", initApp);
