import { getProducts } from '../app/actions';
import ProductCard from './ProductCard';
import AddProductButton from './AddProductButton';
import { getCurrentLang, translateText } from '../lib/i18n';

interface ProductListProps {
    location: 'fridge' | 'pantry';
    isLoggedIn: boolean;
}
export default async function ProductList({ location, isLoggedIn }: ProductListProps) {
    const products = await getProducts(location);
    const lang = await getCurrentLang();
    const translatedProducts = await Promise.all(products.map(async (p) => {
        if (lang === 'en') {
            return { ...p, originalName: p.name, name: await translateText(p.name, lang) };
        }
        return p;
    }));

    return (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-5 p-2 md:p-4">
            {translatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} isLoggedIn={isLoggedIn} />
            ))}
            <AddProductButton location={location} />
        </div>
    );
}
