import { getProducts } from '../app/actions';
import ProductCard from './ProductCard';
import AddProductButton from './AddProductButton';
interface ProductListProps {
    location: 'fridge' | 'pantry';
    isLoggedIn: boolean;
}
export default async function ProductList({ location, isLoggedIn }: ProductListProps) {
    const products = await getProducts(location);
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 p-2 md:p-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} isLoggedIn={isLoggedIn} />
            ))}
            <AddProductButton location={location} />
        </div>
    );
}
