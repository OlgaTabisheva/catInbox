const BASE_URL = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/';

export const productImages: Record<string, string> = {
    'Сыр': `${BASE_URL}1f9c0.png`,
    'Творог': `${BASE_URL}1f9c0.png`,
    'Молоко': `${BASE_URL}1f95b.png`,
    'Масло': `${BASE_URL}1f9c8.png`,
    'Колбаса': `${BASE_URL}1f953.png`,
    'Курица': `${BASE_URL}1f357.png`,
    'Замороженная малина': `${BASE_URL}1f347.png`,
    'Горошек': `${BASE_URL}1f95c.png`,
    'Майонез': `${BASE_URL}1f95b.png`,
    'Яйца': `${BASE_URL}1f95a.png`,
    'Мука': `${BASE_URL}1f33e.png`,
    'Сахар': `${BASE_URL}1f9c2.png`,
    'Мюсли': `${BASE_URL}1f963.png`,
    'Хлеб': `${BASE_URL}1f35e.png`,
    'Тунец в с/с': `${BASE_URL}1f41f.png`,
    'Соевый соус': `${BASE_URL}1f375.png`,
    'Грибы древесные черные': `${BASE_URL}1f344.png`,
    'Грибы древесные белые': `${BASE_URL}1f344.png`,
};

export const FALLBACK_IMAGE = `${BASE_URL}1f9fa.png`;

export function getProductImage(name: string): string {
    const found = Object.keys(productImages).find(key => key.toLowerCase() === name.toLowerCase());
    return found ? (productImages as any)[found] : FALLBACK_IMAGE;
}
