'use client';
import { createContext, useContext } from 'react';
import { dictionaries } from '../lib/dictionaries';

const TranslationContext = createContext(dictionaries.en);

export function TranslationProvider({ lang, children }: { lang: 'en' | 'ru', children: React.ReactNode }) {
    return <TranslationContext.Provider value={dictionaries[lang] || dictionaries.en}>{children}</TranslationContext.Provider>;
}

export function useTranslation() {
    return useContext(TranslationContext);
}
