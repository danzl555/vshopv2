// helpers.js

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
