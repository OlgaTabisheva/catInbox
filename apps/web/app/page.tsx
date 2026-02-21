import ProductList from '../components/ProductList';
import { auth } from '../auth';
import { getDictionary } from '../lib/i18n';

export default async function FridgePage() {
  const session = await auth();
  const t = await getDictionary();
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-heading font-bold text-primary100 mb-2">{t.fridge}</h2>
        <p className="text-sand80">{t.fridgeDesc}</p>
      </div>
      <ProductList location="fridge" isLoggedIn={!!session?.user} />
    </div>
  );
}
