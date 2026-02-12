import { db } from './index';
import { products, recipes } from './schema';


const fridgeItems = [
    { name: 'Сыр', location: 'fridge', inStock: false, imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f9c0.png' },
    { name: 'Творог', location: 'fridge', inStock: false, imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f9c0.png' },
    { name: 'Молоко', location: 'fridge', inStock: false, imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f95b.png' },
    { name: 'Масло', location: 'fridge', inStock: true, imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f9c8.png' },
    { name: 'Колбаса', location: 'fridge', inStock: true, imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f953.png' }, 
    { name: 'Курица', location: 'fridge', inStock: false, imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f357.png' },
    { name: 'Замороженная малина', location: 'fridge', inStock: false, imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f353.png' },
    { name: 'Горошек', location: 'fridge', inStock: true, imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1fad8.png' }, 
    { name: 'Майонез', location: 'fridge', inStock: false, imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f95b.png' },
    { name: 'Яйца', location: 'fridge', inStock: false, imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f95a.png' },
];

const pantryItems = [
    { name: 'Мука', location: 'pantry', inStock: true, imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f33e.png' },
    { name: 'Сахар', location: 'pantry', inStock: true, imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f9c2.png' }, 
    { name: 'Мюсли', location: 'pantry', inStock: true, imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f963.png' }, 
    { name: 'Хлеб', location: 'pantry', inStock: false, imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f35e.png' },
    { name: 'Тунец в с/с', location: 'pantry', inStock: false, imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f41f.png' },
    { name: 'Соевый соус', location: 'pantry', inStock: false, imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f376.png' }, 
    { name: 'Грибы древесные черные', location: 'pantry', inStock: false, imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f344.png' },
    { name: 'Грибы древесные белые', location: 'pantry', inStock: false, imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f344.png' },
];

const initialRecipes = [
    {
        title: 'Панкейки',
        ingredients: ['Мука', 'Молоко', 'Яйца', 'Сахар', 'Масло'],
        steps: '1. Смешайте сухие ингредиенты.\n2. Добавьте молоко и яйца.\n3. Жарьте на сковороде до золотистой корочки.',
        isFavorite: true,
    },
    {
        title: 'Омлет с колбасой',
        ingredients: ['Яйца', 'Колбаса', 'Молоко', 'Масло'],
        steps: '1. Взбейте яйца с молоком.\n2. Обжарьте колбасу.\n3. Залейте яйцами и готовьте под крышкой.',
        isFavorite: true,
    },
    {
        title: 'Салат с тунцом',
        ingredients: ['Тунец в с/с', 'Яйца', 'Майонез', 'Горошек'],
        steps: '1. Отварите яйца.\n2. Смешайте тунец, нарезанные яйца и горошек.\n3. Заправьте майонезом.',
        isFavorite: true,
    }
];

async function seed() {
    console.log('Seeding products...');
    console.log('Clearing old data...');
    await db.delete(products);
    await db.delete(recipes);

    await db.insert(products).values([...fridgeItems, ...pantryItems] as any);
    console.log('Seeding recipes...');
    await db.insert(recipes).values(initialRecipes as any);
    console.log('Done!');
    process.exit(0);
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
