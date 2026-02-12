import ProductList from '../../components/ProductList';
import { auth } from '../../auth';
export const dynamic = 'force-dynamic';
export default async function PantryPage() {
    const session = await auth();
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-4xl font-heading font-bold text-orange-400 mb-2">Шкаф-Домик</h2>
                <p className="text-slate-500">Запасы на зиму (и не только)</p>
            </div>
            <ProductList location="pantry" isLoggedIn={!!session?.user} />
        </div>
    );
}
