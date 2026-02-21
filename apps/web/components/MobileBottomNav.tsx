'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { moveProduct } from '../app/actions';
import { startTransition } from 'react';

import Image from 'next/image';
import { useTranslation } from '../app/TranslationProvider';

export default function MobileBottomNav() {
    const pathname = usePathname();
    const t = useTranslation();
    const links = [
        { href: '/', loc: 'fridge', label: t.fridge, icon: '/assets/fish.svg' },
        { href: '/pantry', loc: 'pantry', label: t.pantry, icon: '/assets/sleeping.svg' },
        { href: '/recipes', loc: null, label: t.recipes, icon: '/assets/cook.svg' },
        { href: '/shopping-list', loc: null, label: t.shoppingList, icon: '/assets/bag1.svg' },
        { href: '/create', loc: null, label: t.create, icon: '/assets/party.svg' },
    ];

    const handleDrop = async (e: React.DragEvent, targetLocation: string) => {
        e.preventDefault();
        const productIdStr = e.dataTransfer.getData('productId');
        const sourceLocation = e.dataTransfer.getData('sourceLocation');
        if (productIdStr && sourceLocation && sourceLocation !== targetLocation) {
            const id = parseInt(productIdStr, 10);
            startTransition(() => {
                moveProduct(id, targetLocation as 'fridge' | 'pantry').catch(console.error);
            });
        }
    };

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sand20/95 backdrop-blur-lg border-t border-sand30 px-2 py-3 z-50 flex justify-around items-center shadow-[0_-4px_12px_rgba(106,131,35,0.1)]">
            {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        onDragOver={(e) => link.loc ? e.preventDefault() : undefined}
                        onDrop={(e) => link.loc ? handleDrop(e, link.loc) : undefined}
                        className={`flex flex-col items-center gap-1 transition-all relative ${isActive ? 'scale-110' : 'opacity-70'
                            }`}
                    >
                        <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-white shadow-sm ring-2 ring-primary100/20' : ''}`}>
                            <Image src={link.icon} alt={link.label} width={24} height={24} />
                        </div>
                        <div className="flex items-center gap-0.5 mt-1">
                            {isActive && <svg className="text-primary100" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A3,3,0,0,0,9,5a3,3,0,0,0,3,3,3,3,0,0,0,3-3A3,3,0,0,0,12,2Zm5,5a3,3,0,0,0-3,3,3,3,0,0,0,3,3,3,3,0,0,0,3-3A3,3,0,0,0,17,7ZM7,7A3,3,0,0,0,4,10a3,3,0,0,0,3,3,3,3,0,0,0,3-3A3,3,0,0,0,7,7Zm5,5c-3.31,0-6,2.69-6,6A5,5,0,0,0,12,22h0a5,5,0,0,0,6-4C18,14.69,15.31,12,12,12Z" /></svg>}
                            <span className={`text-[10px] font-bold uppercase tracking-tight ${isActive ? 'text-primary100' : 'text-sand80'}`}>
                                {link.label}
                            </span>
                        </div>
                    </Link>
                );
            })}
        </nav>
    );
}
