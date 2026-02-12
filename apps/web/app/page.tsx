import ProductList from '../components/ProductList';
import { auth } from '../auth';
export default async function FridgePage() {
  const session = await auth();
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-heading font-bold text-primary mb-2">Холодильник</h2>
        <p className="text-slate-500">Что у нас есть вкусненького?</p>
      </div>
      <ProductList location="fridge" isLoggedIn={!!session?.user} />
    </div>
  );
}
