import { getShoppingList } from '../actions';
import ProductCard from '../../components/ProductCard';
import { auth } from '../../auth';
import allgood from '../../assets/good.svg';

export const dynamic = 'force-dynamic';

export default async function ShoppingListPage() {
    const session = await auth();
    const items = await getShoppingList();
    const { getDictionary } = await import('../../lib/i18n');
    const t = await getDictionary();
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-heading font-black text-primary100 mb-2 uppercase tracking-wide">{t.shoppingList} 🛒</h1>
                <p className="text-sand80 font-bold uppercase text-xs tracking-widest">{t.dontForget}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
                {items.map((item) => (
                    <ProductCard key={item.id} product={item} isShoppingList={true} isLoggedIn={!!session?.user} />
                ))}
            </div>
            {items.length === 0 && (
                <div className="text-center py-20 bg-sand20 rounded-3xl border-2 border-dashed border-sand40">
                    <img src={allgood.src} alt="Cat" className="w-50 h-50 mx-auto mb-6 block object-contain" />
                    <p className="font-bold text-primary100 text-lg uppercase tracking-wider leading-relaxed" dangerouslySetInnerHTML={{ __html: t.allBought.replace('! ', '!<br/>') }}></p>
                </div>
            )}
        </div>
    );
}
