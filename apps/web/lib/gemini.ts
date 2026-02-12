import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || 'MISSING_KEY');
const BASE_URL = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/';
export async function findBestImageForProduct(productName: string): Promise<string> {
    const defaultImage = `${BASE_URL}1f9fa.png`;
    const lowerName = productName.toLowerCase();
    const emojiMap: Record<string, string> = {
        'молоко': '1f95b',
        'хлеб': '1f35e',
        'сыр': '1f9c0',
        'яйца': '1f95a',
        'яйцо': '1f95a',
        'курица': '1f357',
        'мясо': '1f969',
        'колбаса': '1f953',
        'рыба': '1f41f',
        'тунец': '1f41f',
        'мука': '1f33e',
        'сахар': '1f9c2',
        'масло': '1f9c8',
        'картошка': '1f954',
        'морковь': '1f955',
        'лук': '1f9c5',
        'чеснок': '1f9c4',
        'майонез': '1f95b',
        'горошек': '1f95c',
        'творог': '1f9c0',
        'сметана': '1f95b',
        'бургер': '1f354',
        'пицца': '1f355',
        'шоколад': '1f36b',
        'мороженое': '1f366',
        'торт': '1f370',
        'кофе': '2615',
        'чай': '1f375',
        'яблоко': '1f34e',
        'банан': '1f34c',
        'апельсин': '1f34a',
        'клубника': '1f353',
        'малина': '1f347',
        'грибы': '1f344',
    };
    for (const key in emojiMap) {
        if (lowerName.includes(key)) {
            return `${BASE_URL}${emojiMap[key]}.png`;
        }
    }
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `
                I need a Twemoji hex code for a food product named "${productName}".
                Return ONLY the lowercase hex code (e.g. "1f34e" for apple). 
                If you can't find a good match, return "1f9fa" (basket).
                Do not explain. Just the code.
            `;
            const result = await model.generateContent(prompt);
            const text = result.response.text().trim().toLowerCase().replace(/['"`]/g, '');
            if (/^[a-f0-9-]+$/.test(text)) {
                return `${BASE_URL}${text}.png`;
            }
        } catch (e) {
        }
    }
    return defaultImage;
}
