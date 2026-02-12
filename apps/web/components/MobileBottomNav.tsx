'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileBottomNav() {
    const pathname = usePathname();
    const links = [
        { href: '/', label: 'Холодильник', icon: '❄️' },
        { href: '/pantry', label: 'Шкаф', icon: '🍪' },
        { href: '/recipes', label: 'Рецепты', icon: '📖' },
        { href: '/shopping-list', label: 'Список', icon: '🛒' },
        { href: '/create', label: 'Создать', icon: '✏️' },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-100 px-2 py-3 z-50 flex justify-around items-center shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
            {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-blue-600 scale-110' : 'text-slate-400'
                            }`}
                    >
                        <span className="text-xl">{link.icon}</span>
                        <span className="text-[10px] font-bold uppercase tracking-tight">
                            {link.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
