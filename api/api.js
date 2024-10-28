export async function loadProducts(offset = 0, limit = 6) {
    try {
        const response = await fetch(
            `https://dummyjson.com/products?limit=${limit}&skip=${offset}`
        );
        const data = await response.json();
        return {
            products: data.products,
            total: data.total, // Общее количество товаров на сервере
        };
    } catch (error) {
        console.error('Ошибка загрузки каталога:', error);
        return { products: [], total: 0 };
    }
}

export function getUniqueTags(products) {
    if (!products || !Array.isArray(products)) {
        console.warn('Продукты не загружены или неверный формат данных');
        return []; // Возвращаем пустой массив, если данные неверные
    }

    const tags = new Set();
    products.forEach(product => {
        if (product.tags && Array.isArray(product.tags)) {
            product.tags.forEach(tag => tags.add(tag));
        }
    });
    return Array.from(tags);
}

export function getUniqueBrands(products) {
    if (!products || !Array.isArray(products)) {
        console.warn('Продукты не загружены или неверный формат данных');
        return []; // Возвращаем пустой массив, если данные неверные
    }

    const brands = new Set();
    products.forEach(product => {
        if (product.brand) {
            brands.add(product.brand);
        }
    });
    return Array.from(brands);
}
