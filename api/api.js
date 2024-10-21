export async function fetchProducts() {
    try {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        throw error;
    }
}