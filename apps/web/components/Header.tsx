'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function Header({ user }: { user?: { name?: string | null, email?: string | null } }) {
    const pathname = usePathname();
    const links = [
        { href: '/', label: '❄️ Холодильник' },
        { href: '/pantry', label: '🍪 Шкаф' },
        { href: '/recipes', label: '📖 Рецепты' },
        { href: '/create', label: '✏️ Создать' },
        { href: '/shopping-list', label: '🛒 Список' },
    ];
    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="font-heading font-black text-lg md:text-2xl text-slate-800 tracking-tight hover:text-blue-600 transition-colors whitespace-nowrap">
                        КОТО-УЧЁТ 🐾
                    </Link>
                </div>
                <div className="hidden md:flex gap-1 bg-slate-100/50 p-1 rounded-2xl">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
                <div className="flex items-center gap-2">
                    {user ? (
                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                            <span className="text-xl">😺</span>
                            <span className="text-sm font-bold text-blue-800">Привет, {user.name || user.email?.split('@')[0]}!</span>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-slate-800 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-900 transition-all shadow-md active:scale-95"
                        >
                            Войти
                        </Link>
                    )}
                </div>
            </div>
            { }
        </nav>
    );
}
