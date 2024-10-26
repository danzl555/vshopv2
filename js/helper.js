export function getUniqueTags(products) {
    // Константы
    const WARNING_MESSAGE = 'Продукты не загружены или неверный формат данных';
    const EMPTY_ARRAY = []; // Пустой массив для возвращения

    if (!products || !Array.isArray(products)) {
        console.warn(WARNING_MESSAGE);
        return EMPTY_ARRAY; // Возвращаем пустой массив, если данные неверные
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
    // Константы
    const WARNING_MESSAGE = 'Продукты не загружены или неверный формат данных';
    const EMPTY_ARRAY = []; // Пустой массив для возвращения

    if (!products || !Array.isArray(products)) {
        console.warn(WARNING_MESSAGE);
        return EMPTY_ARRAY; // Возвращаем пустой массив, если данные неверные
    }

    const brands = new Set();
    products.forEach(product => {
        if (product.brand) {
            brands.add(product.brand);
        }
    });

    return Array.from(brands);
}
