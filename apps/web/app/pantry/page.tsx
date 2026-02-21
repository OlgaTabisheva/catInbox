import ProductList from '../../components/ProductList';
import { auth } from '../../auth';
import { getDictionary } from '../../lib/i18n';

export const dynamic = 'force-dynamic';
export default async function PantryPage() {
    const session = await auth();
    const t = await getDictionary();
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-4xl font-heading font-bold text-primary100 mb-2">{t.pantryTitle}</h2>
                <p className="text-sand80">{t.pantryDesc}</p>
            </div>
            <ProductList location="pantry" isLoggedIn={!!session?.user} />
        </div>
    );
}
