import { getShoppingList } from '../actions';
import ProductCard from '../../components/ProductCard';
import { auth } from '../../auth';
export const dynamic = 'force-dynamic';
export default async function ShoppingListPage() {
    const session = await auth();
    const items = await getShoppingList();
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-heading font-black text-red-500 mb-2">Список Покупок 🛒</h1>
                <p className="text-slate-500 font-bold">Не забудь купить вкусняшки!</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
                {items.map((item) => (
                    <ProductCard key={item.id} product={item} isShoppingList={true} isLoggedIn={!!session?.user} />
                ))}
            </div>
            {items.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-green-200">
                    <div className="text-6xl mb-4">😌</div>
                    <p className="font-bold text-slate-500 text-lg">Всё куплено! Можно отдыхать.</p>
                </div>
            )}
        </div>
    );
}
