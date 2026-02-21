import { cookies } from 'next/headers';
import { dictionaries } from './dictionaries';

export async function getDictionary() {
    const lang = (await cookies()).get('lang')?.value || 'ru';
    return dictionaries[lang as keyof typeof dictionaries] || dictionaries.ru;
}

export async function getCurrentLang() {
    return (await cookies()).get('lang')?.value || 'ru';
}

export async function translateText(text: string, targetLang: string): Promise<string> {
    if (!text || targetLang === 'ru') return text;
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        const data = await res.json();
        return data[0].map((item: any[]) => item[0]).join('');
    } catch {
        return text;
    }
}
