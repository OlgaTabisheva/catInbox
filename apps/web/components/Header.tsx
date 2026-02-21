'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '../app/TranslationProvider';
import { logoutUser } from '../app/actions';

export default function Header({ user }: { user?: { name?: string | null, email?: string | null } }) {
    const pathname = usePathname();
    const t = useTranslation();

    const links = [
        { href: '/', loc: 'fridge', label: t.fridge, icon: '/assets/fish.svg' },
        { href: '/pantry', loc: 'pantry', label: t.pantry, icon: '/assets/sleeping.svg' },
        { href: '/recipes', loc: null, label: t.recipes, icon: '/assets/cook.svg' },
        { href: '/create', loc: null, label: t.create, icon: '/assets/party.svg' },
        { href: '/shopping-list', loc: null, label: t.shoppingList, icon: '/assets/bag1.svg' },
    ];

    const handleDrop = async (e: React.DragEvent, targetLocation: string) => {
        e.preventDefault();
        const productIdStr = e.dataTransfer.getData('productId');
        const sourceLocation = e.dataTransfer.getData('sourceLocation');
        if (productIdStr && sourceLocation && sourceLocation !== targetLocation) {
            const id = parseInt(productIdStr, 10);
            const { moveProduct } = await import('../app/actions');
            moveProduct(id, targetLocation as 'fridge' | 'pantry').catch(console.error);
        }
    };

    return (
        <nav className="bg-sand20/90 backdrop-blur-md sticky top-0 z-50 border-b border-sand30 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="font-heading font-black text-lg md:text-2xl text-primary140 tracking-tight hover:brightness-90 transition-all whitespace-nowrap flex items-center gap-1">
                        КОТО-УЧЁТ <svg className="text-primary100" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A3,3,0,0,0,9,5a3,3,0,0,0,3,3,3,3,0,0,0,3-3A3,3,0,0,0,12,2Zm5,5a3,3,0,0,0-3,3,3,3,0,0,0,3,3,3,3,0,0,0,3-3A3,3,0,0,0,17,7ZM7,7A3,3,0,0,0,4,10a3,3,0,0,0,3,3,3,3,0,0,0,3-3A3,3,0,0,0,7,7Zm5,5c-3.31,0-6,2.69-6,6A5,5,0,0,0,12,22h0a5,5,0,0,0,6-4C18,14.69,15.31,12,12,12Z" /></svg>
                    </Link>
                </div>
                <div className="hidden md:flex gap-1 bg-sand30/50 p-1 rounded-2xl">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onDragOver={(e) => link.loc ? e.preventDefault() : undefined}
                                onDrop={(e) => link.loc ? handleDrop(e, link.loc) : undefined}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${isActive
                                    ? 'bg-white text-primary100 shadow-sm'
                                    : 'text-sand80 hover:text-primary100 hover:bg-white/50'
                                    } ${link.loc ? 'hover:bg-sand30' : ''}`}
                            >
                                <img src={link.icon} alt={link.label} className="w-5 h-5 object-contain" />
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        {user ? (
                            <>
                                <div className="flex items-center gap-2 bg-sand20 px-3 py-1.5 rounded-full border border-sand30">
                                    <Image src="/assets/hello.svg" alt="cat" width={24} height={24} />
                                    <span className="text-sm font-bold text-primary140">{t.greeting}, {user.name || user.email?.split('@')[0]}!</span>
                                </div>
                                <button
                                    onClick={() => logoutUser()}
                                    className="bg-sand30 text-sand80 px-3 py-1.5 rounded-xl font-bold text-xs hover:bg-sand40 transition-all uppercase tracking-wide"
                                >
                                    {t.logout}
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-primary100 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-primary140 transition-all shadow-md active:scale-95 uppercase tracking-wide"
                            >
                                {t.login}
                            </Link>
                        )}
                    </div>
                    <LanguageSwitcher />
                </div>
            </div>
        </nav>
    );
}
