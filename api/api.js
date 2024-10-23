// Функция для получения продуктов с API
export async function fetchProducts() {
    const allProducts = [];
    const limit = 30; // Количество товаров за один запрос
    let skip = 0; // Сколько товаров мы уже пропустили
    let total = 0; // Общее количество товаров

    try {
        do {
            const response = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
            const data = await response.json();
            total = data.total; // Общее количество товаров
            allProducts.push(...data.products); // Добавляем загруженные товары
            skip += limit; // Увеличиваем значение skip на количество загруженных товаров
        } while (skip < total); // Продолжаем, пока не загрузим все товары

        return allProducts; // Возвращаем все загруженные товары
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        throw error;
    }
}

// Функция для получения уникальных тегов из продуктов
export function getUniqueTags(products) {
    const allTags = products.flatMap(product => product.tags || []); // Используем flatMap для упрощения
    return [...new Set(allTags)]; // Возвращаем только уникальные теги
}

// Функция для получения уникальных брендов из продуктов
export function getUniqueBrands(products) {
    const allBrands = products.map(product => product.brand); // Собираем все бренды
    return [...new Set(allBrands)]; // Возвращаем только уникальные бренды
}
