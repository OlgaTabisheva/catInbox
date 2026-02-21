'use client';

import { useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
    const router = useRouter();
    const handleLang = (lang: string) => {
        document.cookie = `lang=${lang}; path=/`;
        router.refresh();
    };

    return (
        <div className="flex gap-2 text-xs font-bold text-sand80 bg-sandColorful10 px-2 py-1 rounded-full border border-sand30 mx-2">
            <button onClick={() => handleLang('ru')} className="hover:text-primary100 transition-colors">🇷🇺 RU</button>
            <span className="text-sand40">|</span>
            <button onClick={() => handleLang('en')} className="hover:text-primary100 transition-colors">🇬🇧 EN</button>
        </div>
    );
}
